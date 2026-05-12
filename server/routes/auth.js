const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── helpers ─────────────────────────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sanitizeUser = (u) => ({
  id: u.id,
  fullName: u.full_name,
  email: u.email,
  role: u.role,
  avatarUrl: u.avatar_url,
  company: u.company,
  bio: u.bio,
  isVerified: u.is_verified,
  createdAt: u.created_at,
});

// ── POST /api/auth/register ───────────────────────────────────────────────
router.post(
  '/register',
  [
    body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('company').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, password, company } = req.body;

    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length) {
        return res.status(409).json({ success: false, message: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, company)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [fullName, email, passwordHash, company || null]
      );

      const user  = result.rows[0];
      const token = signToken(user.id);

      await pool.query(
        `UPDATE users SET last_login = NOW() WHERE id = $1`,
        [user.id]
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ success: false, message: 'Server error during registration' });
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!result.rows.length) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user  = result.rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = signToken(user.id);
      await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── PUT /api/auth/profile ─────────────────────────────────────────────────
router.put('/profile', authenticate, async (req, res) => {
  const { fullName, company, bio } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET full_name = COALESCE($1, full_name),
                        company   = COALESCE($2, company),
                        bio       = COALESCE($3, bio),
                        updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [fullName, company, bio, req.user.id]
    );
    res.json({ success: true, user: sanitizeUser(result.rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Profile update failed' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────
router.post('/logout', authenticate, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
