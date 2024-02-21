import { Box, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import { theme } from "../../theme"

import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';


import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

import SquareFootIcon from '@mui/icons-material/SquareFoot';
import StyledButtonFilledPrimary, { StyledPanelButton } from "../Button/Button";
import { initializeMeasureWidget } from "../../arcgis/widgets/measurement";


import Measurement from "@arcgis/core/widgets/Measurement.js";
import { view } from "../../arcgis/webmap/webmap";
import MeasurementViewModel from "@arcgis/core/widgets/Measurement/MeasurementViewModel";


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const {setMeasureWidgetState, measureWidgetState, mapView, setMeasureContainer, loadMeasureTool} = UseAppContext()
    //use ref for div 
    const measureDiv = useRef(null)
    const measureWidget = useRef(null)
    const [ measureValue, setMeasureValue ] = useState(0)
    const [activeTool, setActiveTool] = useState(null)

    useEffect(() => {

        const createMeasureWidget = () => {
            if(measureDiv.current){
                if(!measureWidget.current){
                    measureWidget.current = new Measurement({
                        areaUnit: "square-us-feet",
                        linearUnit: "feet",
                        container: measureDiv.current,
                        view: view
                    })
                }

            }        
            // else{
            //     // console.log("View Model updating")
            //     // document.addEventListener('mousedown', function(){
            //     //     console.log("ACTIVE VIEW MODEL " ,measureWidget.current.viewModel?.activeViewModel)
            //     // })
            //     // measureWidget.current.viewModel.watch("measurement", function(event){
            //     //     console.log("Watching measure: ", event)
            //     //     setMeasureWidgetState("measuring")
            //     // })
            // }
        }

        createMeasureWidget();
    }, [measureWidget, measureDiv])



    // useEffect(() => {

        // if(measureWidget.current){
        //     let state = measureWidget.current.viewModel.state
        //     console.log("State of measure: ", state)
        //     setMeasureWidgetState(state)
        //     let measurement = measureWidget.current.viewModel?.activeViewModel?.measurement
        //     if(measurement){
        //         console.log("VALUE: ", measurement.length)
        //         setMeasureValue(measurement.length)
        //     }

            
        // }

    //     if(measureWidgetState === "measuring"){
    //         document.addEventListener("mousedown", function(){
    //             let activeViewModel = measureWidget.current.viewModel?.activeViewModel
    //             let measurement = measureWidget.current.viewModel?.activeViewModel?.measurement
    //             console.log("VALUE: ", activeViewModel, measurement?.length)
    //             setMeasureValue(measurement.length)
    //         })
    //     }
        
        
    // }, [measureWidget.current])


    const handleMeasureToolType = (event) => { 
    }

    const newMeasurement = () => {
        //this need to be dynamic
        measureWidget.current.activeTool = "area" //activeTool
        measureWidget.current.startMeasurement()
        setMeasureWidgetState("measuring")
    }
// Not sure how to pass the measure widget into the component

    return (
        <div id="MEASURECONTAINER" style={{width: '100%', height: '100%'}} >
            <Box display="flex" flexDirection="column" rowGap={2} p={2}> 
                <Box>Comparable Property Search</Box>
                <StyledPanelButton
                text1={'Distance'} text2={'Area'} text3={'Location'} 
                icon1={<StraightenOutlinedIcon/>} 
                icon2={<SquareFootOutlinedIcon/>} 
                icon3={<MyLocationOutlinedIcon/>}
                onclick={handleMeasureToolType} />
            </Box>

            <Box display="flex" flexDirection="column" rowGap={1} p={1}> 
                <Box>Choose a unit of measure, then click in the map to select your location.</Box>
                <Box ref={measureDiv}>
                   
                </Box>
                {/* <FormControl fullWidth> */}
                    {/* <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Unit
                    </InputLabel>
                    <NativeSelect
                        defaultValue={30}
                        inputProps={{
                        name: 'unit',
                        id: 'uncontrolled-native',
                        }}
                    >
                        <option value={'Degree'}>Degree</option>
                        <option value={'Feet'}>Feet</option>
                    </NativeSelect> */}
                    <StyledButtonFilledPrimary text={"measure"} onClick={newMeasurement}/>
                {/* </FormControl> */}
                
            </Box>

        </div>

        
            )      
}

export default MeasureWidget