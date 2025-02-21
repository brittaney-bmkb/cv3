import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme.js'
import { setAssetPath } from '@esri/calcite-components/dist/components';
setAssetPath(window.location.href + '/public/assets');
//setAssetPath("https://unpkg.com/@esri/calcite-components/dist/calcite/assets");
import { defineCustomElements } from "@arcgis/map-components/dist/loader";
// Register custom elements
defineCustomElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.29/assets" });


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> 
      <BrowserRouter>
          <Routes>
              <Route path="/" exact element={ <App />}/>
              {/* Url parameter 'location' added as an optional (?) param */}
              <Route path="/:location?" element={ <App />}/>
              <Route path="/:search?" element={ <App />}/>
              <Route path="/:pin?" element={ <App />}/>
              <Route path="/:pin10?" element={ <App />}/>
              <Route path="/:pin14?" element={ <App />}/>
              <Route path=":address?" element={ <App />}/>
          </Routes>
      </BrowserRouter>
    </ThemeProvider>
    
  </React.StrictMode>,
)
