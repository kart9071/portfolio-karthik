import styles from './Hero.module.css';

const STATS = [
  { num: '100+', label: 'REST APIs Built' },
  { num: '500+', label: 'Active Users Served' },
  { num: '10k+', label: 'Docs in RAG Pipeline' },
  { num: '40%', label: 'DB Load Reduced' },
];

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.dot} /> Available for freelance &amp; consulting
        </div>
        <h1>
          <span className={styles.role}>Developer &amp; AI Engineer</span>
        </h1>
        <p className={styles.desc}>
          Building scalable web products, AI-powered systems, and cloud infrastructure.
          1.5+ years shipping production software — from RAG chatbots to Chrome extensions.
        </p>
        <div className={styles.cta}>
          <a className={styles.btnPrimary} href="#services">View Services</a>
          <a className={styles.btnOutline} href="#contact">Get in Touch</a>
        </div>
        <div className={styles.stats}>
          {STATS.map(s => (
            <div className={styles.stat} key={s.label}>
              <div className={styles.statNum}>{s.num}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
