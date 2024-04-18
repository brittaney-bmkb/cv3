import { useEffect, useState } from 'react'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import WebMapView from './components/WebMapView/WebMapView'
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

function App() {

  const [mapVisible, setMapVisible] = useState(true)
  const [screenWidth, setScreenWidth] = useState(true)
  const [componentHeight, setComponentHeight] = useState(window.innerHeight);

  function handleClick(){
    setMapVisible(!mapVisible)
  }

  useEffect(() => {
    const handleResize = () => {
        //console.log("Resize event triggered");
        const width = window.innerWidth
        //console.log("window width: ", width)
        setScreenWidth(width)
        setComponentHeight(window.innerHeight);
    }

    // const resizeOps = () => {
    //   console.log("Setting inner window height: ", window.innerHeight)
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
      <Box id="main" display="flex" flexDirection="column"  style={{height: `calc(${componentHeight}px - (var(--safe-area-top) + var(--safe-area-bottom)))`}}>
        {config.showBanner === true ? <Notifications/> : null}
          <NavBar/>
        <Stack id="main-stack" direction="row" justifyContent="space-between" flexGrow={1} minHeight={0}>
          <LeftPanel/>
          <Box flexDirection="column" flex={4} padding={0} display="flex" alignItems="center">
              {/* <Box flexDirection="column" alignItems="left" width="100%" display={{xs:'none', sm:'flex', md:'flex'}}>
                <MapButtonGroup/>
              </Box>
              <Box flexDirection="column" alignItems="center" width="100%" display={{xs: mapVisible ? 'flex' : 'none', sm:'none', md:'none'}}>
                <MapButtonGroup/>
              </Box> */}

              { screenWidth >= 600  ? 
              <Box display="flex" width="100vw" height="100%">
                <WebMapComponentBeta/>
                <WebMapView/>
              </Box>
               : 
              <PanelMobile/>}
  
            <BottomPanel/>
          </Box>
          <WidgetPanel/>
          <SecondaryPanel/>
          
        </Stack>
        {/* <Box width="auto" height="auto" position="absolute" bottom={20} left="45%" display={{xs:"block", sm: "none"}}>
          <ToggleIconButton 
            text={ mapVisible ? "Data" : "Map" } 
            icon={ mapVisible ? <TableRowsOutlinedIcon/> : <MapOutlinedIcon/> } 
            onClick={handleClick}
          />
        </Box> */}
        
        <TranslateMenu/>
        <HelpDialog/>
      </Box>
    </AppProvider>
  )
}

export default App
