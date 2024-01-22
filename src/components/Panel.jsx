import { Box, Paper } from "@mui/material";

export default function Panel(){
    
    return(
        <Box
        sx={{
            display:"flex",
            flexWrap:'wrap',
            '& > :not(style)': {
                width: 300,
                height: '90vh',
              },
        }}
        >
            <Paper elevation={3}>
                Panel
            </Paper>
        </Box>

    )
}