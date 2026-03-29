import { useEffect, useState } from 'react'

const PHRASES = [
  'Étudiant en Génie Logiciel',
  'Étudiant en Cybersécurité',
]

export default function Hero() {
  const [typedText, setTypedText] = useState('')

  // ── Typing animation ────────────────────────────────────
  useEffect(() => {
    let pi = 0, ci = 0, deleting = false, timer

    function type() {
      const phrase = PHRASES[pi]
      const next   = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++)
      setTypedText(next)

      if (!deleting && ci > phrase.length)  { deleting = true;  timer = setTimeout(type, 1800); return }
      if (deleting  && ci < 0)              { deleting = false; pi = (pi + 1) % PHRASES.length; ci = 0 }
      timer = setTimeout(type, deleting ? 45 : 75)
    }
    type()
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="hero" className="hero">
      {/* Fond immersif */}
      <div className="hero-grid-overlay" />
      <div className="hero-orb orb-1" /><div className="hero-orb orb-2" /><div className="hero-orb orb-3" />

      <div className="container hero-container">
        
        {/* Colonne Texte */}
        <div className="hero-content reveal-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Disponible pour stages &amp; projets
          </div>

          <h1 className="hero-name">
            Serigne Saliou<br />
            <span className="gradient-text-modern">GNINGUE</span>
          </h1>

          <div className="hero-typing-wrap">
            <div className="hero-typing">
              {typedText}<span className="cursor" />
            </div>
          </div>

          <p className="hero-tagline">
            <strong>Génie Logiciel &amp; Cybersécurité</strong><br />
            <span>Construire, Apprendre, Évoluer — <em>un code à la fois.</em></span>
          </p>

          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary btn-glow">
              <i className="fas fa-code"></i> Voir mes projets
            </a>
            <a href="#contact" className="btn btn-outline">
              <i className="fas fa-paper-plane"></i> Me contacter
            </a>
          </div>
        </div>

        {/* Colonne Visuelle (Avatar Pop-out Premium) */}
        <div className="hero-visual reveal-right">
          <div className="hero-avatar-wrapper">
             {/* Halo lumineux (Glow) */}
             <div className="avatar-glow-pulse" />
             
             {/* Le portrait (Style Pop-out) */}
             <div className="about-avatar hero-avatar-premium">
                <div className="avatar-bg"></div>
                <div className="avatar-body">
                   <img src="/Megemini.png" alt="Serigne Saliou GNINGUE" />
                </div>
                <div className="avatar-ring-front" />
                <div className="avatar-head">
                   <img src="/Megemini.png" alt="Serigne Saliou GNINGUE" />
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  )
}
