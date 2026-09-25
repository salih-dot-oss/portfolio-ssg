import React from 'react'
import { Link } from 'react-router-dom'
import '../cv.css'

/**
 * SKILLS DATA FOR DEV PROFILE
 */
const PROGRAMMING_SKILLS = [
  { name: 'Python', level: 65 },
  { name: 'JavaScript / React', level: 80 },
  { name: 'Java', level: 70 },
  { name: 'Langage C', level: 75 },
  { name: 'UML & Merise', level: 55 },
  { name: 'Git / GitHub', level: 85 },
];

const TOOLS_FRAMEWORKS = [
  { name: 'React / Vite', level: 50 },
  // { name: 'Node.js / Express', level: 65 },
  { name: 'MySQL / PostgreSQL', level: 55 },
  { name: 'Sandbox', level: 60 },
  { name: 'PHP', level: 55 },
  { name: 'Supabase', level: 70 },
];

const LANGUAGES = [
  { name: 'Français', level: 85 },
  { name: 'Italien', level: 65 },
  { name: 'Anglais (Technique)', level: 45 },
];

const SOFT_SKILLS = [
  { name: 'Rigueur & Analyse', level: 95 },
  { name: 'Autonomie', level: 90 },
  { name: 'Esprit d\'équipe', level: 85 },
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

export default function CVDevPage() {
  const portfolioUrl = "https://s4l10ux-dev.vercel.app/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(portfolioUrl)}`;

  return (
    <div className="cv-body">
      <div className="cv-actions">
        <Link to="/cv" className="cv-btn cv-btn-back">VERSION MIXTE</Link>
        <Link to="/" className="cv-btn cv-btn-back">RETOUR ACCUEIL</Link>
        <button onClick={() => window.print()} className="cv-btn cv-btn-print">
          <i className="fas fa-file-pdf"></i> PDF (DEV VERSION)
        </button>
      </div>

      <div className="cv-page">
        <header className="cv-header" style={{ marginBottom: '15px' }}>
          <div className="cv-header-left">
            <h1 className="cv-name">Serigne Saliou GNINGUE</h1>
            <div className="cv-title">Étudiant en Génie Logiciel & Systèmes d'Information</div>
            <p className="cv-profile-desc">
              Passionné par le développement logiciel et l'architecture des systèmes, je me spécialise dans la conception d'applications performantes et évolutives. Mon parcours académique à l'ESP m'a permis d'acquérir une expertise solide en algorithmique, en programmation orientée objet et en gestion de bases de données. Je m'attache à produire un code propre et maintenable, tout en adoptant des méthodologies de travail modernes pour répondre aux exigences complexes du génie logiciel.
            </p>
          </div>

          <div className="cv-header-right">
            <ul className="cv-contact-list" style={{ fontSize: '13px' }}>
              <li><i className="fas fa-envelope"></i> serigne-saliou.gningue@proton.me</li>
              <li><i className="fas fa-phone"></i> +221 77 746 27 82</li>
              <li><i className="fas fa-phone"></i> +221 76 181 15 74</li>
              <li><i className="fas fa-map-marker-alt"></i> Dakar, Sénégal</li>
              <li><i className="fab fa-linkedin"></i> linkedin.com/in/ssgningue</li>
            </ul>
          </div>
        </header>

        <main className="cv-sections" style={{ gap: '15px' }}>
          <section>
            <h3 className="cv-section-title" style={{ marginBottom: '8px' }}>Parcours Académique</h3>
            <div className="cv-item" style={{ marginBottom: '8px' }}>
              <div className="cv-item-header">
                <span>Licence 2 — Génie Logiciel & Systèmes d'Information</span>
                <span>2025 — Présent</span>
              </div>
              <div className="cv-item-sub">École Supérieure Polytechnique (ESP) — Dakar</div>
              <p className="cv-item-desc">Architecture logicielle avancée, modélisation objet complexes, développement Web & Mobile.</p>
            </div>

            <div className="cv-item" style={{ marginBottom: '8px' }}>
              <div className="cv-item-header">
                <span>Licence 1 — Génie Logiciel & Systèmes d'Information</span>
                <span>2024 — 2025</span>
              </div>
              <div className="cv-item-sub">École Supérieure Polytechnique (ESP) — Dakar</div>
              <p className="cv-item-desc">Algorithmique, programmation et structures de données</p>
            </div>

            <div className="cv-item" style={{ marginBottom: '0' }}>
              <div className="cv-item-header">
                <span>Baccalauréat Scientifique (S2)</span>
                <span>2023 — 2024</span>
              </div>
              <div className="cv-item-sub">Collège Moderne Troisième Millénaire — Dakar</div>
            </div>
          </section>

          <section>
            <h3 className="cv-section-title" style={{ marginBottom: '10px' }}>Compétences Techniques</h3>
            <div className="cv-skills-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '10px' }}>
              <div>
                <ProgressBar name="Python & C" level={75} />
                <ProgressBar name="HTML / CSS / JS" level={80} />
              </div>
              <div>
                <ProgressBar name="Java & PHP" level={60} />
                <ProgressBar name="MySQL / BDD" level={45} />
              </div>
              <div>
                <ProgressBar name="Git / GitHub" level={80} />
                <ProgressBar name="UML & Merise" level={70} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="cv-section-title" style={{ marginBottom: '6px', fontSize: '18px' }}>Certifications</h3>
            <div className="cv-skill-tags" style={{ display: 'flex', flexDirection: 'row', gap: '6px', flexWrap: 'nowrap' }}>
              <div className="cv-tag" style={{ border: '1px solid #eee', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <strong>CS50 Python</strong> — Harvard
              </div>
              <div className="cv-tag" style={{ border: '1px solid #eee', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <strong>Python Essentials</strong> — Cisco
              </div>
              <div className="cv-tag" style={{ border: '1px solid #eee', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <strong>CCNA 1</strong> — Cisco
              </div>
              <div className="cv-tag" style={{ border: '1px solid #eee', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                <strong>HCIA - Datacom</strong> — Huawei
              </div>
            </div>
          </section>

          <div className="cv-skills-grid" style={{ gap: '20px', marginBottom: 0 }}>
            <section className="cv-skill-group">
              <h3 className="cv-section-title" style={{ marginBottom: '10px' }}>Langues</h3>
              {LANGUAGES.map(lang => (
                <ProgressBar key={lang.name} name={lang.name} level={lang.level} />
              ))}
            </section>
            <section className="cv-skill-group">
              <h3 className="cv-section-title" style={{ marginBottom: '10px' }}>Soft Skills</h3>
              {SOFT_SKILLS.map(skill => (
                <ProgressBar key={skill.name} name={skill.name} level={skill.level} />
              ))}
            </section>
          </div>

          <div className="cv-interests-wrapper" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <section style={{ flex: 1 }}>
              <h3 className="cv-section-title" style={{ marginBottom: '5px', fontSize: '14px' }}>Centres d'intérêt</h3>
              <ul className="cv-interests-list" style={{ display: 'flex', gap: '15px', fontSize: '11px', margin: 0, padding: 0 }}>
                <li>Veille technologique</li>
                <li>Lecture technique</li>
                <li>Sport(Judo)</li>
              </ul>
            </section>

            <div className="cv-qr-section" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: '#e3f2fd', borderRadius: '12px', flexShrink: 0 }}>
              <img src={qrCodeUrl} alt="Portfolio QR" className="cv-qr-img" style={{ width: '85px', height: '85px' }} />
              <div className="cv-qr-text" style={{ textAlign: 'left', fontSize: '10px', color: '#1a1a1a', fontWeight: '800' }}>
                REJOIGNEZ-MOI <br /> SUR MON <br /> PORTFOLIO
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
