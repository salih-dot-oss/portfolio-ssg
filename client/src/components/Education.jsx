import { useReveal } from '../hooks/useReveal'

const TIMELINE = [
  {
    period: 'Licence 2 — 2025 · Présent',
    degree: 'GLSI — Génie Logiciel & Systèmes d\'Information',
    school: 'École Supérieure Polytechnique (ESP) — Dakar',
    icon: 'fa-university',
    desc: "Approfondissement en architecture logicielle, conception de systèmes complexes et gestion de projets informatiques.",
    tags: ['Algorithmique','Architecture logicielle','Bases de données','UML / Merise','Génie Logiciel'],
  },
  {
    period: 'Licence 1 — 2024 · 2025',
    degree: 'GLSI — Génie Logiciel & Systèmes d\'Information',
    school: 'École Supérieure Polytechnique (ESP) — Dakar',
    icon: 'fa-university',
    desc: "Fondations solides en algorithmique, programmation orientée objet, bases de données et conception d'applications.",
    tags: ['Algorithmique','Structures de données','Programmation','Conception d\'applications'],
  },
  {
    period: 'Licence 2 — 2025 · Présent',
    degree: 'SIMAC — Sciences Informatiques et Mathématiques de la Cybersécurité',
    school: 'Université Virtuelle du Sénégal (UVS)',
    icon: 'fa-user-shield',
    desc: 'Approfondissement en sécurité offensive et défensive, administration des réseaux et protection des systèmes d\'information.',
    tags: ['Sécurité offensive','Administration réseaux','Cryptographie','Forensic','Cyberdéfense'],
  },
  {
    period: 'Licence 1 — 2024 · 2025',
    degree: 'SIMAC — Sciences Informatiques et Mathématiques de la Cybersécurité',
    school: 'Université Virtuelle du Sénégal (UVS)',
    icon: 'fa-user-shield',
    desc: 'Formation orientée sécurité des systèmes d\'information, réseaux et mobilité. Compréhension des vulnérabilités et des principes de défense.',
    tags: ['Sécurité informatique','Réseaux','OSINT','Cryptographie','Cyberdéfense'],
  },
  {
    period: '2024',
    degree: 'Baccalauréat — Diplôme de fin d\'études secondaires',
    school: 'Collège Moderne Troisième Millénaire — Groupe Les Pédagogues',
    icon: 'fa-certificate',
    desc: "Obtention du baccalauréat, porte d'entrée vers les études supérieures en ingénierie et informatique.",
    tags: [],
  },
]

export default function Education() {
  const ref = useReveal()

  return (
    <section id="education" className="section">
      <div className="container" ref={ref}>
        <div className="education-header reveal">
          <span className="section-tag"><i className="fas fa-graduation-cap"></i> Formation</span>
          <h2 className="section-title">Mon parcours académique</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Un double cursus ambitieux pour une vision complète du monde numérique.
          </p>
        </div>

        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item reveal">
              <div className="timeline-dot"><i className={`fas ${item.icon}`}></i></div>
              <div className="timeline-card">
                <div className="timeline-period">{item.period}</div>
                <div className="timeline-degree">{item.degree}</div>
                {item.school && <div className="timeline-school">{item.school}</div>}
                <p className="timeline-desc">{item.desc}</p>
                {item.tags.length > 0 && (
                  <div className="timeline-tags">
                    {item.tags.map(t => <span key={t} className="timeline-tag">{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
