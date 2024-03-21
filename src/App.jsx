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

function App() {

  const [mapVisible, setMapVisible] = useState(true)
  const [screenWidth, setScreenWidth] = useState(true)

  function handleClick(){
    setMapVisible(!mapVisible)
  }

  useEffect(() => {
    const handleResize = () => {
        console.log("Resize event triggered");
        const width = window.innerWidth
        console.log("window width: ", width)
        setScreenWidth(width)
    }

    const resizeOps = () => {
      document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener("resize", resizeOps);

    handleResize();
    resizeOps();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', resizeOps);
    };
  }, [window.innerWidth]);

  return (
    <AppProvider>
      <Box display="flex" flexDirection="column" height="100vh" >
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

              { screenWidth >= 600  ? <WebMapView/> : <PanelMobile/>}
  
            <BottomPanel/>
          </Box>
          <SecondaryPanel/>
          <WidgetPanel/>
        </Stack>
        {/* <Box width="auto" height="auto" position="absolute" bottom={20} left="45%" display={{xs:"block", sm: "none"}}>
          <ToggleIconButton 
            text={ mapVisible ? "Data" : "Map" } 
            icon={ mapVisible ? <TableRowsOutlinedIcon/> : <MapOutlinedIcon/> } 
            onClick={handleClick}
          />
        </Box> */}

        <TranslateMenu/>
      </Box>
    </AppProvider>
  )
}

export default App
