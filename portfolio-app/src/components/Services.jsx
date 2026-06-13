import { SERVICES, CLAUDE_FEATURES } from '../data';
import styles from './Services.module.css';

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <h2 className={styles.title}>Services</h2>
      <div className={styles.line} />

      <div className={styles.grid}>
        {SERVICES.map(s => (
          <div className={styles.card} key={s.label}>
            <div className={styles.icon} style={{ background: s.color }}>{s.icon}</div>
            <h3>{s.label}</h3>
            <p>{s.desc}</p>
            <span className={styles.tag}>{s.tag}</span>
          </div>
        ))}
      </div>

      <div className={styles.claudeBanner}>
        <div className={styles.claudeIcon}>⚡</div>
        <div>
          <h3>Claude Code Services</h3>
          <p>
            I leverage Claude Code — Anthropic&apos;s AI-powered coding assistant — to deliver faster,
            higher-quality software for your projects. AI-augmented development means shorter
            cycles and better code.
          </p>
          <div className={styles.claudeFeatures}>
            {CLAUDE_FEATURES.map(f => (
              <span className={styles.claudeFeature} key={f}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
