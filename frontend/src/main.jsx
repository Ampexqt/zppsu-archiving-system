import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import { API_BASE_URL } from './services/api'
import './index.css'
import App from './App.jsx'

// Automatically rewrite any hardcoded localhost:5000 URLs to match the active host or VITE_API_URL
// This ensures that when other laptops, mobile devices, or network clients connect, API requests route to the host server
axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes("localhost:5000")) {
    config.url = config.url.replace(/http:\/\/localhost:5000/g, API_BASE_URL);
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
