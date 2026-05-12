import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm]     = useState({ fullName:'', email:'', password:'', company:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const data = await register(form);
      if (!data.success) {
        if (data.errors) {
          const map = {};
          data.errors.forEach(err => { map[err.path] = err.msg; });
          setErrors(map);
        } else {
          setErrors({ global: data.message || 'Registration failed' });
        }
      }
    } catch (err) {
      setErrors({ global: err.response?.data?.message || 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <Link to="/" className={styles.logoSmall}>⬡ NexCore</Link>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.sub}>Start building for free today</p>
        </div>

        {errors.global && <div className={styles.error}>{errors.global}</div>}

        <form onSubmit={submit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Full name</label>
              <input className={`${styles.input} ${errors.fullName ? styles.inputErr : ''}`}
                name="fullName" value={form.fullName} onChange={handle}
                placeholder="Jane Smith" required />
              {errors.fullName && <span className={styles.fieldErr}>{errors.fullName}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Company <span className={styles.optional}>(optional)</span></label>
              <input className={styles.input} name="company"
                value={form.company} onChange={handle} placeholder="Acme Inc." />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Work email</label>
            <input className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
              type="email" name="email" value={form.email} onChange={handle}
              placeholder="you@company.com" required />
            {errors.email && <span className={styles.fieldErr}>{errors.email}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
              type="password" name="password" value={form.password} onChange={handle}
              placeholder="Min. 8 characters" required />
            {errors.password && <span className={styles.fieldErr}>{errors.password}</span>}
          </div>

          <div className={styles.terms}>
            By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>

          <button className={styles.btn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create Free Account'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
