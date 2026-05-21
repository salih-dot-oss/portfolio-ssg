import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import PortfolioPage from './pages/PortfolioPage'
import AdminPage    from './admin/AdminPage'
import CVPage       from './pages/CVPage'
import CVDevPage    from './pages/CVDevPage'

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/"        element={<PortfolioPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/cv"      element={<CVPage />} />
          <Route path="/cv-dev"  element={<CVDevPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
