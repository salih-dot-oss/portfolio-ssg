import { useReveal } from '../hooks/useReveal'

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" className="section about">
      <div className="container" ref={ref}>
        <div className="about-grid">

          {/* Stats gauche */}
          <div className="reveal">
            <div className="about-stats">
              {[
                { num: '2+', label: 'Années de formation' },
                { num: '2',  label: 'Établissements'      },
                { num: '4',  label: 'Certifications'      },
                { num: '∞',  label: 'Curiosité'           },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-num gradient-text">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Texte droite */}
          <div className="about-text reveal">
            <span className="section-tag">
              <i className="fas fa-user-astronaut"></i> À propos de moi
            </span>
            <h2 className="section-title">
              Développeur en construction,<br />
              <span className="gradient-text">passionné par défaut.</span>
            </h2>
            <p>
              Je suis <strong>Serigne Saliou GNINGUE</strong>, étudiant en{' '}
              <strong>Génie Logiciel &amp; Systèmes d'Information</strong> à l'École
              Supérieure Polytechnique de Dakar (ESP), et en{' '}
              <strong>Cybersécurité</strong> à l'Université Virtuelle du Sénégal (UVS).
            </p>
            <p>
              Mon double parcours me confère une vision unique : je pense la conception
              logicielle avec une sensibilité naturelle pour la{' '}
              <strong>robustesse, la sécurité et la qualité</strong>. Chaque projet est
              pour moi une occasion d'apprendre et de m'améliorer.
            </p>
            <p>
              Animé par la rigueur et la curiosité, j'aspire à construire des solutions
              logicielles qui ont un impact réel, tout en développant mon expertise en
              cybersécurité.
            </p>

            <div className="about-tags">
              {['Cybersécurité','Algorithmique','Bases de données','Réseaux'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            <div className="about-btns">
              <a href="https://github.com/salih-dot-oss" target="_blank" rel="noreferrer" className="btn btn-primary">
                <i className="fab fa-github"></i> GitHub
              </a>
              <a href="https://www.linkedin.com/in/serigne-saliou-gningue-8490b5364/" target="_blank" rel="noreferrer" className="btn btn-outline">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
