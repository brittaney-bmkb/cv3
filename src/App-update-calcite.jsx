import { useEffect, useState } from 'react'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import { Box, Stack, Grid, ThemeProvider, createTheme, Button } from '@mui/material'
import Panel, { BottomPanel, LeftPanel, SecondaryPanel, WidgetPanel } from './components/Panel/Panel'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import '@esri/calcite-components/dist/calcite/calcite.css';
import MapButtonGroup from './components/MapButtonGroup'
import { AppProvider } from './contexts/AppContext'
import { ToggleIconButton } from './components/Button/Button'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PanelMobile from './components/Panel/Panel'
import Notifications from './components/Notifications/Notifications'
import TranslateMenu from './components/NavBar/TranslateMenu'
import { config } from './data/config'
import HelpDialog from './components/HelpDialog/HelpDialog'
import WebMapComponentBeta from './components/WebMapView/WebMapComponentBeta'
import Layout from './Layout'

function App() {

  const [mapVisible, setMapVisible] = useState(true)
  const [screenWidth, setScreenWidth] = useState(true)
  const [componentHeight, setComponentHeight] = useState(window.innerHeight);

  function handleClick(){
    setMapVisible(!mapVisible)
  }

  useEffect(() => {
    const handleResize = () => {
        ////console.log("Resize event triggered");
        const width = window.innerWidth
        ////console.log("window width: ", width)
        setScreenWidth(width)
        setComponentHeight(window.innerHeight);
    }

    // const resizeOps = () => {
    //   //console.log("Setting inner window height: ", window.innerHeight)
    //   document.documentElement.style.setProperty("--doc-height", `${window.innerHeight}px`);
    // };

    window.addEventListener('resize', handleResize);
    //window.addEventListener("resize", resizeOps);

    handleResize();
    //resizeOps();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      //window.removeEventListener('resize', resizeOps);
    };

    //window.innerHeight
  }, [window.innerWidth, window.innerWidth]);

  return (
    <AppProvider>
      <Layout/>
    </AppProvider>
  )
}

export default App
