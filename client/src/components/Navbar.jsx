import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { href: '#about',        label: 'À propos'    },
  { href: '#skills',       label: 'Compétences' },
  { href: '#projects',     label: 'Projets'     },
  { href: '#education',    label: 'Formation'   },
  { href: '#certificates', label: 'Certificats' },
  { href: '#contact',      label: 'Contact'     },
  { href: '/cv',           label: 'Mon CV',      isExternal: true },
  { href: '/cv-dev',       label: 'CV Dev',      isExternal: true },
]

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [activeLink,  setActiveLink]  = useState('')

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active link on scroll
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveLink(`#${e.target.id}`) })
    }, { threshold: 0.4, rootMargin: '-70px 0px -30% 0px' })
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner-full">
          <a href="#hero" className="nav-logo">SSG.</a>

          <ul className="nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} className={activeLink === l.href ? 'active' : ''}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="lamp-switch" onClick={toggleTheme} title="Changer de thème" aria-label="Thème">
              <span className="lamp-track">
                <span className={`lamp-thumb ${isDark ? 'lamp-thumb--dark' : 'lamp-thumb--light'}`}>
                  <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
                </span>
              </span>
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={closeMenu}>{l.label}</a>
        ))}
        {/* <button className="lamp-switch lamp-switch--mobile" onClick={toggleTheme}>
          <span className="lamp-track">
            <span className={`lamp-thumb ${isDark ? 'lamp-thumb--dark' : 'lamp-thumb--light'}`}>
              <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
            </span>
          </span>
        </button> */}
      </nav>
    </>
  )
}
