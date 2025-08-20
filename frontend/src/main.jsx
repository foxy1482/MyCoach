import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../css/input.css'

createRoot(document.querySelector("body")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
