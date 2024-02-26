import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme.js'
import { setAssetPath } from '@esri/calcite-components/dist/components';
// setAssetPath(window.location.href);
setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> 
      <BrowserRouter>
          <Routes>
              <Route path="/" exact element={ <App />}/>
              {/* Url parameter 'location' added as an optional (?) param */}
              <Route path=":location?" element={ <App />}/>
              <Route path=":search?" element={ <App />}/>
              <Route path=":pin?" element={ <App />}/>
              <Route path=":address?" element={ <App />}/>
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
    
  </React.StrictMode>,
)
