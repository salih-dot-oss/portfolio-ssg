import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { supabase, phoneToEmail, uploadFile, deleteFile } from '../lib/supabase'
import { captureScreenshot } from '../utils/screenshot'

// ══════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════
function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.msg}
        </div>
      ))}
    </div>
  )
}

// ══════════════════════════════════════════════════
//  MODAL WRAPPER
// ══════════════════════════════════════════════════
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════════════════
function Login({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [pass,  setPass]  = useState('')
  const [show,  setShow]  = useState(false)
  const [err,   setErr]   = useState('')
  const [busy,  setBusy]  = useState(false)

  const submit = async e => {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const email = phoneToEmail(phone)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
      if (error) throw new Error('Numéro ou mot de passe incorrect')
      const name = data.user?.user_metadata?.name || 'Admin'
      onLogin(name)
    } catch (ex) {
      setErr(ex.message)
    }
    setBusy(false)
  }

  return (
    <div className="login-page">
      <div className="hero-orb orb-1" /><div className="hero-orb orb-2" />
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-text gradient-text">SSG.</div>
          <div className="login-logo-sub">Espace Administration</div>
        </div>
        <h2 className="login-title">Connexion</h2>
        <p className="login-sub">Accédez à votre tableau de bord</p>
        {err && <div className="login-error">{err}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Numéro de téléphone</label>
            <div className="field-wrap">
              <i className="fas fa-phone field-icon"></i>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="77 746 27 82" required />
            </div>
          </div>
          <div className="field">
            <label>Mot de passe</label>
            <div className="field-wrap">
              <i className="fas fa-lock field-icon"></i>
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="Votre mot de passe" required />
              <button type="button" className="eye-btn" onClick={() => setShow(s => !s)}>
                <i className={`fas fa-eye${show ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={busy}>
            {busy ? 'Connexion…' : <><i className="fas fa-sign-in-alt"></i> &nbsp;Connexion</>}
          </button>
        </form>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════════
function Sidebar({ page, onNav, onLogout, userName, unread, mobileOpen, onClose }) {
  const items = [
    { id: 'dashboard',    icon: 'fa-chart-pie',   label: 'Tableau de bord', section: 'Principal' },
    { id: 'projects',     icon: 'fa-laptop-code', label: 'Projets',         section: 'Contenu'   },
    { id: 'certificates', icon: 'fa-certificate', label: 'Certifications',  section: ''          },
    { id: 'messages',     icon: 'fa-envelope',    label: 'Messages',        section: '',         badge: unread },
    { id: 'settings',     icon: 'fa-cog',         label: 'Paramètres',      section: 'Compte'    },
  ]
  let currentSection = ''
  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo gradient-text">SSG.</div>
        <nav className="sidebar-menu">
          {items.map(item => {
            const showSection = item.section && item.section !== currentSection
            if (showSection) currentSection = item.section
            return (
              <div key={item.id}>
                {showSection && <div className="sidebar-section">{item.section}</div>}
                <div className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => { onNav(item.id); onClose() }}>
                  <i className={`fas ${item.icon}`}></i>
                  {item.label}
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </div>
              </div>
            )
          })}
          <div className="nav-item" onClick={() => window.open('/', '_blank')}>
            <i className="fas fa-external-link-alt"></i> Voir le portfolio
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{(userName || 'S')[0]}</div>
            <div className="user-info">
              <div className="user-name">{userName || 'Admin'}</div>
              <div className="user-role">Administrateur</div>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Se déconnecter">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// ══════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════
function Dashboard({ stats, onNav, userName }) {
  return (
    <div>
      <div className="welcome-card">
        <div className="welcome-emoji">👋</div>
        <div>
          <div className="welcome-title">Bonjour, <span className="gradient-text">{userName}</span> !</div>
          <div className="welcome-sub">Gérez votre portfolio depuis cet espace. Ajoutez vos projets, certificats et consultez vos messages.</div>
        </div>
      </div>
      <div className="stats-grid">
        {[
          { icon: '💻', label: 'Projets',       val: stats.projects,     bg: 'rgba(102,126,234,.15)' },
          { icon: '📜', label: 'Certifications', val: stats.certificates, bg: 'rgba(240,147,251,.1)'  },
          { icon: '✉️', label: 'Messages',       val: stats.messages,     bg: 'rgba(96,165,250,.1)'   },
          { icon: '🔔', label: 'Non lus',         val: stats.unread,       bg: 'rgba(248,113,113,.1)'  },
        ].map(s => (
          <div key={s.label} className="admin-stat">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-num gradient-text">{s.val ?? '—'}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">🚀 Démarrage rapide</span></div>
        <div style={{ padding: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => onNav('projects')}><i className="fas fa-plus"></i> Ajouter un projet</button>
          <button className="btn btn-ghost btn-sm"   onClick={() => onNav('certificates')}><i className="fas fa-plus"></i> Ajouter un certificat</button>
          <button className="btn btn-ghost btn-sm"   onClick={() => onNav('messages')}><i className="fas fa-envelope-open"></i> Voir les messages</button>
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><i className="fas fa-eye"></i> Voir le portfolio</a>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════
//  PROJECTS MANAGER
// ══════════════════════════════════════════════════
function ProjectsManager({ showToast, onRefreshStats }) {
  const [projects,   setProjects]   = useState([])
  const [modal,      setModal]      = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [imgPreview, setImgPreview] = useState(null)
  const [autoShot,  setAutoShot]  = useState(null)
  const [shooting,  setShooting]  = useState(false)
  const [shotError, setShotError] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', tech: '', github_url: '', live_url: '', featured: false })

  const load = useCallback(async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
  }, [])
  useEffect(() => { load() }, [load])

  const openModal = (p = null) => {
    setImgPreview(p?.image_url || null)
    setAutoShot(null); setShooting(false); setShotError(null)
    setForm(p
      ? { name: p.name, description: p.description || '', tech: (p.tech || []).join(', '), github_url: p.github_url || '', live_url: p.live_url || '', featured: !!p.featured }
      : { name: '', description: '', tech: '', github_url: '', live_url: '', featured: false }
    )
    setModal(p || {})
  }

  /**
   * Capture l'aperçu du site à partir du lien live.
   * En mode silencieux l'échec n'affiche pas de toast : il est signalé sous le
   * champ, pour ne jamais bloquer l'enregistrement du projet.
   */
  const autoCapture = async (rawUrl, { silent = false } = {}) => {
    if (!(rawUrl || '').trim()) return null
    setShooting(true); setShotError(null)
    try {
      const file = await captureScreenshot(rawUrl)
      setAutoShot(file)
      setImgPreview(URL.createObjectURL(file))
      return file
    } catch (e) {
      setShotError(e.message)
      if (!silent) showToast(e.message, 'error')
      return null
    } finally {
      setShooting(false)
    }
  }

  const save = async () => {
    if (!form.name.trim()) return showToast('Le nom du projet est requis', 'error')
    setSaving(true)
    try {
      const techArray = form.tech.split(',').map(t => t.trim()).filter(Boolean)
      let imageUrl = modal?.image_url || null

      // L'aperçu vient toujours du lien live : capture déjà faite, sinon à la volée
      let file = autoShot
      if (!file && !imageUrl && form.live_url.trim()) {
        file = await autoCapture(form.live_url, { silent: true })
      }

      if (file) {
        if (imageUrl) await deleteFile('projects', imageUrl)
        imageUrl = await uploadFile('projects', file)
      }

      const payload = {
        name:       form.name.trim(),
        description: form.description.trim(),
        tech:       techArray,
        github_url: form.github_url.trim() || null,
        live_url:   form.live_url.trim()   || null,
        featured:   form.featured,
        image_url:  imageUrl,
      }

      const isEdit = modal?.id
      const { error } = isEdit
        ? await supabase.from('projects').update(payload).eq('id', modal.id)
        : await supabase.from('projects').insert([payload])

      if (error) throw new Error(error.message)
      showToast(isEdit ? 'Projet mis à jour !' : 'Projet créé !', 'success')
      setModal(null); load(); onRefreshStats()
    } catch(e) {
      showToast(e.message, 'error')
    }
    setSaving(false)
  }

  const del = async p => {
    if (!confirm('Supprimer ce projet ?')) return
    if (p.image_url) await deleteFile('projects', p.image_url)
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    if (error) return showToast(error.message, 'error')
    showToast('Projet supprimé'); load(); onRefreshStats()
  }

  const togglePublish = async p => {
    const { error } = await supabase.from('projects').update({ published: !p.published }).eq('id', p.id)
    if (error) return showToast(error.message, 'error')
    showToast(p.published ? 'Projet retiré du portfolio' : 'Projet publié dans le portfolio !', p.published ? 'info' : 'success')
    load()
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">💻 Mes projets</span>
          <button className="btn btn-primary btn-sm" onClick={() => openModal()}><i className="fas fa-plus"></i> Nouveau projet</button>
        </div>
        <table>
          <thead><tr><th>Projet</th><th>Technologies</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {projects.length === 0
              ? <tr><td colSpan="4"><div className="empty-state"><i className="fas fa-folder-open"></i><p>Aucun projet. Créez le premier !</p></div></td></tr>
              : projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div className="td-thumb">
                        {p.image_url ? <img src={p.image_url} alt="" /> : <i className="fas fa-code" style={{ color:'var(--t3)' }}></i>}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.name}</div>
                        {p.featured ? <div style={{ fontSize:'0.75rem', color:'var(--accent)' }}>⭐ Phare</div> : null}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {(p.tech || []).map(t => <span key={t} className="tech-badge">{t}</span>)}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => togglePublish(p)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                        background: p.published ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                        color: p.published ? 'var(--green)' : 'var(--red)',
                      }}
                    >
                      <i className={`fas ${p.published ? 'fa-eye' : 'fa-eye-slash'}`} style={{ marginRight:5 }}></i>
                      {p.published ? 'Publié' : 'Retiré'}
                    </button>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="action-btn edit" onClick={() => openModal(p)}><i className="fas fa-pen"></i></button>
                      <button className="action-btn del"  onClick={() => del(p)}><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal
          title={modal.id ? 'Modifier le projet' : 'Nouveau projet'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? <><i className="fas fa-spinner fa-spin"></i> Sauvegarde…</> : <><i className="fas fa-save"></i> Enregistrer</>}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Nom du projet *</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Mon super projet" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Décrivez votre projet…" />
          </div>
          <div className="form-group">
            <label className="form-label">Technologies <span className="form-hint">(séparées par virgules)</span></label>
            <input className="form-input" value={form.tech} onChange={e => setForm(p => ({ ...p, tech: e.target.value }))} placeholder="Python, Django, MySQL…" />
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <div className="form-group" style={{ flex:1 }}>
              <label className="form-label">Lien GitHub</label>
              <input className="form-input" value={form.github_url} onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))} placeholder="https://github.com/…" />
            </div>
            <div className="form-group" style={{ flex:1 }}>
              <label className="form-label">Lien Live</label>
              <input className="form-input" value={form.live_url}
                onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))}
                onBlur={e => autoCapture(e.target.value, { silent: true })}
                placeholder="https://…" />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width:18, height:18, accentColor:'var(--accent)' }} />
              <span className="form-label" style={{ marginBottom:0 }}>Mettre en avant ⭐ (projet phare)</span>
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">
              Aperçu du projet <span className="form-hint">(capturé automatiquement depuis le lien live)</span>
            </label>

            {shooting && (
              <div className="upload-area" style={{ cursor:'default' }}>
                <i className="fas fa-spinner fa-spin"></i>
                <p>Capture de la page en cours…</p>
              </div>
            )}

            {!shooting && imgPreview && (
              <img src={imgPreview} alt="aperçu du projet" className="upload-preview" />
            )}

            {!shooting && !imgPreview && (
              <div className="upload-area" style={{ cursor:'default' }}>
                <i className="fas fa-wand-magic-sparkles"></i>
                <p>Renseignez le <span>lien live</span> ci-dessus : l'aperçu se génère tout seul.</p>
              </div>
            )}

            {shotError && (
              <p className="form-hint" style={{ color:'var(--red)', marginTop:6 }}>{shotError}</p>
            )}

            <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop:10 }}
              onClick={() => autoCapture(form.live_url)}
              disabled={shooting || !form.live_url.trim()}>
              <i className="fas fa-rotate"></i> Recapturer l'aperçu
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════
//  CERTIFICATES MANAGER
// ══════════════════════════════════════════════════
function CertsManager({ showToast, onRefreshStats }) {
  const [certs,       setCerts]       = useState([])
  const [modal,       setModal]       = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [filePreview, setFilePreview] = useState(null)
  const [form, setForm] = useState({ name:'', issuer:'', issue_date:'', category:'Génie Logiciel', verify_url:'' })

  const load = useCallback(async () => {
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false })
    setCerts(data || [])
  }, [])
  useEffect(() => { load() }, [load])

  const openModal = (c = null) => {
    setFilePreview(c?.file_url || null)
    setForm(c
      ? { name: c.name, issuer: c.issuer, issue_date: c.issue_date||'', category: c.category||'Génie Logiciel', verify_url: c.verify_url||'' }
      : { name:'', issuer:'', issue_date:'', category:'Génie Logiciel', verify_url:'' }
    )
    setModal(c || {})
  }

  const save = async () => {
    if (!form.name.trim() || !form.issuer.trim()) return showToast('Nom et organisme requis', 'error')
    setSaving(true)
    try {
      const fEl = document.getElementById('cert-file-input')
      let fileUrl = modal?.file_url || null

      if (fEl?.files[0]) {
        if (fileUrl) await deleteFile('certificates', fileUrl)
        fileUrl = await uploadFile('certificates', fEl.files[0])
      }

      const payload = {
        name:       form.name.trim(),
        issuer:     form.issuer.trim(),
        issue_date: form.issue_date || null,
        category:   form.category,
        verify_url: form.verify_url.trim() || null,
        file_url:   fileUrl,
        published:  modal?.id ? modal.published : true,
      }

      const isEdit = modal?.id
      const { error } = isEdit
        ? await supabase.from('certificates').update(payload).eq('id', modal.id)
        : await supabase.from('certificates').insert([payload])

      if (error) throw new Error(error.message)
      showToast(isEdit ? 'Certificat mis à jour !' : 'Certificat ajouté !', 'success')
      setModal(null); load(); onRefreshStats()
    } catch(e) {
      showToast(e.message, 'error')
    }
    setSaving(false)
  }

  const del = async c => {
    if (!confirm('Supprimer ce certificat ?')) return
    if (c.file_url) await deleteFile('certificates', c.file_url)
    const { error } = await supabase.from('certificates').delete().eq('id', c.id)
    if (error) return showToast(error.message, 'error')
    showToast('Certificat supprimé'); load(); onRefreshStats()
  }

  const togglePublish = async c => {
    const { error } = await supabase.from('certificates').update({ published: !c.published }).eq('id', c.id)
    if (error) return showToast(error.message, 'error')
    showToast(c.published ? 'Certificat retiré du portfolio' : 'Certificat publié dans le portfolio !', c.published ? 'info' : 'success')
    load()
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">📜 Mes certifications</span>
          <button className="btn btn-primary btn-sm" onClick={() => openModal()}><i className="fas fa-plus"></i> Nouveau certificat</button>
        </div>
        <table>
          <thead><tr><th>Certification</th><th>Organisme</th><th>Date</th><th>Catégorie</th><th>Fichier</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {certs.length === 0
              ? <tr><td colSpan="7"><div className="empty-state"><i className="fas fa-certificate"></i><p>Aucun certificat.</p></div></td></tr>
              : certs.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight:600, fontSize:'0.88rem' }}>{c.name}</td>
                  <td style={{ color:'var(--t2)', fontSize:'0.85rem' }}>{c.issuer}</td>
                  <td style={{ fontSize:'0.82rem', color:'var(--t3)' }}>{c.issue_date||'—'}</td>
                  <td><span className={`badge ${c.category==='Cybersécurité'?'badge-cy':'badge-gl'}`}>{c.category}</span></td>
                  <td>
                    {c.file_url
                      ? <a href={c.file_url} target="_blank" rel="noreferrer" style={{ color:'var(--green)', fontSize:'0.82rem' }}><i className="fas fa-file-alt"></i> Voir</a>
                      : <span style={{ color:'var(--t3)', fontSize:'0.82rem' }}>—</span>
                    }
                  </td>
                  <td>
                    <button
                      onClick={() => togglePublish(c)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                        fontSize: '0.78rem', fontWeight: 600,
                        background: c.published ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                        color: c.published ? 'var(--green)' : 'var(--red)',
                      }}
                    >
                      <i className={`fas ${c.published ? 'fa-eye' : 'fa-eye-slash'}`} style={{ marginRight:5 }}></i>
                      {c.published ? 'Publié' : 'Retiré'}
                    </button>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="action-btn edit" onClick={() => openModal(c)}><i className="fas fa-pen"></i></button>
                      <button className="action-btn del"  onClick={() => del(c)}><i className="fas fa-trash"></i></button>
                      {c.verify_url && <a href={c.verify_url} target="_blank" rel="noreferrer" className="action-btn view"><i className="fas fa-external-link-alt"></i></a>}
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal
          title={modal.id ? 'Modifier le certificat' : 'Nouveau certificat'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? <><i className="fas fa-spinner fa-spin"></i> Sauvegarde…</> : <><i className="fas fa-save"></i> Enregistrer</>}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Nom du certificat *</label>
            <input className="form-input" value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))} placeholder="CS50's Introduction…" />
          </div>
          <div className="form-group">
            <label className="form-label">Organisme émetteur *</label>
            <input className="form-input" value={form.issuer} onChange={e => setForm(p => ({...p, issuer:e.target.value}))} placeholder="Harvard University, Cisco…" />
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <div className="form-group" style={{ flex:1 }}>
              <label className="form-label">Année d'obtention</label>
              <input className="form-input" value={form.issue_date} onChange={e => setForm(p => ({...p, issue_date:e.target.value}))} placeholder="2024" />
            </div>
            <div className="form-group" style={{ flex:1 }}>
              <label className="form-label">Catégorie</label>
              <select className="form-input" value={form.category} onChange={e => setForm(p => ({...p, category:e.target.value}))}>
                <option>Génie Logiciel</option>
                <option>Cybersécurité</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Lien de vérification</label>
            <input className="form-input" value={form.verify_url} onChange={e => setForm(p => ({...p, verify_url:e.target.value}))} placeholder="https://…" />
          </div>
          <div className="form-group">
            <label className="form-label">Fichier du certificat <span className="form-hint">(PDF ou image)</span></label>
            <div className="upload-area" onClick={() => document.getElementById('cert-file-input').click()}>
              <input id="cert-file-input" type="file" accept="image/*,.pdf" style={{ display:'none' }}
                onChange={e => {
                  const f = e.target.files[0]; if (!f) return
                  if (f.type === 'application/pdf') setFilePreview(`📄 ${f.name}`)
                  else { const r = new FileReader(); r.onload = ev => setFilePreview(ev.target.result); r.readAsDataURL(f) }
                }}
              />
              <i className="fas fa-file-certificate"></i>
              <p>Cliquez pour uploader votre <span>certificat (PDF / image)</span></p>
            </div>
            {filePreview && (
              typeof filePreview === 'string' && filePreview.startsWith('📄')
                ? <p style={{ marginTop:8, color:'var(--accent)', fontSize:'0.85rem' }}>{filePreview}</p>
                : <img src={filePreview} alt="preview" className="upload-preview" />
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════
//  MESSAGES
// ══════════════════════════════════════════════════
function MessagesPage({ showToast, onRefreshStats }) {
  const [msgs,     setMsgs]     = useState([])
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    if (error) console.error('[Admin] Erreur chargement messages:', error)
    setMsgs(data || [])
  }, [])
  useEffect(() => { load() }, [load])

  const open = async msg => {
    setSelected(msg)
    if (!msg.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id)
      setMsgs(m => m.map(x => x.id === msg.id ? { ...x, is_read: true } : x))
      onRefreshStats()
    }
  }

  const del = async id => {
    if (!confirm('Supprimer ce message ?')) return
    await supabase.from('messages').delete().eq('id', id)
    showToast('Message supprimé'); setSelected(null); load(); onRefreshStats()
  }

  const fmt = d => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : ''

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <span className="card-title">✉️ Messages reçus</span>
          <button className="btn btn-ghost btn-sm" onClick={load}><i className="fas fa-sync"></i> Actualiser</button>
        </div>
        <table>
          <thead><tr><th>Expéditeur</th><th>Objet</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {msgs.length === 0
              ? <tr><td colSpan="4"><div className="empty-state"><i className="fas fa-inbox"></i><p>Aucun message reçu.</p></div></td></tr>
              : msgs.map(m => (
                <tr key={m.id} onClick={() => open(m)} style={{ cursor:'pointer', fontWeight: m.is_read ? 'normal' : '700' }}>
                  <td>
                    {!m.is_read && <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'var(--accent)', marginRight:8, verticalAlign:'middle' }} />}
                    <div style={{ fontSize:'0.9rem' }}>{m.name||'(Inconnu)'}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--t3)' }}>{m.email||''}</div>
                  </td>
                  <td style={{ fontSize:'0.88rem', maxWidth:200, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.subject||'(Sans objet)'}</td>
                  <td style={{ fontSize:'0.8rem', color:'var(--t3)', whiteSpace:'nowrap' }}>{fmt(m.created_at)}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="actions">
                      <button className="action-btn del" onClick={() => del(m.id)}><i className="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`Message de ${selected.name}`} onClose={() => setSelected(null)}
          footer={
            <>
              <a href={`mailto:${selected.email}`} className="btn btn-primary"><i className="fas fa-reply"></i> Répondre</a>
              <button className="btn btn-ghost btn-danger" onClick={() => del(selected.id)}><i className="fas fa-trash"></i> Supprimer</button>
            </>
          }
        >
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div><span style={{ color:'var(--t3)', fontSize:'0.82rem' }}>De</span><br /><strong>{selected.name}</strong> — <a href={`mailto:${selected.email}`} style={{ color:'var(--accent)' }}>{selected.email}</a></div>
            <div><span style={{ color:'var(--t3)', fontSize:'0.82rem' }}>Objet</span><br />{selected.subject}</div>
            <div><span style={{ color:'var(--t3)', fontSize:'0.82rem' }}>Message</span><br />
              <div style={{ background:'var(--bg2)', borderRadius:8, padding:16, marginTop:6, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{selected.message}</div>
            </div>
            <div style={{ fontSize:'0.78rem', color:'var(--t3)' }}>{fmt(selected.created_at)}</div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════
//  SETTINGS
// ══════════════════════════════════════════════════
function SettingsPage({ showToast }) {
  const { isDark, toggleTheme } = useTheme()
  const [form, setForm] = useState({ curr: '', newp: '', conf: '' })

  const savePass = async e => {
    e.preventDefault()
    if (form.newp !== form.conf) return showToast('Les mots de passe ne correspondent pas', 'error')
    if (form.newp.length < 6) return showToast('Minimum 6 caractères', 'error')
    const { error } = await supabase.auth.updateUser({ password: form.newp })
    if (error) return showToast(error.message, 'error')
    showToast('Mot de passe mis à jour !', 'success')
    setForm({ curr: '', newp: '', conf: '' })
  }

  return (
    <div>
      <div className="settings-section">
        <h3><i className="fas fa-user-circle" style={{ color:'var(--accent)', marginRight:8 }}></i> Informations du compte</h3>
        <div className="cred-info">
          <div className="cred-row"><span className="cred-label">Nom</span><span className="cred-value">Serigne Saliou GNINGUE</span></div>
          <div className="cred-row"><span className="cred-label">Téléphone</span><span className="cred-value">+221 77 746 27 82 / +221 76 181 15 74</span></div>
        </div>
      </div>
      <div className="settings-section">
        <h3><i className="fas fa-lock" style={{ color:'var(--accent)', marginRight:8 }}></i> Changer le mot de passe</h3>
        <form onSubmit={savePass} style={{ maxWidth:440 }}>
          {[['newp','Nouveau mot de passe','Nouveau mot de passe'],['conf','Confirmer','Confirmer le mot de passe']].map(([k,l,ph]) => (
            <div key={k} className="form-group">
              <label className="form-label">{l}</label>
              <input type="password" className="form-input" value={form[k]} onChange={e => setForm(p => ({...p, [k]:e.target.value}))} placeholder={ph} />
            </div>
          ))}
          <button type="submit" className="btn btn-primary"><i className="fas fa-save"></i> Mettre à jour</button>
        </form>
      </div>
      <div className="settings-section">
        <h3><i className="fas fa-palette" style={{ color:'var(--accent)', marginRight:8 }}></i> Thème</h3>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-ghost" onClick={() => !isDark || toggleTheme()}><i className="fas fa-sun"></i> Mode clair</button>
          <button className="btn btn-ghost" onClick={() => isDark  || toggleTheme()}><i className="fas fa-moon"></i> Mode sombre</button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════
//  ADMIN PAGE (root)
// ══════════════════════════════════════════════════
const PAGE_TITLES = { dashboard:'Tableau de bord', projects:'Projets', certificates:'Certifications', messages:'Messages', settings:'Paramètres' }

export default function AdminPage() {
  const { isDark, toggleTheme } = useTheme()
  const [userName,    setUserName]    = useState('')
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState('dashboard')
  const [stats,       setStats]       = useState({})
  const [toasts,      setToasts]      = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600)
  }, [])

  const loadStats = useCallback(async () => {
    const [p, c, m, u] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('certificates').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }),
      supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
    ])
    setStats({ projects: p.count ?? 0, certificates: c.count ?? 0, messages: m.count ?? 0, unread: u.count ?? 0 })
  }, [])

  const initApp = useCallback((name) => {
    setUserName(name || 'Admin')
    loadStats()
  }, [loadStats])

  // Vérification de session au chargement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        initApp(session.user?.user_metadata?.name || 'Admin')
      }
      setLoading(false)
    })

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUserName(''); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [initApp])

  const logout = async () => {
    await supabase.auth.signOut()
    setUserName('')
  }

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize:'2rem', color:'var(--accent)' }}></i>
      </div>
    )
  }

  if (!userName) return <Login onLogin={name => initApp(name)} />

  return (
    <div className="admin-body">
      <Sidebar
        page={page} onNav={setPage} onLogout={logout}
        userName={userName} unread={stats.unread || 0}
        mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
      />
      <div className="admin-main">
        <header className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="icon-btn mobile-menu-btn" style={{ display:'flex' }} onClick={() => setSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="topbar-title">{PAGE_TITLES[page]}</h1>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={toggleTheme} title="Thème">
              <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="icon-btn" title="Portfolio">
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </header>
        <main className="content">
          {page === 'dashboard'    && <Dashboard stats={stats} onNav={setPage} userName={userName} />}
          {page === 'projects'     && <ProjectsManager showToast={showToast} onRefreshStats={loadStats} />}
          {page === 'certificates' && <CertsManager    showToast={showToast} onRefreshStats={loadStats} />}
          {page === 'messages'     && <MessagesPage     showToast={showToast} onRefreshStats={loadStats} />}
          {page === 'settings'     && <SettingsPage     showToast={showToast} />}
        </main>
      </div>
      <Toast toasts={toasts} />
    </div>
  )
}
