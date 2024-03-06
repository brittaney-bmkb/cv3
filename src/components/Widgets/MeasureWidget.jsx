import { Box, MenuItem, Select, Stack, Typography } from "@mui/material"
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

import AreaMeasurement2D from "@arcgis/core/widgets/AreaMeasurement2D.js";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

const linearUnitOptions = [
    "inches", "us-feet", "yards", "miles", "meters", "kilometers"
]

const areaUnitOptions = [
    "square-inches", "square-us-feet", "square-yards", "square-miles", "square-meters", "square-kilometers", "acres"
]

// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const {setMeasureWidgetState, translateText, setMeasureWidget, panelSecondaryVisible, screenWidth} = UseAppContext()
    // //use ref for div 
    const measureWidget = useRef(null)

    const [areaUnit, setAreaUnit] = useState("square-us-feet")
    const [linearUnit, setLinearUnit] = useState("us-feet")
    const [measurementValue, setMeasurementValue] = useState(0)
    const [activeTool, setActiveTool] = useState(null)

    const handleUnitChange = (event) => {
        if(activeTool === "area"){
            setAreaUnit(event.target.value)
        }
        if(activeTool === "distance"){
            setLinearUnit(event.target.value)
        }  
    }

    useEffect(() => {
        setMeasurementValue(0)
    },[panelSecondaryVisible])

    useEffect(() => {
        const createmeasureWidget = async () => {
                if(!measureWidget.current){
                    measureWidget.current = new Measurement({
                        view:view,
                        activeTool: activeTool,
                        areaUnit:"square-us-feet",
                        linearUnit: "us-feet",
                        viewModel:{
                            view:view,
                            activeTool:activeTool,
                            areaUnit: "square-us-feet",
                            linearUnit: "us-feet",
                        }
                    })
                    setMeasureWidget(measureWidget.current)
                }
            }  
        
        createmeasureWidget();
    }, [measureWidget]);


    useEffect(() => {
           reactiveUtils.watch( 
                () => measureWidget.current?.viewModel?.activeViewModel?.measurementLabel,
                (label) => {
                    if(label){

                        if(label?.area){
                            console.log(
                                "active tool: ", activeTool, 
                                "Area: ", label.area,
                                "Perimeter: ", label.perimeter                
                            );
                            setMeasurementValue(label.area)
                        }
                        else{
                            console.log(
                                "active tool: ", activeTool,
                                "Distance: ", label,            
                            );
                            setMeasurementValue(label)
                        }
    
                        
                    }
                }
            )

            reactiveUtils.watch( 
                () => measureWidget.current?.viewModel?.activeViewModel?.unit,
                (unit) => {
                    if(unit){
                        let measurementLabel = measureWidget.current?.viewModel?.activeViewModel?.measurementLabel
                        if(measurementLabel?.area){
                            console.log(
                                "Area: ", measurementLabel.area,
                                "Perimeter: ", measurementLabel.perimeter                
                            );
                            setMeasurementValue(measurementLabel.area)
                        }
                        else{
                            console.log(
                                "Distance: ", measurementLabel,            
                            );
                            setMeasurementValue(measurementLabel)
                        }
    
                        
                    }
                }
            )
    
            reactiveUtils.watch( 
                () => measureWidget.current.viewModel.state,
                (state) => {
                    if(state !== "disabled"){
                        setMeasureWidgetState(true)
                        console.log(
                            "State: ", state               
                        );
                    }

                    else{
                        setMeasureWidgetState(null)
                    }
                }
            )
        
    }, [measureWidget])

    useEffect(() => {
        const setAreaToolMeasure = () => {
            if(activeTool === "area"){
                measureWidget.current.areaUnit = areaUnit
            }
            if(activeTool === "distance"){
                measureWidget.current.linearUnit = linearUnit
            }
        }

        setAreaToolMeasure()
    }, [areaUnit, linearUnit, activeTool])


    const startMeasuring = async (tool) => {
        setActiveTool(tool) 
        if( measureWidget.current){
            console.log("Starting measurement Tool: ", measureWidget.current)
            await measureWidget.current.when()
            measureWidget.current.activeTool = tool
            setMeasurementValue(0)
            await measureWidget.current.when()
            measureWidget.current.startMeasurement()
        }
        
    }

    const clearMeasurement = () => {
        
        if( measureWidget.current){
            console.log("Clearing measurement Tool")
            measureWidget.current.clear()
            setMeasurementValue(0)
            setActiveTool(null)  
        }
        
    }


    return (
        <Box 
        id="MEASURECONTAINER" 
        display="flex" 
        width="100%"  
        height= "auto" 
        flexDirection="column" 
        justifyContent="center" 
        alignContent="center"
        rowGap={2}
        >
            <Typography align="center" variant="body1">
            {translateText("Start by selecting a measure tool.")}
            </Typography>
            <Box display="flex" flexDirection="row" gap={1} sx={{justifyContent:"center"}}>
                <StyledButtonFilledPrimary
                    color="primary"
                    startIcon={<StraightenOutlinedIcon/>}
                    text={'Distance'}
                    textVarient={"body2"}
                    active={activeTool === "distance" ? true: false}
                    onClick={() => startMeasuring("distance")}
                /> 

                <StyledButtonFilledPrimary
                    //variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<SquareFootOutlinedIcon/>}
                    text={'Area'}
                    textVarient={"body2"}
                    active={activeTool === "area" ? true: false}
                    onClick={() => startMeasuring("area")}
                /> 

            </Box>
            <Typography align="center" variant="body1">
                {translateText("Click in the map to set your first point. Double click to stop measuring")}
            </Typography>

            <Box display="flex" flexDirection={screenWidth <= theme.breakpoints.values.md ? "row" : "column" } rowGap={2} columnGap={2} width="100%">

            <Box display="flex" flex={2} flexDirection="row" alignItems="center" columnGap={1} width="100%" justifyContent="space-between">
                <Typography variant="h5" sx={{ width: screenWidth <= theme.breakpoints.values.md ? "auto" : 75,  display:"flex"}}>{translateText("Unit")}</Typography>
                <Select
                    disabled = {!activeTool}
                    id="unit-selector"
                    value={activeTool === "area" ? areaUnit : linearUnit}
                    onChange={handleUnitChange}
                    sx={{height:30, display:"flex", flex:2}}
                >
                    {
                        activeTool === "area" ? areaUnitOptions.map((unit) => (
                            <MenuItem key={unit} value={unit}>{translateText(unit)}</MenuItem>
                        ))
                        :
                        linearUnitOptions.map((unit) => (
                        <MenuItem key={unit} value={unit}>{translateText(unit)}</MenuItem>
                        ))
                    }
                    
                </Select>
            </Box>

            <Box display="flex" flex={3} flexDirection="row" columnGap={1} alignItems="center" justifyContent="space-between">
                <Typography variant="h5" sx={{ width: screenWidth <= theme.breakpoints.values.md ? "auto" : 75,  display:"flex"}}>{translateText(activeTool === 'area' ? "Area" : "Distance")}</Typography>
                <Box 
                display="flex"
                alignItems="center"
                sx={{border: 1, borderColor: theme.palette.info.light, borderRadius:5, height:30, flex:3}}>
                    <Typography pl={2}>{measurementValue ?? 0}</Typography>
                </Box>

                <StyledButtonFilledPrimary
                    //variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    width="auto"
                    text={translateText('Clear')}
                    textVarient={"body2"}
                    
                    onClick={() => clearMeasurement()}
                /> 

            </Box>
            </Box>
            {/* <Box display="flex" flexDirection="column" alignItems="center" rowGap={1} p={1}> 
                <Box ref={measureDiv} style={{width:"100%", "--calcite-ui-brand" : theme.palette.primary.main}}> </Box>
            </Box> */}
        </Box>
            )      
}

export default MeasureWidget