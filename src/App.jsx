import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import WebMapView from './components/WebMapView'
import { Box, Stack, Grid, ThemeProvider, createTheme, Button } from '@mui/material'
import Panel, { BottomPanel, LeftPanel, RightPanel } from './components/Panel'
import ToggleButton from './components/ToggleButton'
import '@esri/calcite-components/dist/calcite/calcite.css';
import MapButtonGroup from './components/MapButtonGroup'

const theme = createTheme({
  palette:{
    primary: {
      main: '#0D4D96'
    },
    secondary: {
      main:'#009A44'
    }
  }
})

function App() {
  return (
      <Box display="flex" flexDirection="column" height="100vh">
          <NavBar/>
        <Stack id="main-stack" direction="row" gap={1} justifyContent="space-between" padding={0} height="100%">
          <LeftPanel/>
          <Box flexDirection="column" flex={4} padding={0} display="flex" alignItems="center">
              <Box flexDirection="column" alignItems="left" width="100%" display={{xs:'none', sm:'flex', md:'flex'}}>
                <MapButtonGroup/>
              </Box>
              <Box flexDirection="column" alignItems="center" width="100%" display={{xs:'flex', sm:'none', md:'none'}}>
                <MapButtonGroup/>
              </Box>
              
            <WebMapView/>
            <BottomPanel/>
          </Box>
          <RightPanel/>
        </Stack>
        <ToggleButton />
      </Box>
  )
}

export default App
