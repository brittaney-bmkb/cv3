import { Box } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"

const ComparablePropertySearch= () => {

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2}> 
            <Box>Comparable Property Search</Box>
            <StyledButtonFilledPrimary text={"Search"}/>
        </Box>
        
    )
}

export default ComparablePropertySearch