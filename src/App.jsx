import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import WebMapView from './components/WebMapView'
import { Box, Stack, Grid, ThemeProvider, createTheme } from '@mui/material'
import Panel from './components/Panel'

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
      <Box>
          <NavBar/>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Panel/>
          <WebMapView/>
          <Panel/>
        </Stack>
      </Box>
  )
}

export default App
