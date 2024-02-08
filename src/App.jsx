import { useEffect, useState } from 'react'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import WebMapView from './components/WebMapView/WebMapView'
import { Box, Stack, Grid, ThemeProvider, createTheme, Button } from '@mui/material'
import Panel, { BottomPanel, LeftPanel, SecondaryPanel } from './components/Panel/Panel'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import '@esri/calcite-components/dist/calcite/calcite.css';
import MapButtonGroup from './components/MapButtonGroup'
import { AppProvider } from './contexts/AppContext'
import { ToggleIconButton } from './components/Button/Button'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PanelMobile from './components/Panel/Panel'

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

    window.addEventListener('resize', handleResize);

    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);


  return (
    <AppProvider>
      <Box display="flex" flexDirection="column" height="100vh">
          <NavBar/>
        <Stack id="main-stack" direction="row" justifyContent="space-between" padding={0} height="100%">
          <LeftPanel/>
          <Box flexDirection="column" flex={4} padding={0} display="flex" alignItems="center">
              <Box flexDirection="column" alignItems="left" width="100%" display={{xs:'none', sm:'flex', md:'flex'}}>
                <MapButtonGroup/>
              </Box>
              <Box flexDirection="column" alignItems="center" width="100%" display={{xs: mapVisible ? 'flex' : 'none', sm:'none', md:'none'}}>
                <MapButtonGroup/>
              </Box>

              { mapVisible | screenWidth >= 600  ? <WebMapView/> : <PanelMobile/>}
  
            <BottomPanel/>
          </Box>
          <Box>
            <SecondaryPanel/>
          </Box>
        </Stack>
        <Box width="auto" height="auto" position="absolute" bottom={20} left="45%" display={{xs:"block", sm: "none"}}>
          <ToggleIconButton 
            text={ mapVisible ? "Data" : "Map" } 
            icon={ mapVisible ? <TableRowsOutlinedIcon/> : <MapOutlinedIcon/> } 
            onClick={handleClick}
          />
        </Box>
        
      </Box>
    </AppProvider>
  )
}

export default App
