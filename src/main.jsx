import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Clarity from '@microsoft/clarity'

import './index.css'
import App from './App.jsx'
import { PageTransitionRouter } from './components/PageTransition.jsx'

// Microsoft Clarity: production only, so local dev sessions don't pollute the data.
const clarityProjectId = import.meta.env.VITE_APP_CLARITY_PROJECT_ID
if (import.meta.env.PROD && clarityProjectId) {
  Clarity.init(clarityProjectId)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageTransitionRouter>
      <App />
    </PageTransitionRouter>
  </StrictMode>,
)
