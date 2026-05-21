import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import PortfolioPage from './pages/PortfolioPage'
import AdminPage    from './admin/AdminPage'

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/"        element={<PortfolioPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
