import { useReveal } from '../hooks/useReveal'

const TIMELINE = [
  {
    emoji: '🏛️',
    period: '2023 — Présent',
    school: 'École Supérieure Polytechnique (ESP) — Dakar',
    degree: 'Licence en Génie Logiciel & Systèmes d\'Information',
    desc: "Formation d'excellence axée sur la conception et le développement de systèmes informatiques complexes. Acquisition de bases solides en algorithmique, architecture logicielle et gestion de projets.",
    tags: ['Algorithmique','Structures de données','Bases de données','Génie Logiciel','UML / Merise','Conception d\'applications'],
  },
  {
    emoji: '🔒',
    period: '2023 — Présent',
    school: 'Université Virtuelle du Sénégal (UVS)',
    degree: 'Formation en Cybersécurité (niveau débutant)',
    desc: 'Formation complémentaire qui enrichit ma vision du développement logiciel avec une approche orientée sécurité. Compréhension des vulnérabilités et des principes de défense des systèmes.',
    tags: ['Sécurité informatique','Vulnérabilités','Réseaux','Raisonnement sécurité'],
  },
  {
    emoji: '🎓',
    period: '2023',
    school: 'Baccalauréat',
    degree: 'Diplôme de fin d\'études secondaires',
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
              <div className="timeline-dot">{item.emoji}</div>
              <div className="timeline-card">
                <div className="timeline-period">{item.period}</div>
                <div className="timeline-school">{item.school}</div>
                <div className="timeline-degree">{item.degree}</div>
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
