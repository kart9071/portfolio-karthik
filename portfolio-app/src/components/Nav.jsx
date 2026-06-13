import { useState, useEffect } from 'react';
import { NAV_LINKS } from '../data';
import profileImg from '../assets/profile.jpg';
import styles from './Nav.module.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#hero" className={styles.brand}>
        <img src={profileImg} alt="Karthik Shetty" className={styles.avatar} />
        <span className={styles.brandName}>Karthik Shetty</span>
      </a>
      <ul className={styles.links}>
        {NAV_LINKS.filter(l => l.href !== '#hero').map(l => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
