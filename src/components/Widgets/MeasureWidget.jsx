import { Box, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useMemo, useRef, useState } from "react"
import { theme } from "../../theme"

import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReplayIcon from '@mui/icons-material/Replay';

import { StyledIconButton } from "../Button/Button";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import SquareFootIcon from '@mui/icons-material/SquareFoot';
import StyledButtonFilledPrimary, { StyledPanelButton } from "../Button/Button";


import Measurement from "@arcgis/core/widgets/Measurement.js";
import { view } from "../../arcgis/webmap/webmap";


// import { initializeMeasureWidget } from "../../arcgis/widgets/measurement";


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const {setMeasureWidgetState, panelDisplaySecondary,  measureWidgetState, measureWidgetContainer, loadMeasureWidget, setActiveMeasureTool, setMeasureWidgetContainer} = UseAppContext()
    //use ref for div 
    const measureDiv = useRef(null)
    const measurementWidget = useRef(null)

    useEffect(() => {
        const createMeasureWidget = async () => {
            if(measureDiv.current){
                console.log("Setting measure widget container")
                await setMeasureWidgetContainer(measureDiv.current)
            }  
        }
        createMeasureWidget();
    }, [measureDiv]);


    const handleToolChange = async (tool) => {

        console.log("measure widget state: ", measureWidgetState)
        if(!measureWidgetState){
            await loadMeasureWidget()
            setMeasureWidgetState(true)
            
        }
        
        setActiveMeasureTool(tool)
   
    };


    return (
        <Box id="MEASURECONTAINER" display="flex" width="100%"  height= "auto" flexDirection="column" justifyContent="center" alignContent="center">
            <Stack direction="row" gap={1} sx={{justifyContent:"center"}}>
                <StyledButtonFilledPrimary
                    //variant={activeTool === 'distance' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<StraightenOutlinedIcon/>}
                    text={'Distance'}
                    onClick={() => handleToolChange('distance')}
                /> 

                <StyledButtonFilledPrimary
                    //variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<SquareFootOutlinedIcon/>}
                    text={'Area'}
                    onClick={() => handleToolChange('area')}
                /> 

            </Stack>

            <Box display="flex" flexDirection="column" alignItems="center" rowGap={1} p={1}> 
                <Box ref={measureDiv} style={{width:"100%", "--calcite-ui-brand" : theme.palette.primary.main}}> </Box>
            </Box>
        </Box>
            )      
}

export default MeasureWidget