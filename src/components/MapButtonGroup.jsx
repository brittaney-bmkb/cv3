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
            <StyledButtonFilledPrimary text={"Measure Tool"} onClick={() => {handleClick("measureWidget")}} />
            {/* <Button variant="contained" sx={{bgcolor:theme.palette.primary}} className="measureWidget">Measure</Button> */}
            <StyledButtonFilledPrimary text={"Layers"} onClick={() => {handleClick("layersWidget")}}/>
            <StyledButtonFilledPrimary text={"Basemaps"}/>
            <StyledButtonFilledPrimary text={"Print"}/>
        </Stack>
    )
}

export default MapButtonGroup