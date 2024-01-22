import { AppBar, Box, Toolbar, Typography } from "@mui/material"

export default function NavigationTop(){

    return(
        <Box>
            <AppBar>
                <Toolbar>
                    <Typography variant="h6" color="white">CookViewer</Typography>
                </Toolbar>
            </AppBar>
        </Box>

    )
}