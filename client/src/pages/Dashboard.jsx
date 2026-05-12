import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

const metrics = [
  { label:'API Requests', value:'1,284,392', change:'+12.4%', up:true, icon:'📡' },
  { label:'Active Projects', value:'7', change:'+2', up:true, icon:'🚀' },
  { label:'Storage Used', value:'48.3 GB', change:'-5.1%', up:false, icon:'💾' },
  { label:'Uptime', value:'99.98%', change:'This month', up:true, icon:'⚡' },
];

const activity = [
  { action:'Deployment triggered', project:'api-gateway-v3', time:'2 min ago', status:'success' },
  { action:'Build completed', project:'frontend-main', time:'14 min ago', status:'success' },
  { action:'DB migration ran', project:'postgres-primary', time:'1 hr ago', status:'success' },
  { action:'Alert fired', project:'cache-cluster', time:'3 hr ago', status:'warning' },
  { action:'SSL renewed', project:'nexcore.io', time:'6 hr ago', status:'success' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('overview');

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>⬡ <span>Nex<span className={styles.accent}>Core</span></span></div>
        <nav className={styles.sideNav}>
          {['overview','projects','analytics','settings'].map(t => (
            <button key={t} className={`${styles.navItem} ${tab === t ? styles.active : ''}`}
              onClick={() => setTab(t)}>
              {{ overview:'📊', projects:'🚀', analytics:'📈', settings:'⚙️' }[t]}
              <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
            </button>
          ))}
        </nav>
        <button className={styles.logoutBtn} onClick={logout}>
          <span>↪</span> Logout
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Good morning, {user?.fullName?.split(' ')[0] || 'Developer'} 👋</h1>
            <p className={styles.pageSub}>Here's what's happening with your infrastructure today.</p>
          </div>
          <div className={styles.userBadge}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <div className={styles.userName}>{user?.fullName}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
        </header>

        {/* Metrics */}
        <div className={styles.metricsGrid}>
          {metrics.map(m => (
            <div key={m.label} className={styles.metricCard}>
              <div className={styles.metricTop}>
                <span className={styles.metricIcon}>{m.icon}</span>
                <span className={`${styles.change} ${m.up ? styles.up : styles.down}`}>{m.change}</span>
              </div>
              <div className={styles.metricVal}>{m.value}</div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className={styles.contentGrid}>
          {/* Recent Activity */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Recent Activity</h2>
              <span className={styles.liveTag}>⬤ Live</span>
            </div>
            <div className={styles.activityList}>
              {activity.map((a, i) => (
                <div key={i} className={styles.activityItem}>
                  <div className={`${styles.statusDot} ${styles[a.status]}`} />
                  <div className={styles.activityInfo}>
                    <span className={styles.activityAction}>{a.action}</span>
                    <span className={styles.activityProject}>{a.project}</span>
                  </div>
                  <span className={styles.activityTime}>{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>Account</h2>
            </div>
            <div className={styles.accountInfo}>
              <div className={styles.bigAvatar}>{initials}</div>
              <div className={styles.accountName}>{user?.fullName}</div>
              <div className={styles.accountEmail}>{user?.email}</div>
              {user?.company && <div className={styles.accountCompany}>🏢 {user.company}</div>}
              <div className={styles.accountRole}>{user?.role?.toUpperCase()}</div>
              <div className={styles.planBadge}>⬡ Starter Plan</div>
              <button className={styles.upgradBtn}>Upgrade to Pro →</button>
            </div>
          </div>
        </div>

        {/* Usage bar */}
        <div className={styles.panel} style={{ marginTop: 0 }}>
          <div className={styles.panelHead}>
            <h2 className={styles.panelTitle}>Resource Usage</h2>
            <span className={styles.period}>Last 30 days</span>
          </div>
          <div className={styles.usageBars}>
            {[
              { label:'API Calls', used:1284, max:5000, unit:'K' },
              { label:'Storage',   used:48,   max:100,  unit:'GB' },
              { label:'Bandwidth', used:234,  max:1000, unit:'GB' },
            ].map(u => (
              <div key={u.label} className={styles.usageBar}>
                <div className={styles.usageTop}>
                  <span className={styles.usageLabel}>{u.label}</span>
                  <span className={styles.usageVal}>{u.used}{u.unit} / {u.max}{u.unit}</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${(u.used/u.max)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
