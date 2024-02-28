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

    const { translateText, setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()
    
    
    const handleClick = (display) =>{
        setPanelSecondaryVisibility(true)
        setPanelDisplaySecondary(display)
    }

    return(
        <Stack direction="row" position="absolute" spacing={1} padding={1} zIndex={100}>
            <StyledButtonFilledPrimary text={translateText("Measure")}  startIcon={<StraightenIcon/>} onClick={ () => {handleClick('measureWidget')}}  textVarient="h5" />
            <StyledButtonFilledPrimary text={translateText("Layers")}   startIcon={<LayersOutlinedIcon/>} onClick={ () => {handleClick('layersWidget')} }  textVarient="h5" />
            <StyledButtonFilledPrimary text={translateText("Basemaps")} startIcon={<GridViewIcon/>}  onClick={ () => {handleClick('basemapsWidget')} }  textVarient="h5" />
            <StyledButtonFilledPrimary text={translateText("Print")}    startIcon={<LocalPrintshopIcon/>} onClick={ () => {handleClick('printWidget')} }  textVarient="h5" />            
        </Stack>
    )
}

export default MapButtonGroup