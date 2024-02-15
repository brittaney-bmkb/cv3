import { Box } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"


// this lifted from comparable property search and will needed to be updated for this widget
const BasemapWidget = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()

    function handleClick(){
        setPanelSecondaryVisibility(true)
        setPanelDisplaySecondary("basemapWidget")
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2}>
        <Box>Basemap Widget</Box>
        <StyledButtonFilledPrimary 
        text={"Compare Properties"}
        onClick={handleClick}
        />
        </Box>
        
    )
}

export default BasemapWidget