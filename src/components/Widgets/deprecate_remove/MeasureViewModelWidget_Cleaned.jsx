
import { Box, Button, Typography, Stack, Divider, InputLabel , FormControl, NativeSelect, Select, MenuItem   } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"

import MeasurementViewModel from '@arcgis/core/widgets/Measurement/MeasurementViewModel';
import Measurement from "@arcgis/core/widgets/Measurement.js";
import StyledButtonFilledPrimary from "../../Button/Button";
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
// import StyledButtonFilledPrimary, { StyledPanelButton } from "../Button/Button";



import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import { CalciteIcon } from "@esri/calcite-components-react";
import { theme } from "../../../theme";
import { ContactEmergency } from "@mui/icons-material";

// import StyledButtonFilledPrimary from "../../Button/Button";

//270-measure-widget-redesign-polygon-polyline

export const linearUnitOptions = [
    "feet", "yards", "miles", "meters", "kilometers"
]

const areaUnitOptions = [
    "square-feet", "square-inches", "square-yards", "square-miles", "square-meters", "square-kilometers", "acres"
]
const MeasureViewModelWidget = () => {
    
    const { mapView, 
            translateText, 
            setMeasureWidgetState, 
            measureWidgetState,
            setMeasureWidget,
            measureWidget,
            screenWidth
        
        } = UseAppContext()

    let measurementVM = useRef(null) //ESRI measurementVM
    const [activeTool, setActiveTool] = useState(null) // active tool 
    const [measurementValue, setMeasurementValue] = useState(0) // measurement value
    const [areaUnit, setAreaUnit] = useState(areaUnitOptions[0])
    const [linearUnit, setLinearUnit] = useState(linearUnitOptions[0])

    const graphicsLayer = useRef(null) // ESRI graphics
    let [areaMeasurement, setAreaMeasurement] = useState(null) //polygon unit area
    let  [linearMeasurement, setLinearMeasurement] = useState(null) // line unit length 
    let [userGeometry, setUserGeometry ] = useState(null); // user created geom in props
    let [selectedValue, setSelectedValue ] = useState(null); //drop down menu 
    let [unitAbbrev, setUnitAbbrev ] = useState(null) // unit abbreviation 

    //// Sets the active tool 
    useEffect(() => {
        const setAreaToolMeasure = () => {
            if(activeTool === "area"){
                measurementVM.current.areaUnit = areaUnit
            }
            if(activeTool === "distance"){
                measurementVM.current.linearUnit = linearUnit
            }
        }
        setAreaToolMeasure()
    }, [areaUnit, linearUnit, activeTool])

    //sets the mesurement value
    useEffect(() => {
        const watcher = reactiveUtils.watch(
            () => measurementVM.current?.viewModel?.activeViewModel?.measurementLabel,
            (label) => {
                if (label) {
                    if (label?.area) {
                        // console.log(
                        //     "active tool: ", activeTool,
                        //     "Area: ", label.area,
                        //     "Perimeter: ", label.perimeter
                        // );
                        setMeasurementValue(label.area)
                    } else {
                        // console.log(
                        //     "active tool: ", activeTool,
                        //     "Distance: ", label
                        // );
                        setMeasurementValue(label);
                    }
                }
            }
        );
    
        const unitWatcher = reactiveUtils.watch(
            () => measurementVM.current?.viewModel?.activeViewModel?.unit,
            (unit) => {
                if (unit) {
                    let measurementLabel = measurementVM.current?.viewModel?.activeViewModel?.measurementLabel;
                    if (measurementLabel?.area) {
                        console.log(
                            "Area: ", measurementLabel.area,
                            "Perimeter: ", measurementLabel.perimeter
                        );
                        setMeasurementValue(measurementLabel.area);
                    } else {
                        console.log(
                            "Distance: ", measurementLabel
                        );
                        setMeasurementValue(measurementLabel);
                    }
                }
            }
        );

     
    
        // Cleanup function
        return () => {
            watcher.remove();
            unitWatcher.remove();
            // stateWatcher.remove();
            // Reset measurementValue and activeTool to their initial values
        };
    }, [measurementVM.current]);




    const handleUnitChange = (event) => {
        if(activeTool === "area"){
            setAreaUnit(event.target.value)
        }
        if(activeTool === "distance"){
            setLinearUnit(event.target.value)
        }  
    }

    // does not work to clear
    // useEffect(() => {
    //     setMeasurementValue(0)
    //     setActiveTool(null)

    //     if(measureWidget.current){
    //         measureWidget.current.clear()
    //     }

    // },[panelSecondaryVisible, panelDisplayWidget, measureWidget.current])

    /////redundent and not needed 
    // useEffect(() => {
    //     setActiveTool(null)
    //     setMeasurementValue(0)
    // },[])
    const clearMeasurement = () => {
        
        if( measurementVM.current){
            //console.log("Clearing measurement Tool")
            measurementVM.current.clear()
            setMeasurementValue(0)
            setActiveTool(null)  
            setAreaUnit(areaUnitOptions[0])
            setLinearUnit(linearUnitOptions[0])
        }
        
    }

    const startMeasuring = async (tool) => {
        setActiveTool(tool) 
        if(!measurementVM.current){ 
            // await initializeMeasurementVM()

            measurementVM.current.activeTool = tool
            setMeasurementValue(0)
            await measurementVM.current.when()
            measurementVM.current.startMeasurement()
            
            reactiveUtils.watch(
                () => measurementVM.current?.viewModel?.activeViewModel?.state,
                (state) => {
                    if (state) {
                        console.log("watch the state:", state)
                        if(state && state !=="disabled"){
                            setMeasureWidgetState(true)
                            // console.log('setting TRUE is measured in reactive utils: ', measureWidgetState)
                        }
                        else{
                            setMeasureWidgetState(false)
                            // console.log('setting FALSE is measured in reactive utils: ', measureWidgetState)
                        }
                    }
                }
            );  
        }
    }

    useEffect(() => {
        const initializeMeasurementVM = async () =>{
            //initializes the ESRI sketch View Model. 
            // if(!graphicsLayer.current){ await createGraphicLayer() }
            if(!measurementVM.current){
                measurementVM.current = new Measurement({
                    view: mapView,
                    activeTool: activeTool,
                    areaUnit:"square-us-feet",
                    linearUnit: "us-feet",
                    // label:"measureGraphic",
                    // title: "measureGraphic",
                    viewModel:{
                        view: mapView,
                        activeTool: activeTool,
                        areaUnit: "square-us-feet",
                        linearUnit: "us-feet",
                        // label:"measureGraphic",
                        // title: "measureGraphic"
                    }, 
                }) 
                setMeasureWidget(measurementVM.current)
            }
        }
        initializeMeasurementVM()
    }, []);

    return (
        <Box display="flex" flexDirection="column"  rowGap={1}>

            <Divider />
            <Typography align="center" variant="body1">
            {translateText("Start by selecting a measure tool.")}
            </Typography>
            <Box display="flex" flexDirection="row" gap={1} sx={{justifyContent:"center"}}>
                <StyledButtonFilledPrimary
                    color="primary"
                    startIcon={<StraightenOutlinedIcon/>}
                    text={translateText('Distance')}
                    textVarient={"body2"}
                    active={activeTool === "distance" ? true: false}
                    onClick={() => startMeasuring("distance")}
                /> 

                <StyledButtonFilledPrimary
                    variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<SquareFootOutlinedIcon/>}
                    text={translateText('Area')}
                    textVarient={"body2"}
                    active={activeTool === "area" ? true: false}
                    onClick={() => startMeasuring("area")}
                /> 

            </Box>
            <Divider />

            <Typography align="center" variant="body1">
                {translateText("Click in the map to set your first point. Double click to stop measuring")}
            </Typography>

            <Box display="flex" flexDirection={screenWidth <= theme.breakpoints.values.md ? "row" : "column" } rowGap={2} columnGap={2} width="100%">

            <Box display="flex" flex={2} flexDirection="row" alignItems="center" columnGap={1} width="100%" justifyContent="space-between">
                <Typography variant="h5" sx={{ width: screenWidth <= theme.breakpoints.values.md ? "auto" : 75,  display:"flex"}}>{translateText("Unit")}</Typography>
                <Select
                    disabled = {!activeTool}
                    id="unit-selector"
                    value={activeTool && activeTool === "area" ? areaUnit : linearUnit}
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
            <Divider />
            {/* <DropDownUnitMeasurement/>
            { (activeTool) ? <Divider /> : ''}
            { (activeTool) ? 
                <Stack 
                direction="row" spacing={2}
                useFlexGap 
                sx={{  
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{textTransform:"none", 
                        display:"flex", 
                        flexDirection:"row", 
                        columnGap:1,
                        width: "40%",
                    }}
                        onClick={completeAllGraphics}>   
                            <CalciteIcon icon="check-square"/>
                            <Typography variant="body1">
                                {translateText("Done")}
                            </Typography>
                    </Button>  

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{textTransform:"none", 
                        display:"flex", 
                        flexDirection:"row", 
                        columnGap:1,
                        width: "40%",
                    }}
                        onClick={removeAllGraphics}>   
                            <CalciteIcon icon="trash"/>
                            <Typography variant="body1">
                                {translateText("Remove")}
                            </Typography>
                    </Button> 
                </Stack>
        : ''} */}
        </Box>        
    )      
}

export default MeasureViewModelWidget
