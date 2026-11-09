import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'
import { PageTransitionRouter } from './components/PageTransition.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageTransitionRouter>
      <App />
    </PageTransitionRouter>
  </StrictMode>,
)
