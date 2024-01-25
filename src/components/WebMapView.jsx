import { Box, Paper, Typography } from "@mui/material";

const WebMapView = () => {
    
    return(
        <Box 
        bgcolor="yellow" 
        color="black" 
        flex={10} 
        display="flex" 
        flexDirection="column" 
        height="100%" 
        width="100%"
        justifyContent="center"
        alignItems="center"
        >
            <Typography variant="h1" color="initial">Map</Typography>
        </Box>

    )
}

export default WebMapView