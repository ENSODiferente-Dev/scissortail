import { Navigate, Route, Routes } from 'react-router-dom'
import LeadConnectorChatLoader from './components/LeadConnectorChatLoader'
import HomePage from './pages/HomePage'
import LegacyHomePage from './pages/LegacyHomePage'
import HeroDemoPage from './pages/HeroDemoPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function App() {
  return (
    <>
      <LeadConnectorChatLoader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/legacy-home" element={<LegacyHomePage />} />
        <Route path="/hero-demo" element={<HeroDemoPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
