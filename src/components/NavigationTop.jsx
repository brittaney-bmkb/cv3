import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material"
import SearchBar from "./SearchBar"

export default function NavigationTop(){

    return(
        <Box sx={{width:'100vw',  display:'grid'}}>
            <AppBar>
                <Toolbar>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={3}>
                            <Typography variant="h6" color="white" align="center">CookViewer</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <SearchBar/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>

    )
}