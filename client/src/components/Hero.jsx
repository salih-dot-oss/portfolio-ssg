import { useEffect, useRef, useState } from 'react'

const PHRASES = [
  'Étudiant en Génie Logiciel 💻',
  'Étudiant en Cybersécurité 🔒',
  'Développeur Full-Stack 🚀',
  'Passionné de code & réseaux ⚡',
  'Futur ingénieur logiciel 🎯',
]

export default function Hero() {
  const canvasRef = useRef(null)
  const [typedText, setTypedText] = useState('')

  // ── Typing animation ────────────────────────────────────
  useEffect(() => {
    let pi = 0, ci = 0, deleting = false, timer

    function type() {
      const phrase = PHRASES[pi]
      const next   = deleting ? phrase.slice(0, ci--) : phrase.slice(0, ci++)
      setTypedText(next)

      if (!deleting && ci > phrase.length)  { deleting = true;  timer = setTimeout(type, 1800); return }
      if (deleting  && ci < 0)              { deleting = false; pi = (pi + 1) % PHRASES.length; ci = 0 }
      timer = setTimeout(type, deleting ? 45 : 75)
    }
    type()
    return () => clearTimeout(timer)
  }, [])

  // ── Canvas particles ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx  = canvas.getContext('2d')
    let W, H, dots = [], raf

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    for (let i = 0; i < 80; i++) {
      dots.push({
        x: Math.random() * 1200, y: Math.random() * 800,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        a: Math.random()
      })
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(159,122,234,${d.a * 0.6})`
        ctx.fill()
      })
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(102,126,234,${0.15*(1-dist/120)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-orb orb-1" /><div className="hero-orb orb-2" /><div className="hero-orb orb-3" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Disponible pour stages &amp; projets
        </div>

        <h1 className="hero-name">
          <span className="gradient-text">Serigne Saliou</span><br />GNINGUE
        </h1>

        <div className="hero-typing">
          {typedText}<span className="cursor" />
        </div>

        <p className="hero-tagline">
          Construire, Apprendre, Évoluer — <em>un code à la fois.</em>
        </p>

        <div className="hero-ctas">
          <a href="#projects" className="btn btn-primary">
            <i className="fas fa-code"></i> Voir mes projets
          </a>
          <a href="#contact" className="btn btn-outline">
            <i className="fas fa-paper-plane"></i> Me contacter
          </a>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-dot" />
        <span>SCROLL</span>
      </div>
    </section>
  )
}
