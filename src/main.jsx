import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme.js'
import { setAssetPath } from '@esri/calcite-components/dist/components';
// setAssetPath(window.location.href);
setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> 
      <App />
    </ThemeProvider>
    
  </React.StrictMode>,
)
