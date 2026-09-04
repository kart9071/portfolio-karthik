import { useState } from 'react';
import styles from './Contact.module.css';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/contact';

const LINKS = [
  { icon: '📧', label: 'karthikakala13@gmail.com', href: 'mailto:karthikakala13@gmail.com' },
  { icon: '📞', label: '+91 9071846592', href: 'tel:+919071846592' },
  { icon: '💼', label: 'linkedin.com/in/karthik-shetty-b4794b230', href: 'https://www.linkedin.com/in/karthik-shetty-b4794b230/' },
];

const EMPTY = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm]     = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setForm(EMPTY);
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setErrMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <h2 className={styles.title}>Get in Touch</h2>
      <div className={styles.line} />
      <div className={styles.grid}>

        <div className={styles.info}>
          <h3>Let&apos;s build something together</h3>
          <p>
            Whether you need a website, an AI agent, cloud infrastructure, or want to leverage
            Claude Code for your dev team — I&apos;m available for freelance and consulting work.
          </p>
          <div className={styles.links}>
            {LINKS.map(l => (
              <a key={l.href} className={styles.link} href={l.href} target="_blank" rel="noreferrer">
                <div className={styles.linkIcon}>{l.icon}</div>
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={status === 'loading'}
          />
          <input
            className={styles.input}
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={status === 'loading'}
          />
          <textarea
            className={styles.input}
            name="message"
            placeholder="Tell me about your project..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            disabled={status === 'loading'}
          />

          {status === 'success' && (
            <div className={styles.successMsg}>
              ✓ Message received! I&apos;ll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className={styles.errorMsg}>
              ✕ {errMsg}
            </div>
          )}

          <button
            className={styles.btn}
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className={styles.spinner}>Sending…</span>
            ) : 'Send Message →'}
          </button>
        </form>

      </div>
    </section>
  );
}
