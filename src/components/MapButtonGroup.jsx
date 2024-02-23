// import StyledButtonFilledPrimary from "../Button/Button"
import { Box, Button, Stack } from "@mui/material"
import { theme } from "../theme"

import StyledButtonFilledPrimary from "./Button/Button"
import UseAppContext from "../contexts/AppContext"


const MapButtonGroup = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()
    
    
    function handleClick(display){
        setPanelSecondaryVisibility(true)
        setPanelDisplaySecondary(display)
    }

    return(
        <Stack direction="row" position="absolute" spacing={1} padding={2} zIndex={100}>
            <StyledButtonFilledPrimary text={"Measure Tool"} onClick={() => {handleClick("measureWidget")}} textVarient="h5"/>
            {/* <Button variant="contained" sx={{bgcolor:theme.palette.primary}} className="measureWidget">Measure</Button> */}
            <StyledButtonFilledPrimary text={"Layers"} onClick={() => {handleClick("layersWidget")}} textVarient="h5"/>
            <StyledButtonFilledPrimary text={"Basemaps"} onClick={() => {handleClick("basemapsWidget")}} textVarient="h5"/>
            <StyledButtonFilledPrimary text={"Print"} onClick={() => {handleClick("printWidget")}} textVarient="h5"/>
        </Stack>
    )
}

export default MapButtonGroup