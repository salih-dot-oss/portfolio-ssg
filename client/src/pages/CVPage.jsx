import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import '../cv.css'

/**
 * GUIDE DE PERSONNALISATION :
 * Modifiez les valeurs 'level' ci-dessous pour ajuster illes barres de progression.
 */
const PROGRAMMING_SKILLS = [
  { name: 'Python (Expert)', level: 75 },
  { name: 'Java', level: 60 },
  { name: 'Langage C', level: 70 },
  { name: 'JavaScript', level: 70 },
  { name: 'PHP', level: 50 },
  { name: 'Git / GitHub', level: 85 },
  { name: 'UML & Merise', level: 80 },
];

const LANGUAGES = [
  { name: 'Français', level: 90 },
  { name: 'Anglais', level: 40 },
  { name: 'Italien', level: 60 },
];

const SOFT_SKILLS = [
  { name: 'Dynamisme', level: 90 },
  { name: 'Rigueur & Assiduité', level: 95 },
  { name: 'Organisation', level: 85 },
];

function ProgressBar({ name, level }) {
  return (
    <div className="cv-progress-container">
      <div className="cv-progress-label">
        <span>{name}</span>
        <span>{level}%</span>
      </div>
      <div className="cv-progress-bg">
        <div className="cv-progress-fill" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

export default function CVPage() {
  const portfolioUrl = "https://s4l10ux-dev.vercel.app/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(portfolioUrl)}`;

  return (
    <div className="cv-body">
      <div className="cv-actions">
        <Link to="/" className="cv-btn cv-btn-back">RETOUR</Link>
        <Link to="/cv-dev" className="cv-btn cv-btn-back" style={{ background: '#27ae60' }}>PROFIL DEV SEUL</Link>
        <button onClick={() => window.print()} className="cv-btn cv-btn-print">
          <i className="fas fa-file-pdf"></i> ENREGISTRER EN PDF (MAX)
        </button>
      </div>

      <div>

      {/* PAGE 1 */}
      <div className="cv-page">
        <header className="cv-header">
          <div className="cv-header-left">
            <h1 className="cv-name">Serigne Saliou GNINGUE</h1>
            <div className="cv-title">Étudiant en Génie Logiciel & Cybersécurité</div>
            <p className="cv-profile-desc">
              Étudiant en génie logiciel et en cybersécurité, je développe une double expertise qui me permet d’allier conception d’applications robustes et compréhension approfondie des enjeux de sécurité des systèmes d’information. Mon parcours m’apporte une vision globale, orientée à la fois vers la performance, la fiabilité et la protection des données. Curieux et rigoureux, je m’investis pleinement dans l’apprentissage continu afin de renforcer mes compétences en résolution de problèmes complexes et en construction de solutions sécurisées et efficaces.
            </p>
          </div>

          <div className="cv-header-right">
            <ul className="cv-contact-list">
              <li><i className="fas fa-envelope"></i> serigne-saliou.gningue@proton.me</li>
              <li><i className="fas fa-phone"></i> +221 77 746 27 82</li>
              <li><i className="fas fa-phone"></i> +221 76 181 15 74</li>
              <li><i className="fas fa-map-marker-alt"></i> Dakar, Sénégal</li>
              <li><i className="fab fa-linkedin"></i> linkedin.com/in/ssgningue</li>
            </ul>
          </div>
        </header>

        <main className="cv-sections">
          <section>
            <h3 className="cv-section-title">Diplômes et Formations</h3>

            <div className="cv-item">
              <div className="cv-item-header">
                <span>Licence 2 — Génie Logiciel & Systèmes d'Information</span>
                <span>2025 — Présent</span>
              </div>
              <div className="cv-item-sub">École Supérieure Polytechnique (ESP) — Dakar</div>
              <p className="cv-item-desc">Architecture logicielle, modélisation avancée et gestion de projets agiles.</p>
            </div>

            <div className="cv-item">
              <div className="cv-item-header">
                <span>Licence 1 — Génie Logiciel & Systèmes d'Information</span>
                <span>2024 — 2025</span>
              </div>
              <div className="cv-item-sub">École Supérieure Polytechnique (ESP) — Dakar</div>
              <p className="cv-item-desc">Maîtrise de l'algorithmique, structures de données et POO.</p>
            </div>

            <div className="cv-item">
              <div className="cv-item-header">
                <span>Licence 1 — Mathématiques de la Cybersécurité</span>
                <span>2024 — Présent</span>
              </div>
              <div className="cv-item-sub">Université Virtuelle du Sénégal (UVS)</div>
              <p className="cv-item-desc">Cryptographie, réseaux sécurisés et administration Linux.</p>
            </div>

            <div className="cv-item">
              <div className="cv-item-header">
                <span>Baccalauréat Scientifique (S2)</span>
                <span>2023 — 2024</span>
              </div>
              <div className="cv-item-sub">Collège Moderne Troisième Millénaire</div>
            </div>
          </section>

          <section>
            <h3 className="cv-section-title">Génie Logiciel & Programmation</h3>
            <div className="cv-skills-grid">
              {PROGRAMMING_SKILLS.map(skill => (
                <ProgressBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </div>
          </section>
        </main>

        <footer className="cv-page-foot">
          {/* <span>Serigne Saliou GNINGUE</span>
          <span>Page 1 / 2</span> */}
        </footer>
      </div>

      {/* PAGE 2 */}
      <div className="cv-page">
        <main className="cv-sections">
          <section>
            <h3 className="cv-section-title">Cybersécurité & Réseaux</h3>
            <div className="cv-skill-tags">
              <span className="cv-tag">Cisco CCNA</span><span className="cv-tag">Huawei HCIA Datacom</span>
              <span className="cv-tag">Wireshark</span><span className="cv-tag">OSINT</span>
              <span className="cv-tag">Administration Réseaux</span><span className="cv-tag">Kali Linux & Ubuntu</span>
            </div>
          </section>

          <section>
            <h3 className="cv-section-title">Cloud & BDD</h3>
            <div className="cv-skill-tags">
              {/* <span className="cv-tag">Next.js / Express</span> */}
              <span className="cv-tag">Azure Cloud (Création de SandBox)</span>
              <span className="cv-tag">MySQL / Postgres</span>
              {/* <span className="cv-tag">MongoDB</span> */}
              <span className="cv-tag">Docker</span>
              {/* <span className="cv-tag">Tailwind CSS</span> */}
            </div>
          </section>

          <section>
            <h3 className="cv-section-title">Certifications Officielles</h3>
            <div className="cv-item">
              <div className="cv-item-header"><span>CS50 Python — <span className="cv-issuer">Harvard University</span></span></div>
              <div className="cv-item-header"><span>Python Essentials — <span className="cv-issuer">Cisco</span></span></div>
              <div className="cv-item-header"><span>HCIA - Datacom V1.0 — <span className="cv-issuer">Huawei</span></span></div>
              <div className="cv-item-header"><span>CCNA: Introduction aux Réseaux — <span className="cv-issuer">Cisco</span></span></div>
            </div>
          </section>

          <div className="cv-skills-grid">
            <section className="cv-skill-group">
              <h3 className="cv-section-title">Langues</h3>
              {LANGUAGES.map(lang => (
                <ProgressBar key={lang.name} name={lang.name} level={lang.level} />
              ))}
            </section>
            <section className="cv-skill-group">
              <h3 className="cv-section-title">Atouts</h3>
              {SOFT_SKILLS.map(skill => (
                <ProgressBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </section>
          </div>

          <div className="cv-interests-wrapper">
            <section style={{ flex: 1 }}>
              <h3 className="cv-section-title">Centres d'intérêt</h3>
              <ul className="cv-interests-list">
                <li>Sport (Judo)</li>
                <li>Lecture</li>
                <li>Veille technologique</li>
              </ul>
            </section>

            <div className="cv-qr-section">
              <img src={qrCodeUrl} alt="Portfolio QR" className="cv-qr-img" />
              <div className="cv-qr-text">PORTFOLIO EN LIGNE</div>
            </div>
          </div>
        </main>

        <footer className="cv-page-foot">
          {/* <span>Page 2 / 2</span> */}
        </footer>
      </div>
      </div>
    </div>
  )
}
