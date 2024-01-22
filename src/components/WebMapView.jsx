import { Box, Paper } from "@mui/material";

export default function WebMapView(){
    
    return(
        <Box
        sx={{
            display:"flex",
            flexWrap:'wrap',
            '& > :not(style)': {
                width: '100%',
                height: '90vh',
              },
        }}
        >
        <Paper elevation={3}>

        </Paper>
        </Box>

    )
}