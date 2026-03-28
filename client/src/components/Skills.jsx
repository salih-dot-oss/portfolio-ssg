import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const TABS = [
  { id: 'langages', label: 'Langages' },
  { id: 'web',      label: 'Web & Frameworks' },
  { id: 'bases',    label: 'Bases de données' },
  { id: 'tools',    label: 'Outils & Méthodes' },
  { id: 'cyber',    label: 'Cybersécurité' },
]

const SKILLS = {
  langages: [
    { icon: '🐍', name: 'Python',     level: 4 },
    { icon: '☕', name: 'Java',       level: 3 },
    { icon: '⚙️', name: 'C',         level: 3 },
    { icon: '🟨', name: 'JavaScript', level: 3 },
    { icon: '🐘', name: 'PHP',        level: 2 },
  ],
  web: [
    { icon: '🌐', name: 'HTML5',     level: 4 },
    { icon: '🎨', name: 'CSS3',      level: 4 },
    { icon: '⚛️', name: 'React',     level: 2 },
    { icon: '🟢', name: 'Node.js',   level: 3 },
    { icon: '🔷', name: 'Bootstrap', level: 3 },
  ],
  bases: [
    { icon: '🐬', name: 'MySQL',      level: 4 },
    { icon: '🐘', name: 'PostgreSQL', level: 3 },
    { icon: '🗃️', name: 'SQLite',    level: 4 },
    { icon: '📊', name: 'SQL',        level: 4 },
  ],
  tools: [
    { icon: '🐙', name: 'Git & GitHub', level: 4 },
    { icon: '🖥️', name: 'Linux',       level: 3 },
    { icon: '📐', name: 'UML',          level: 4 },
    { icon: '🗂️', name: 'Merise',      level: 4 },
    { icon: '💻', name: 'VS Code',      level: 5 },
  ],
  cyber: [
    { icon: '🌐', name: 'TCP/IP',        level: 4 },
    { icon: '🔵', name: 'Cisco CCNA',    level: 3 },
    { icon: '🔴', name: 'Huawei HCIA',   level: 3 },
    { icon: '🦈', name: 'Wireshark',     level: 2 },
    { icon: '🔒', name: 'Sécurité Réseau', level: 2 },
  ],
}

function SkillCard({ icon, name, level }) {
  return (
    <div className="skill-card reveal">
      <div className="skill-icon">{icon}</div>
      <div className="skill-name">{name}</div>
      <div className="skill-dots">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`skill-dot ${i <= level ? 'on' : ''}`} />
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState('langages')
  const ref = useReveal()

  return (
    <section id="skills" className="section">
      <div className="container" ref={ref}>
        <div className="skills-header reveal">
          <span className="section-tag"><i className="fas fa-code"></i> Compétences</span>
          <h2 className="section-title">Mon arsenal technique</h2>
          <p className="section-sub">Des compétences solides acquises à travers la formation et la pratique.</p>
        </div>

        <div className="skills-tabs reveal">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`skills-tab ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="skills-grid">
          {(SKILLS[active] || []).map(s => (
            <SkillCard key={s.name} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
