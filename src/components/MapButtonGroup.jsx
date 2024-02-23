// import StyledButtonFilledPrimary from "../Button/Button"
import { Box, Button, Stack } from "@mui/material"
import { theme } from "../theme"

import StyledButtonFilledPrimary from "./Button/Button"
import UseAppContext from "../contexts/AppContext"

import StraightenIcon from '@mui/icons-material/Straighten';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

const MapButtonGroup = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()
    
    
    const handleClick = (buttonName) =>{
        setPanelSecondaryVisibility(true)
        setPanelDisplaySecondary(buttonName)
    }

    return(
        <Stack direction="row" position="absolute" spacing={1} padding={2} zIndex={100}>
            <StyledButtonFilledPrimary text={"Measure"}  startIcon={<StraightenIcon/>} onClick={ () => {handleClick('measureWidget')} }  />
            <StyledButtonFilledPrimary text={"Layers"}   startIcon={<LayersOutlinedIcon/>} onClick={ () => {handleClick('layersWidget')} }  />
            <StyledButtonFilledPrimary text={"Basemaps"} startIcon={<GridViewIcon/>}  onClick={ () => {handleClick('layersWidget')} } />
            <StyledButtonFilledPrimary text={"Print"}    startIcon={<LocalPrintshopIcon/>} onClick={ () => {handleClick('layersWidget')} }  />            
        </Stack>
    )
}

export default MapButtonGroup