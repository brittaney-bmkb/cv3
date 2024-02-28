import { Box, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
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

    const {setMeasureWidgetState, measureWidgetState, mapView, setMeasureContainer, loadMeasureTool} = UseAppContext()
    //use ref for div 
    const measureDiv = useRef(null)
    const measureWidget = useRef(null)
    const [ measureValue, setMeasureValue ] = useState(0)
    const [activeTool, setActiveTool] = useState('distance')

    // const [clearButton, setClearButton] = useState(null)

    useEffect(() => {
        const createMeasureWidget = () => {
            if(measureDiv.current){
                if(!measureWidget.current){
                    measureWidget.current = new Measurement({
                        areaUnit: "square-us-feet",
                        linearUnit: "feet",
                        container: measureDiv.current,
                        view: view,
                        activeTool: null
                    })
                    setMeasureWidgetState('measuring')
                    // measureWidget.current.renderNow()
                }
            }        
        }
        createMeasureWidget();

        view.ui.add(measureWidget.current, 'MEASURECONTAINER');

        return () => {
            // Cleanup function to destroy the measure widget when unmounting
            if (!measureWidget.current) {
                measureWidget.current.destroy();
                measureWidget.current = null;
            }
        };

    // }, [measureWidget, measureDiv])
    // }, [])
    }, [measureWidget, measureDiv, activeTool, view]);



    const handleToolChange = (tool) => {
        if (measureWidget.current) {
            measureWidget.current.activeTool = tool;
            setActiveTool(tool);
        }
    };


    return (
        <div id="MEASURECONTAINER" style={{width: '100%', height: '100%'}} >

            <Stack direction="row" gap={2}>
                <StyledButtonFilledPrimary
                    variant={activeTool === 'distance' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<StraightenOutlinedIcon/>}
                    text={'Distance'}
                    onClick={() => handleToolChange('distance')}
                /> 

                <StyledButtonFilledPrimary
                    variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<SquareFootOutlinedIcon/>}
                    text={'Area'}
                    onClick={() => handleToolChange('area')}
                /> 

            </Stack>

            <Box display="flex" flexDirection="column" alignItems="center" rowGap={1} p={1}> 
                <Box ref={measureDiv}> </Box>


            </Box>
        </div>
            )      
}

export default MeasureWidget