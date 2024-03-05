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



// import { initializeMeasureWidget } from "../../arcgis/widgets/measurement";


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const {setMeasureWidgetState, translateText, panelDisplaySecondary,  measureWidgetState, measureWidgetContainer, loadMeasureWidget, setActiveMeasureTool, setMeasureWidgetContainer} = UseAppContext()
    // //use ref for div 
    const measureDiv = useRef(null)
    const areaMeasureWidget = useRef(null)

    const [unit, setUnit] = useState("square-us-feet")
    const [areaMeasurement, setAreaMeasurement] = useState(0)

    const handleUnitChange = (event) => {
        setUnit(event.target.value)
    }

    useEffect(() => {
        const createAreaMeasureWidget = async () => {
            // if(measureDiv.current){
                if(!areaMeasureWidget.current){
                    //areaMeasureWidget.current = new AreaMeasurement2D({
                    areaMeasureWidget.current = new Measurement({
                        view:view,
                        activeTool: "area",
                        areaUnit:"square-us-feet",
                        //container: measureDiv.current,
                        unitOptions: ["square-us-feet","square-yards"],
                        viewModel:{
                            view:view,
                            activeTool:"area",
                            unitOptions:["square-us-feet","square-yards"],
                            areaUnit: "square-us-feet"
                        }
                    })

                    setMeasureWidgetContainer(areaMeasureWidget.current)
                }
            }  
        
        createAreaMeasureWidget();
    }, [areaMeasureWidget]);


    useEffect(() => {

        //console.log("view model: ",  areaMeasureWidget.current.viewModel.activeViewModel.measurementLabel)

           reactiveUtils.watch( 
                () => areaMeasureWidget.current?.viewModel?.activeViewModel?.measurementLabel,
                (label) => {
                    if(label){
                        console.log(
                            "Area: ", label.area,
                            "Perimeter: ", label.perimeter                
                        );
    
                        setAreaMeasurement(label.area)
                    }
                }
            )
    
            reactiveUtils.watch( 
                () => areaMeasureWidget.current.viewModel.state,
                (state) => {
                    if(state){
                        setMeasureWidgetState(true)
                        console.log(
                            "State: ", state               
                        );
                    }
                }
            )
        


    }, [areaMeasureWidget])

    useEffect(() => {
        const setAreaToolMeasure = () => {
            areaMeasureWidget.current.unit = unit
        }

        setAreaToolMeasure()
    }, [unit])


    // const handleToolChange = async (tool) => {

    //     console.log("measure widget state: ", measureWidgetState)
    //     if(!measureWidgetState){
    //         await loadMeasureWidget()
    //         setMeasureWidgetState(true)
            
    //     }
        
    //     setActiveMeasureTool(tool)
   
    // };

    const startMeasuring = () => {
        
        if( areaMeasureWidget.current){
            console.log("Starting measurement Tool")
            areaMeasureWidget.current.startMeasurement()
        }
        
    }

    const clearMeasurement = () => {
        
        if( areaMeasureWidget.current){
            console.log("Clearing measurement Tool")
            areaMeasureWidget.current.startMeasurement()
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
            <Stack direction="row" gap={1} sx={{justifyContent:"center"}}>
                <StyledButtonFilledPrimary
                    
                    //variant={activeTool === 'distance' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<StraightenOutlinedIcon/>}
                    text={'Distance'}
                    textVarient={"body2"}
                    onClick={() => startMeasuring()}
                /> 

                <StyledButtonFilledPrimary
                    //variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<SquareFootOutlinedIcon/>}
                    text={'Area'}
                    textVarient={"body2"}
                    onClick={() => startMeasuring()}
                /> 

            </Stack>
            <Typography align="center" variant="body1">
                {translateText("Choose a unit of measure, then click in the map to set your first point. Double click to finish measuring")}
            </Typography>

            <Box display="flex" flexDirection="row" alignItems="center" columnGap={2} width="100%" justifyContent="space-between">
                <Typography variant="h5" sx={{width: 50}}>{translateText("Unit")}</Typography>
                <Select
                    id="unit-selector"
                    value={unit}
                    onChange={handleUnitChange}
                    sx={{height:30, width:250}}
                >
                    <MenuItem value={"square-us-feet"}>{translateText("square-us-feet")}</MenuItem>
                    <MenuItem value={"square-yards"}>{translateText("square-yards")}</MenuItem>
                    <MenuItem value={"square-miles"}>{translateText("square-miles")}</MenuItem>
                    <MenuItem value={"square-meters"}>{translateText("square-meters")}</MenuItem>
                    <MenuItem value={"acres"}>{translateText("acres")}</MenuItem>
                </Select>
            </Box>

            <Box display="flex" flexDirection="row" columnGap={2} alignItems="center" justifyContent="space-between">
                <Typography variant="h5" sx={{width: 50}}>{translateText("Area")}</Typography>
                <Box 
                display="flex"
                alignItems="center"
                sx={{border: 1, borderColor: theme.palette.info.light, width:150, borderRadius:5, height:30}}>
                    <Typography pl={2}>{areaMeasurement}</Typography>
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

            {/* <Box display="flex" flexDirection="column" alignItems="center" rowGap={1} p={1}> 
                <Box ref={measureDiv} style={{width:"100%", "--calcite-ui-brand" : theme.palette.primary.main}}> </Box>
            </Box> */}
        </Box>
            )      
}

export default MeasureWidget