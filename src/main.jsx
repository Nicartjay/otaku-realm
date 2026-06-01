import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * Apply the saved theme synchronously before React renders so users
 * never see a wrong-mode flash. Default is dark (matches the original
 * permanent-dark design); we only switch to light when the user has
 * explicitly chosen it.
 */
;(function applyInitialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    const isLight = saved === 'light'
    document.documentElement.classList.toggle('light', isLight)
    document.documentElement.classList.toggle('dark', !isLight)
  } catch {
    document.documentElement.classList.add('dark')
  }
})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
