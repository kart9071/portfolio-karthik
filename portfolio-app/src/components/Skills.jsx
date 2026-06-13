import { SKILLS } from '../data';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <section id="skills" className={styles.section}>
      <h2 className={styles.title}>Skills &amp; Technologies</h2>
      <div className={styles.line} />
      <div className={styles.grid}>
        {SKILLS.map(sg => (
          <div className={styles.group} key={sg.group}>
            <div className={styles.groupTitle}>{sg.group}</div>
            <div className={styles.tags}>
              {sg.items.map(s => (
                <span className={styles.tag} key={s}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
