import { EXPERIENCE } from '../data';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="experience" className={styles.section}>
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.line} />
      <div className={styles.timeline}>
        {EXPERIENCE.map(e => (
          <div className={styles.item} key={e.company}>
            <div className={styles.dot} />
            <div className={styles.card}>
              <div className={styles.header}>
                <span className={styles.company}>{e.company}</span>
                <span className={styles.period}>{e.period}</span>
              </div>
              <div className={styles.role}>{e.role} · {e.location}</div>
              <ul className={styles.bullets}>
                {e.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
