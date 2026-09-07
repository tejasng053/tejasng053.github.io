import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './studio.css'
import './motion.css'

const storedTheme = (() => {
  try { return window.localStorage.getItem('tn-theme') } catch { return null }
})()
const initialTheme = storedTheme === 'dark' || storedTheme === 'light'
  ? storedTheme
  : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
document.documentElement.dataset.theme = initialTheme
document.documentElement.style.colorScheme = initialTheme

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
