import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../theme";



const Search = () => {
    return(
        <Box flex={5} height={40} bgcolor="white" display="flex" sx={{padding: "0 10px", borderRadius: theme.shape.borderRadius}}>
            <InputBase placeholder="Search..."/>
        </Box>

    )
}

export default Search