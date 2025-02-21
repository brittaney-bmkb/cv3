// import StyledButtonFilledPrimary from "../Button/Button"
import { Box, Button, Stack } from "@mui/material"
import { theme } from "../theme"

import StyledButtonFilledPrimary from "./Button/Button"
import UseAppContext from "../contexts/AppContext"

import StraightenIcon from '@mui/icons-material/Straighten';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { CalciteIcon } from "@esri/calcite-components-react";
import { useEffect, useState } from "react";

const MapButtonGroup = () => {

    const { translateText, setPanelWidgetVisibility, setPanelDisplayWidget, screenWidth, mapView, panelDisplay, panelDisplayWidget} = UseAppContext()
    
    const [ smallMap, setSmallMap ] = useState(null)

    const handleClick = (display) =>{
        setPanelWidgetVisibility(true)
        setPanelDisplayWidget(display)
    }

    useEffect(() => {

        console.log("mapView container: ", mapView?.container.offsetWidth )
        
        setSmallMap(mapView?.container.offsetWidth < theme.breakpoints.values.md )

    }, [mapView, panelDisplayWidget, panelDisplay])


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
            { screenWidth < theme.breakpoints.values.md || smallMap ?  
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
        >
            <Button variant="contained" onClick={() => {handleClick('select')}}><CalciteIcon icon="add-in-new"/></Button>
            <Button variant="contained" onClick={() => {handleClick('measureWidget')}}> <StraightenIcon/> </Button>
            <Button variant="contained" onClick={() => {handleClick('layersWidget')}}> <LayersOutlinedIcon/> </Button>
            <Button variant="contained" onClick={() => {handleClick('basemapsWidget')}}> <GridViewIcon/> </Button>
            <Button variant="contained" onClick={() => {handleClick('printWidget')}}> <LocalPrintshopIcon/> </Button>
            </Box>:
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
            <StyledButtonFilledPrimary text={translateText("Select Multiple Parcels")}  startIcon={<CalciteIcon icon="add-in-new"/>} onClick={ () => {handleClick('select')}}  textVarient="subTitle1" />
            <StyledButtonFilledPrimary text={translateText("Measure")}  startIcon={<StraightenIcon/>} onClick={ () => {handleClick('measureWidget')}}  textVarient="subTitle1" />
            <StyledButtonFilledPrimary text={translateText("Layers")}   startIcon={<LayersOutlinedIcon/>} onClick={ () => {handleClick('layersWidget')} }  textVarient="subTitle1" />
            <StyledButtonFilledPrimary text={translateText("Aerial Imagery")} startIcon={<GridViewIcon/>}  onClick={ () => {handleClick('basemapsWidget')} }  textVarient="subTitle1" />
            <StyledButtonFilledPrimary text={translateText("Print")}    startIcon={<LocalPrintshopIcon/>} onClick={ () => {handleClick('printWidget')} }  textVarient="subTitle1" />           
            </Box>
            }
        </Box>
    )
}

export default MapButtonGroup