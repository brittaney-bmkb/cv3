import { Box, Paper } from "@mui/material";

export default function SearchBar(){
    
    return(
        <Box
        id="Box-Webmap"
        sx={{
            display:"flex",
            flexWrap:'wrap',
            '& > :not(style)': {
                width: '100%',
                height: 40,
              },
        }}
        >
        <Paper elevation={3}>
        </Paper>
        </Box>

    )
}