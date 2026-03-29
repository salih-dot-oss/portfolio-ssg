import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const TABS = [
  { id: 'gl',       label: '💻 Génie Logiciel' },
  { id: 'cyber',    label: '🔐 Cybersécurité' },
  { id: 'langages', label: 'Langages' },
  { id: 'web',      label: 'Web & BDD' },
  { id: 'tools',    label: 'Outils' },
]

const SKILLS = {
  gl: [
    { icon: 'fas fa-code',            name: 'Programmation',     level: 75, color: '#04BBFF' },
    { icon: 'fas fa-brain',           name: 'Algorithmique',     level: 70, color: '#0594D0' },
    { icon: 'fab fa-git-alt',         name: 'Git & GitHub',      level: 85, color: '#F05032' },
    { icon: 'fas fa-palette',         name: 'Canva / Design',    level: 80, color: '#00C4CC' },
    { icon: 'fab fa-html5',           name: 'HTML5 & CSS3',      level: 88, color: '#E34F26' },
    { icon: 'fas fa-database',        name: 'Bases de données',  level: 80, color: '#4479A1' },
    { icon: 'fas fa-sitemap',         name: 'UML / Merise',      level: 82, color: '#007198' },
  ],
  cyber: [
    { icon: 'fas fa-flag',            name: 'Logique CTF',       level: 65, color: '#04BBFF' },
    { icon: 'fas fa-user-secret',     name: 'OSINT',             level: 55, color: '#007198' },
    { icon: 'fas fa-network-wired',   name: 'Réseau',            level: 75, color: '#0594D0' },
    { icon: 'fas fa-key',             name: 'Cryptographie',     level: 45, color: '#F093FB' },
    { icon: 'fas fa-shield-alt',      name: 'Cisco CCNA',        level: 70, color: '#00BCEB' },
    { icon: 'fas fa-lock',            name: 'Huawei HCIA',       level: 65, color: '#E4101A' },
    { icon: 'fas fa-search',          name: 'Wireshark',         level: 50, color: '#1679A7' },
    { icon: 'fas fa-cloud',           name: 'Azure Sandbox',     level: 65, color: '#0078D4' },
  ],
  langages: [
    { icon: 'fab fa-python',     name: 'Python',     level: 80, color: '#3776AB' },
    { icon: 'fab fa-java',       name: 'Java',       level: 65, color: '#007396' },
    { icon: 'fas fa-code',       name: 'C',          level: 60, color: '#A8B9CC' },
    { icon: 'fab fa-js',         name: 'JavaScript', level: 75, color: '#F7DF1E' },
    { icon: 'fab fa-php',        name: 'PHP',        level: 50, color: '#777BB4' },
    { icon: 'fas fa-terminal',   name: 'Bash',       level: 65, color: '#4EAA25' },
  ],
  web: [
    { icon: 'fab fa-react',      name: 'React',      level: 45, color: '#61DAFB' },
    { icon: 'fab fa-node-js',    name: 'Node.js',    level: 60, color: '#339933' },
    { icon: 'fab fa-bootstrap',  name: 'Bootstrap',  level: 75, color: '#7952B3' },
    { icon: 'fas fa-database',   name: 'MySQL',      level: 85, color: '#4479A1' },
    { icon: 'fas fa-database',   name: 'PostgreSQL', level: 70, color: '#336791' },
    { icon: 'fas fa-bolt',       name: 'Supabase',   level: 55, color: '#3ECF8E' },
  ],
  tools: [
    { icon: 'fab fa-docker',          name: 'Docker',   level: 45, color: '#2496ED' },
    { icon: 'fab fa-linux',           name: 'Linux',    level: 75, color: '#FCC624' },
    { icon: 'fas fa-vial',            name: 'VS Code',  level: 95, color: '#007ACC' },
    { icon: 'fas fa-palette',         name: 'Canva',    level: 80, color: '#00C4CC' },
    { icon: 'fas fa-cloud',           name: 'Azure',    level: 65, color: '#0078D4' },
    { icon: 'fab fa-git-alt',         name: 'Git',      level: 85, color: '#F05032' },
  ],
}

function SkillCard({ icon, name, level, color, index }) {
  return (
    <div 
      className="skill-card anim-grid-in" 
      style={{ '--skill-color': color, '--i': index }}
    >
      <div className="skill-icon-wrap">
        <i className={`${icon} skill-icon-fa`}></i>
      </div>
      <div className="skill-info">
        <div className="skill-top">
          <span className="skill-name">{name}</span>
          <span className="skill-percent">{level}%</span>
        </div>
        <div className="skill-bar-bg">
          <div 
            className="skill-bar-fill" 
            style={{ '--width': `${level}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState('gl')
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

        <div className="skills-grid reveal-obs" key={active}>
          {(SKILLS[active] || []).map((s, idx) => (
            <SkillCard key={s.name} {...s} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}
