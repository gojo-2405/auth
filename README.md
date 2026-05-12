# ⬡ NexCore — Professional Tech Platform

A full-stack tech platform with React + Vite frontend, Node.js/Express API, and PostgreSQL (AWS RDS-ready) backend.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL running locally **OR** an AWS RDS endpoint

---

### 1. Clone & Install

```bash
# Install root + client dependencies
npm run install:all

# or with pnpm:
pnpm install
cd client && pnpm install && cd ..
```

---

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techsite_db
DB_USER=postgres
DB_PASSWORD=your_password

# AWS RDS (replace above with):
# DB_HOST=your-instance.xxxx.us-east-1.rds.amazonaws.com
# DB_SSL=true

JWT_SECRET=change_this_to_a_long_random_string
```

---

### 3. Create the Database

```bash
# If using local PostgreSQL:
psql -U postgres -c "CREATE DATABASE techsite_db;"
```

The schema (users + refresh_tokens tables) is created automatically on first run.

---

### 4. Run in Development

```bash
npm run dev
```

This starts both:
- **API server** → http://localhost:5000
- **React frontend** → http://localhost:5173

---

### 5. Build for Production

```bash
npm run build       # builds React app to client/dist/
npm start           # runs Express (serves API only; use nginx/CDN for static)
```

---

## 🗄️ AWS RDS Setup

1. Create a PostgreSQL RDS instance in your AWS console
2. Allow inbound on port 5432 from your server's security group
3. Update `.env`:
   ```env
   DB_HOST=your-rds-endpoint.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=techsite_db
   DB_USER=postgres
   DB_PASSWORD=your_rds_password
   DB_SSL=true
   ```

---

## 📁 Project Structure

```
techsite/
├── server/
│   ├── index.js          # Express app entry
│   ├── db.js             # PostgreSQL pool + schema init
│   ├── middleware/
│   │   └── auth.js       # JWT authentication
│   └── routes/
│       └── auth.js       # /api/auth/* endpoints
├── client/
│   ├── src/
│   │   ├── context/      # AuthContext (JWT state)
│   │   ├── pages/        # Home, Login, Register, Dashboard
│   │   └── components/   # Navbar, Footer
│   └── vite.config.js
├── .env.example
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No  | Create account |
| POST | `/api/auth/login`    | No  | Sign in, get JWT |
| GET  | `/api/auth/me`       | Yes | Get current user |
| PUT  | `/api/auth/profile`  | Yes | Update profile |
| POST | `/api/auth/logout`   | Yes | Logout |
| GET  | `/api/health`        | No  | Server health check |

---

## 🛡️ Security Features

- **bcrypt** password hashing (cost factor 12)
- **JWT** access tokens (7-day expiry)
- **Helmet** security headers
- **Rate limiting** on auth routes (20 req/15min)
- **Input validation** with express-validator
- **CORS** restricted to frontend origin
- **SSL** support for AWS RDS connections
