import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../theme";



const Search = () => {
    return(
        <Box bgcolor="white" display="flex" flexGrow={1} sx={{padding: "0 10px", borderRadius: theme.shape.borderRadius}}>
            <InputBase placeholder="Search..."/>
        </Box>

    )
}

export default Search