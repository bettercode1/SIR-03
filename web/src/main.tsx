import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './context/LanguageContext'
import { RollDataProvider } from './context/RollDataContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <RollDataProvider>
        <App />
      </RollDataProvider>
    </LanguageProvider>
  </StrictMode>,
)
