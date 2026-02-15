import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { FontSizeProvider } from './context/FontSizeContext.jsx'
import 'flowbite';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FontSizeProvider>
        <App />
      </FontSizeProvider>
    </BrowserRouter>
  </StrictMode>,
)
