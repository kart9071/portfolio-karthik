import Contact from './components/Contact';
import Experience from './components/Experience';
import Hero from './components/Hero';
import Nav from './components/Nav';
import Services from './components/Services';
import Skills from './components/Skills';

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <Skills />
      <Experience />
      <Contact />
      <footer style={{
        textAlign: 'center', padding: '2rem',
        color: 'var(--muted)', fontSize: '0.85rem',
        borderTop: '1px solid var(--border)'
      }}>
        © 2026 Karthik Shetty
      </footer>
    </>
  );
}

export default App;
