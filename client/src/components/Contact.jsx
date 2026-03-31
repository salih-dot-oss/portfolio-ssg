import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { useReveal } from '../hooks/useReveal'
import { supabase } from '../lib/supabase'

const CONTACT_ITEMS = [
  { icon: 'fa-envelope', label: 'Email',    value: 'Ssgningue15@yahoo.com',   href: 'mailto:Ssgningue15@yahoo.com' },
  { icon: 'fa-whatsapp', label: 'WhatsApp', value: '+221 77 746 27 82',        href: 'https://wa.me/221777462782', fab: true },
  { icon: 'fa-github',   label: 'GitHub',   value: 'github.com/salih-dot-oss', href: 'https://github.com/salih-dot-oss', fab: true },
  { icon: 'fa-linkedin', label: 'LinkedIn', value: 'Serigne Saliou GNINGUE',   href: 'https://www.linkedin.com/in/serigne-saliou-gningue-8490b5364/', fab: true },
]

const SOCIALS = [
  { icon: 'fa-github',   href: 'https://github.com/salih-dot-oss', fab: true },
  { icon: 'fa-linkedin', href: 'https://www.linkedin.com/in/serigne-saliou-gningue-8490b5364/', fab: true },
  { icon: 'fa-envelope', href: 'mailto:Ssgningue15@yahoo.com' },
  { icon: 'fa-whatsapp', href: 'https://wa.me/221777462782', fab: true },
]

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' })
  const [status,  setStatus]  = useState(null)
  const [sending, setSending] = useState(false)
  const ref = useReveal()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true); setStatus(null)

    const subject = form.subject || '(Sans objet)'

    const { error } = await supabase.from('messages').insert([{
      name:    form.name,
      email:   form.email,
      subject,
      message: form.message,
    }])

    if (error) {
      console.error('[Contact] Supabase insert error:', error)
      setStatus({ type: 'error', text: `Erreur lors de l'envoi : ${error.message}` })
      setSending(false)
      return
    }

    // Notification email
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          subject,
          message:    form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
    } catch (emailErr) {
      console.error('[Contact] EmailJS error:', emailErr)
    }

    setStatus({ type: 'success', text: 'Message envoyé avec succès ! Je vous répondrai bientôt.' })
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
  }

  return (
    <section id="contact" className="section">
      <div className="container" ref={ref}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
          <span className="section-tag"><i className="fas fa-envelope"></i> Contact</span>
          <h2 className="section-title">Travaillons ensemble</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Une opportunité, un projet ou juste envie d'échanger ? Je suis à votre écoute.
          </p>
        </div>

        <div className="contact-grid">
          {/* Infos */}
          <div className="contact-info reveal">
            <h3>Prenons contact !</h3>
            <p>Que vous soyez recruteur, enseignant ou développeur, n'hésitez pas à me contacter. Je réponds rapidement.</p>
            <div className="contact-items">
              {CONTACT_ITEMS.map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="contact-item">
                  <div className="contact-item-icon">
                    <i className={`${item.fab ? 'fab' : 'fas'} ${item.icon}`}></i>
                  </div>
                  <div>
                    <div className="contact-item-label">{item.label}</div>
                    {item.value}
                  </div>
                </a>
              ))}
            </div>
            <div className="social-row">
              {SOCIALS.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" className="social-btn">
                  <i className={`${s.fab ? 'fab' : 'fas'} ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <div className="reveal">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Votre nom" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="votre@email.com" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Objet</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="form-input" placeholder="Objet de votre message" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} className="form-textarea" placeholder="Votre message…" required />
              </div>
              {status && <div className={`form-status ${status.type}`}>{status.text}</div>}
              <button type="submit" className="btn btn-primary" disabled={sending} style={{ alignSelf: 'flex-start' }}>
                {sending
                  ? <><i className="fas fa-spinner fa-spin"></i> Envoi…</>
                  : <><i className="fas fa-paper-plane"></i> Envoyer le message</>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
