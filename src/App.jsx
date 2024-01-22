import { useState } from 'react'
import './App.css'
import NavigationTop from './components/NavigationTop'
import WebMapView from './components/WebMapView'
import { Box, Container, Grid, ThemeProvider, createTheme } from '@mui/material'
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
    <ThemeProvider theme={theme}>
      <Box sx={{ display:'grid', flexDirection:'column'}}>
        <Box sx={{height:75, display:'flex'}}>
          <NavigationTop/>
        </Box>
        
        <Box id="container-main" sx={{ display:'grid'}}>
          <Grid container spacing={2}> 
            <Grid item display={{xs:'none', sm:'none', md:'block', lg:'block'}} md={3} lg={3}>
              <Panel/>
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9}>
              <WebMapView/>
            </Grid>
          </Grid>
        </Box>
      </Box>

    </ThemeProvider>

  )
}

export default App
