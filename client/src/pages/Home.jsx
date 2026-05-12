import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const features = [
  { icon:'⚡', title:'Lightning Fast', desc:'Sub-10ms response times powered by edge computing and intelligent caching strategies across 200+ global nodes.' },
  { icon:'🔐', title:'Zero Trust Security', desc:'Enterprise-grade encryption, MFA, SSO, and real-time threat detection protecting every request end-to-end.' },
  { icon:'📊', title:'Deep Analytics', desc:'Real-time dashboards with AI-driven insights, anomaly detection, and predictive modeling for your data.' },
  { icon:'🤖', title:'AI Integration', desc:'Plug-and-play models from OpenAI, Anthropic, and open-source LLMs — all through a unified API layer.' },
  { icon:'🌐', title:'Global Scale', desc:'Multi-region deployments with 99.99% uptime SLA, automatic failover, and horizontal auto-scaling.' },
  { icon:'🔧', title:'DevOps Native', desc:'CI/CD pipelines, Terraform modules, Helm charts, and native Kubernetes operators ready on day one.' },
];

const pricing = [
  { name:'Starter', price:'$0', period:'Forever free', color:'var(--text2)',
    features:['5 projects','10 GB storage','Community support','Basic analytics','API access'] },
  { name:'Pro', price:'$49', period:'per month', color:'var(--primary)', badge:'Most Popular',
    features:['Unlimited projects','500 GB storage','Priority support','Advanced analytics','AI integrations','Custom domains'] },
  { name:'Enterprise', price:'Custom', period:'per year', color:'var(--accent2)',
    features:['Everything in Pro','Dedicated infrastructure','SLA guarantee','SAML SSO','Audit logs','White-label options'] },
];

const stats = [
  { val:'12K+', label:'Developers' },
  { val:'99.99%', label:'Uptime' },
  { val:'200+', label:'Global Nodes' },
  { val:'4.9★', label:'User Rating' },
];

export default function Home() {
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.gridBg} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className="container">
          <div className={styles.badge}>
            <span className={styles.dot} /> Now in Public Beta · v2.0
          </div>
          <h1 className={styles.headline}>
            Build the<br />
            <span className={styles.gradientText}>Future of Tech</span><br />
            Without Limits
          </h1>
          <p className={styles.subhead}>
            NexCore is the unified cloud platform for developers who refuse<br />
            to compromise on speed, security, or scale.
          </p>
          <div className={styles.ctas}>
            <Link to="/register" className={styles.ctaPrimary}>
              Start Building Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#features" className={styles.ctaSecondary}>
              Explore Features
            </a>
          </div>
          <div className={styles.heroStats}>
            {stats.map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statVal}>{s.val}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.section} id="features">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Platform Features</p>
            <h2 className={styles.sectionTitle}>Everything you need<br />to ship faster</h2>
          </div>
          <div className={styles.featureGrid}>
            {features.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.bannerInner}>
            <div className={styles.bannerGlow} />
            <h2 className={styles.bannerTitle}>Ready to accelerate your workflow?</h2>
            <p className={styles.bannerSub}>Join 12,000+ engineers already building on NexCore.</p>
            <Link to="/register" className={styles.ctaPrimary}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className={styles.section} id="pricing">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Pricing</p>
            <h2 className={styles.sectionTitle}>Simple, transparent pricing</h2>
          </div>
          <div className={styles.pricingGrid}>
            {pricing.map(p => (
              <div key={p.name} className={`${styles.pricingCard} ${p.badge ? styles.featured : ''}`}>
                {p.badge && <div className={styles.badge2}>{p.badge}</div>}
                <p className={styles.planName}>{p.name}</p>
                <div className={styles.planPrice}>
                  <span className={styles.priceNum} style={{ color: p.color }}>{p.price}</span>
                  <span className={styles.pricePeriod}>/{p.period}</span>
                </div>
                <ul className={styles.planFeatures}>
                  {p.features.map(f => (
                    <li key={f}><span className={styles.check}>✓</span>{f}</li>
                  ))}
                </ul>
                <Link to="/register"
                  className={p.badge ? styles.ctaPrimary : styles.ctaOutline}
                  style={{ display:'block', textAlign:'center', marginTop:'auto' }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
