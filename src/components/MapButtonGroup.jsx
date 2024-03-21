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

    const { translateText, setPanelWidgetVisibility, setPanelDisplayWidget } = UseAppContext()
    
    
    const handleClick = (display) =>{
        setPanelWidgetVisibility(true)
        setPanelDisplayWidget(display)
    }

    return(
        <Box 
            display="flex" 
            flexDirection="row" 
            columnGap={1}
            width={"100%"}
            sx={{
                overflow:"auto",
                overflowX: "hidden",
                scrollBehavior:"smooth",
                whiteSpace:"nowrap"
            }}
        // sx={{flexFlow:"wrap", gap: "3px 1px"}}
        >
            <StyledButtonFilledPrimary text={translateText("Measure")}  startIcon={<StraightenIcon/>} onClick={ () => {handleClick('measureWidget')}}  textVarient="subTitle1" />
            <StyledButtonFilledPrimary text={translateText("Layers")}   startIcon={<LayersOutlinedIcon/>} onClick={ () => {handleClick('layersWidget')} }  textVarient="subTitle1" />
            <StyledButtonFilledPrimary text={translateText("Basemaps")} startIcon={<GridViewIcon/>}  onClick={ () => {handleClick('basemapsWidget')} }  textVarient="subTitle1" />
            <StyledButtonFilledPrimary text={translateText("Print")}    startIcon={<LocalPrintshopIcon/>} onClick={ () => {handleClick('printWidget')} }  textVarient="subTitle1" />            
        </Box>
    )
}

export default MapButtonGroup