import { Link, useLocation } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname === '/dashboard') return null;
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>⬡ Nex<span className={styles.accent}>Core</span></span>
          <p className={styles.tagline}>Infrastructure built for the next generation of developers.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <div className={styles.colHead}>Product</div>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link to="/register">Sign Up</Link>
          </div>
          <div className={styles.col}>
            <div className={styles.colHead}>Company</div>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
          <div className={styles.col}>
            <div className={styles.colHead}>Legal</div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© 2025 NexCore Inc. All rights reserved.</span>
        <div className={styles.socials}>
          <a href="#">GitHub</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
