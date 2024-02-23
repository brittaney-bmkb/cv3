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
    const [activeTool, setActiveTool] = useState(null)

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
                    console.log('measureWidget.current2 ', measureWidget)
                    console.log('measureWidget.current2 ', measureWidget.current.container)
                    // console.log('measureWidget.current2 ', measureWidget.current.container.ref)
                }
            }        
        }
        createMeasureWidget();
    }, [measureWidget, measureDiv])

    useEffect(() => {

        const updateActiveTool = () =>{
            if(measureWidget.current){
                measureWidget.current.activeTool = activeTool
            }
        }
        updateActiveTool()

    }, [activeTool])

    const newMeasurement = (event) => {
        let formattedText  =  event.target.textContent.toLowerCase()
        setActiveTool(formattedText) 
        measureWidget.current.startMeasurement()
        setMeasureWidgetState("measuring")
    }

    const clearMeasureTool = () => {
        setActiveTool(null) 
        measureWidget.current.clear()
        // if(measureWidget.current){
        //     setActiveTool(null) 
        //     measureWidget.current.clear()
        // }
    }



    return (
        <div id="MEASURECONTAINER" style={{width: '100%', height: '100%'}} >
            <Box display="flex" flexDirection="column" rowGap={2} p={2}> 
                <Box>Comparable Property Search</Box>
                <StyledPanelButton
                text1={'Distance'} text2={'Area'} 
                // text3={'Clear'} 
                icon1={<StraightenOutlinedIcon/>} 
                icon2={<SquareFootOutlinedIcon/>} 
                // icon3={<DeleteOutlineIcon/>}
                onClick={newMeasurement} />
            </Box>

            <Box display="flex" flexDirection="column" rowGap={1} p={1}> 
                <Box>Select your measurement type above. Remember to reselect after clearing results.</Box>
                <Box ref={measureDiv}>

                </Box>
                {/* measureWidget.current.container */}
                { measureWidget.current !== null ? 
                    <StyledButtonFilledPrimary
                    variant="contained"
                    color="primary"
                    startIcon={<ReplayIcon/>}
                    text={'Clear'}
                    // onClick={() => {clearMeasureTool()}}
                    onClick={clearMeasureTool}
                /> 
                : null } 


            </Box>

        </div>

        
            )      
}

export default MeasureWidget