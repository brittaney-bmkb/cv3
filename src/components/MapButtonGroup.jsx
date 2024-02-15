// import StyledButtonFilledPrimary from "../Button/Button"
import { Box, Button, Stack } from "@mui/material"
import { theme } from "../theme"

import StyledButtonFilledPrimary from "./Button/Button"
import UseAppContext from "../contexts/AppContext"


const MapButtonGroup = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()
    
    
    function handleClick(){
        setPanelSecondaryVisibility(true)
        setPanelDisplaySecondary("measureWidget")
    }

    return(
        <Stack direction="row" position="absolute" spacing={1} padding={2} zIndex={100}>
            <StyledButtonFilledPrimary text={"Measure Tool"} onClick={handleClick} />
            {/* <Button variant="contained" sx={{bgcolor:theme.palette.primary}} className="measureWidget">Measure</Button> */}
            <Button variant="contained" sx={{bgcolor:theme.palette.primary}}>Layers</Button>
            <Button variant="contained" sx={{bgcolor:theme.palette.primary}}>Basemaps</Button>
            <Button variant="contained" sx={{bgcolor:theme.palette.primary}}>Print</Button>
        </Stack>
    )
}

export default MapButtonGroup