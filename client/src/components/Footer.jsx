export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo gradient-text">SSG.</div>
          <p className="footer-text">
            © {new Date().getFullYear()} <strong>Serigne Saliou GNINGUE</strong> — Conçu avec ❤️ &amp; passion
          </p>
          <div className="footer-social">
            <a href="https://github.com/salih-dot-oss" target="_blank" rel="noreferrer" title="GitHub"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/serigne-saliou-gningue-8490b5364/" target="_blank" rel="noreferrer" title="LinkedIn"><i className="fab fa-linkedin"></i></a>
            <a href="mailto:Ssgningue15@yahoo.com" title="Email"><i className="fas fa-envelope"></i></a>
            <a href="https://wa.me/221777462782" target="_blank" rel="noreferrer" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
