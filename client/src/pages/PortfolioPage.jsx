import Navbar       from '../components/Navbar'
import Hero         from '../components/Hero'
import About        from '../components/About'
import Skills       from '../components/Skills'
import Projects     from '../components/Projects'
import Education    from '../components/Education'
import Certificates from '../components/Certificates'
import Contact      from '../components/Contact'
import Footer       from '../components/Footer'

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Certificates />
      <Contact />
      <Footer />
    </>
  )
}
