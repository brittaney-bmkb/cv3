import { Box } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"

const PropertyDetail = () => {

    const { setPanelSecondaryVisibility } = UseAppContext()

    function handleClick(){
        setPanelSecondaryVisibility(true)
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2}>
        <Box>PropertyDetail</Box>
        <StyledButtonFilledPrimary 
        text={"Compare Properties"}
        onClick={handleClick}
        />
        </Box>
        
    )
}

export default PropertyDetail