import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { supabase } from '../lib/supabase'

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <div className="project-img-wrap">
        <div className="project-img">
          {project.image_url
            ? <img src={project.image_url} alt={project.name} loading="lazy" />
            : <div className="project-placeholder"><i className="fas fa-code"></i></div>
          }
        </div>
        <div className="project-overlay">
          <div className="project-overlay-content">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" className="overlay-btn main">
                <i className="fas fa-eye"></i> Voir le site
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="overlay-btn">
                <i className="fab fa-github"></i> Code source
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="project-body">
        <div className="project-info-top">
          {project.featured && <span className="featured-badge">Projet Phare</span>}
          <h3 className="project-title">{project.name}</h3>
        </div>
        <p className="project-desc">{project.description}</p>
        <div className="project-techs">
          {(project.tech || []).map(t => (
            <span key={t} className="tech-badge-modern">{t.trim()}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const ref = useReveal()

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Projects error:', error)
        setProjects(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="projects" className="section projects">
      <div className="container" ref={ref}>
        <div className="projects-header">
          <div className="reveal">
            <span className="section-tag"><i className="fas fa-laptop-code"></i> Projets</span>
            <h2 className="section-title">Des Projets scolaires</h2>
            <p className="section-sub">Des projets réels qui reflètent mes compétences et ma progression.</p>
          </div>
        </div>

        <div className="projects-grid">
          {loading ? (
            <div className="empty-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Chargement des projets…</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <p>Aucun projet pour l'instant. Revenez bientôt !</p>
            </div>
          ) : (
            projects.map(p => <ProjectCard key={p.id} project={p} />)
          )}
        </div>
      </div>
    </section>
  )
}
