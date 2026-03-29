import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { supabase } from '../lib/supabase'

const ICONS = {
  'Harvard University':       '🏛️',
  'Cisco Networking Academy': '🔵',
  'Huawei':                   '🔴',
}
const getIcon = issuer => ICONS[issuer] || '📜'

const isImage = url => url && /\.(png|jpe?g|webp|gif|svg)$/i.test(url)
const isPDF   = url => url && /\.pdf$/i.test(url)

function CertCard({ cert }) {
  return (
    <div className="cert-card">
      <div className="cert-img-wrap">
        <div className="cert-img">
          {isImage(cert.file_url)
            ? <img src={cert.file_url} alt={cert.name} loading="lazy" />
            : isPDF(cert.file_url)
            ? <iframe src={cert.file_url} title={cert.name} className="cert-pdf-preview" />
            : <div className="cert-placeholder">{getIcon(cert.issuer)}</div>
          }
        </div>
        <div className="cert-overlay">
          <div className="cert-overlay-content">
            {cert.verify_url && (
              <a href={cert.verify_url} target="_blank" rel="noreferrer" className="overlay-btn main">
                <i className="fas fa-external-link-alt"></i> Vérifier
              </a>
            )}
            {cert.file_url && (
              <a href={cert.file_url} target="_blank" rel="noreferrer" className="overlay-btn">
                <i className="fas fa-file-alt"></i> Voir le fichier
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="cert-body">
        <div className="cert-name">{cert.name}</div>
        <div className="cert-issuer">{cert.issuer}</div>
        <div className="cert-meta">
          {cert.issue_date && (
            <span className="cert-date">
              <i className="fas fa-calendar-alt"></i> {cert.issue_date}
            </span>
          )}
          <span className={`cert-badge ${cert.category === 'Cybersécurité' ? 'cert-badge-cy' : 'cert-badge-gl'}`}>
            {cert.category}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Certificates() {
  const [certs,  setCerts]  = useState([])
  const [filter, setFilter] = useState('all')
  const ref = useReveal()

  useEffect(() => {
    supabase
      .from('certificates')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Certificates error:', error)
        setCerts(data || [])
      })
  }, [])

  const filtered = filter === 'all' ? certs : certs.filter(c => c.category === filter)

  return (
    <section id="certificates" className="section certificates">
      <div className="container" ref={ref}>
        <div className="certs-header reveal">
          <span className="section-tag"><i className="fas fa-certificate"></i> Certifications</span>
          <h2 className="section-title">Mes certifications</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Des reconnaissances officielles de mes compétences acquises.
          </p>
        </div>

        <div className="cert-tabs reveal">
          {[{id:'all',label:'Toutes'},{id:'Génie Logiciel',label:'Génie Logiciel'},{id:'Cybersécurité',label:'Cybersécurité'}].map(t => (
            <button
              key={t.id}
              className={`cert-tab ${filter === t.id ? 'active' : ''}`}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="certs-grid">
          {filtered.length === 0
            ? <p style={{ color: 'var(--t3)', textAlign: 'center', padding: '40px', gridColumn: '1/-1' }}>Aucun certificat dans cette catégorie.</p>
            : filtered.map(c => <CertCard key={c.id} cert={c} />)
          }
        </div>
      </div>
    </section>
  )
}
