/**
 * main.jsx
 * 
 * Application entry point. Initializes React and mounts the root App component
 * to the DOM. Kept minimal per React best practices—business logic and state
 * management belong in App.jsx and child components.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mount React app to DOM root element with StrictMode enabled for development checks
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
