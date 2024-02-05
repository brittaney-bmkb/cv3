import { Box } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"

const ComparablePropertySearch= () => {

    const { searchComparableProperties } = UseAppContext()

    function handleClick(){
        searchComparableProperties()
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2}> 
            <Box>Comparable Property Search</Box>
            <StyledButtonFilledPrimary text={"Search"} onClick={handleClick} />
        </Box>
        
    )
}

export default ComparablePropertySearch