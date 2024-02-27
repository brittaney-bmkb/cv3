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
import { initializeMeasureWidget } from "../../arcgis/widgets/measurement";

import Measurement from "@arcgis/core/widgets/Measurement.js";
import { view } from "../../arcgis/webmap/webmap";


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const {setMeasureWidgetState, measureWidgetState, mapView, setMeasureContainer, loadMeasureTool} = UseAppContext()
    //use ref for div 
    const measureDiv = useRef(null)
    const measureWidget = useRef(null)
    const [ measureValue, setMeasureValue ] = useState(0)
    const [activeTool, setActiveTool] = useState('distance')

    const [clearButton, setClearButton] = useState(null)

    useEffect(() => {

        const createMeasureWidget = () => {
            if(measureDiv.current){
                if(!measureWidget.current){
                    console.log('measureWidget.current ', measureWidget)
                    measureWidget.current = new Measurement({
                        areaUnit: "square-us-feet",
                        linearUnit: "feet",
                        container: measureDiv.current,
                        view: view
                    })
                    setMeasureWidgetState('measuring')
                }
            }        
        }
        createMeasureWidget();
    }, [measureWidget, measureDiv])

    useEffect(() => {

        const updateActiveTool = () =>{
            if(measureWidget.current && measureWidgetState === 'measuring'){
                measureWidget.current.activeTool = activeTool
            }
        }
        updateActiveTool()

    }, [activeTool, measureWidgetState])

    const newMeasurement = (event) => {
        // let formattedText  =  event.target.textContent.toLowerCase()
        // setActiveTool(formattedText) 
        
        measureWidget.current.startMeasurement()
        setMeasureWidgetState("measuring")
    }

    const clearMeasureTool = () => {
        // setActiveTool(null) 
        measureWidget.current.clear()
        setMeasureWidgetState(null) 
    }

    const updateActiveTool = (event) => {
        let formattedText  =  event.target.textContent.toLowerCase()
        setActiveTool(formattedText) 
    }
    
    return (
        <div id="MEASURECONTAINER" style={{width: '100%', height: '100%'}} >
            <Stack direction="row" gap={2} display={{xs:'none', sm:'flex', md:'flex', lg:'flex' }}> 
                <StyledPanelButton
                    text1={'Distance'} text2={'Area'} 
                    text3={'Location'} 
                    icon1={<StraightenOutlinedIcon/>} 
                    icon2={<SquareFootOutlinedIcon/>} 
                    icon3={<MyLocationOutlinedIcon/>}
                    onClick={updateActiveTool} 
                />
            </Stack>
            <Box display="flex" flexDirection="column" alignItems="center" rowGap={1} p={1}> 
                <Box ref={measureDiv}> </Box>
                {measureWidget.current && measureWidgetState === 'measuring' ? 
                    <Box >
                        <StyledButtonFilledPrimary
                            variant="contained"
                            color="primary"
                            startIcon={<ReplayIcon/>}
                            text={'Clear'}
                            onClick={clearMeasureTool}
                        /> 
                    </Box>
                    :
                    <Box >
                        <Box sx={{ m: 2  }} >Select a new measurement button.</Box>
                        <StyledButtonFilledPrimary 
                            variant="contained"
                            color="primary"
                            text={'New Measurement'}
                            onClick={newMeasurement}
                        />  
                    </Box>
                } 
            </Box>
        </div>
            )      
}

export default MeasureWidget