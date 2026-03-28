import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { supabase } from '../lib/supabase'

function ProjectCard({ project }) {
  return (
    <div className="project-card reveal">
      <div className="project-img">
        {project.image_url
          ? <img src={project.image_url} alt={project.name} loading="lazy" />
          : <i className="fas fa-code project-img-placeholder"></i>
        }
      </div>
      <div className="project-body">
        {project.featured ? <div className="project-featured">⭐ Projet phare</div> : null}
        <div className="project-title">{project.name}</div>
        <div className="project-desc">{project.description}</div>
        <div className="project-techs">
          {(project.tech || []).map(t => (
            <span key={t} className="tech-badge">{t.trim()}</span>
          ))}
        </div>
        <div className="project-links">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="project-link">
              <i className="fab fa-github"></i> GitHub
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="project-link">
              <i className="fas fa-external-link-alt"></i> Live
            </a>
          )}
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
      .order('created_at', { ascending: false })
      .then(({ data }) => { setProjects(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="projects" className="section projects">
      <div className="container" ref={ref}>
        <div className="projects-header">
          <div className="reveal">
            <span className="section-tag"><i className="fas fa-laptop-code"></i> Projets</span>
            <h2 className="section-title">Ce que j'ai construit</h2>
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
