import { Box, MenuItem, Select, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import { theme } from "../../theme"

import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import StyledButtonFilledPrimary, { StyledPanelButton } from "../Button/Button";


import Measurement from "@arcgis/core/widgets/Measurement.js";
import { view } from "../../arcgis/webmap/webmap";


import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

export const linearUnitOptions = [
    "feet", "yards", "miles", "meters", "kilometers"
]

const areaUnitOptions = [
    "square-inches", "square-feet", "square-yards", "square-miles", "square-meters", "square-kilometers", "acres"
]

// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const { panelDisplayWidget, setMeasureWidgetState, translateText, setMeasureWidget, panelSecondaryVisible, screenWidth, mapView, setIsMeasuring, isMeasuring} = UseAppContext()
    // //use ref for div 
    const measureWidget = useRef(null)

    const [areaUnit, setAreaUnit] = useState(areaUnitOptions[0])
    const [linearUnit, setLinearUnit] = useState(linearUnitOptions[0])
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
        setActiveTool(null)

        if(measureWidget.current){
            measureWidget.current.clear()
        }

    },[panelSecondaryVisible, panelDisplayWidget, measureWidget.current])

    useEffect(() => {
        setActiveTool(null)
        setMeasurementValue(0)
    },[])

    useEffect(() => {
        const createmeasureWidget = async () => {
                if(!measureWidget.current){
                    //console.log("initializing new measure widget startup")
                    measureWidget.current = new Measurement({
                        view:mapView,
                        activeTool: activeTool,
                        areaUnit:"square-us-feet",
                        linearUnit: "us-feet",
                        viewModel:{
                            view:mapView,
                            activeTool:activeTool,
                            areaUnit: "square-us-feet",
                            linearUnit: "us-feet",
                        }
                    })
                    setMeasureWidget(measureWidget.current)
                }

                // else{
                //     setActiveTool(null)
                //     setMeasurementValue(0)
                //     measureWidget.current.clear()
                // }
            }  
        
        createmeasureWidget();

        // return () => {
        //     if (measureWidget.current) {
        //         //console.log("destroying widget")
        //         setActiveTool(null)
        //         setMeasurementValue(0)
        //         measureWidget.current.destroy()
        //         measureWidget.current.clear()
        //     }
        // };
    }, []);

    useEffect(() => {
        const watcher = reactiveUtils.watch(
            () => measureWidget.current?.viewModel?.activeViewModel?.measurementLabel,
            (label) => {
                if (label) {
                    if (label?.area) {
                        console.log(
                            "active tool: ", activeTool,
                            "Area: ", label.area,
                            "Perimeter: ", label.perimeter
                        );
                        setMeasurementValue(label.area)
                        setIsMeasuring(true);
                    } else {
                        console.log(
                            "active tool: ", activeTool,
                            "Distance: ", label
                        );
                        setMeasurementValue(label);
                    }
                }
            }
        );
    
        const unitWatcher = reactiveUtils.watch(
            () => measureWidget.current?.viewModel?.activeViewModel?.unit,
            (unit) => {
                if (unit) {
                    let measurementLabel = measureWidget.current?.viewModel?.activeViewModel?.measurementLabel;
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
    }, [measureWidget.current]);
    
    // useEffect( () => {
    //        reactiveUtils.watch( 
    //             () => measureWidget.current?.viewModel?.activeViewModel?.measurementLabel,
    //             (label) => {
    //                 if(label){
    //                     if(label?.area){
    //                         //console.log(
    //                             "active tool: ", activeTool, 
    //                             "Area: ", label.area,
    //                             "Perimeter: ", label.perimeter                
    //                         );
    //                         setMeasurementValue(label.area)
    //                     }
    //                     else{
    //                         //console.log(
    //                             "active tool: ", activeTool,
    //                             "Distance: ", label,            
    //                         );
    //                         setMeasurementValue(label)
    //                     }
    
                        
    //                 }
    //             }
    //         )

    //         reactiveUtils.watch( 
    //             () => measureWidget.current?.viewModel?.activeViewModel?.unit,
    //             (unit) => {
    //                 if(unit){
    //                     let measurementLabel = measureWidget.current?.viewModel?.activeViewModel?.measurementLabel
    //                     if(measurementLabel?.area){
    //                         //console.log(
    //                             "Area: ", measurementLabel.area,
    //                             "Perimeter: ", measurementLabel.perimeter                
    //                         );
    //                         setMeasurementValue(measurementLabel.area)
    //                     }
    //                     else{
    //                         //console.log(
    //                             "Distance: ", measurementLabel,            
    //                         );
    //                         setMeasurementValue(measurementLabel)
    //                     }
    
                        
    //                 }
    //             }
    //         )
        
    // }, [measureWidget])

    // useEffect(() => {

    //     reactiveUtils.watch( 
    //         () => measureWidget.current.viewModel.state,
    //         (state) => {
    //             //console.log("measure state: ", state)
    //             if(state){
    //                 setMeasureWidgetState(true)
    //                 //console.log(
    //                     "State: ", state               
    //                 );
    //             }
    //         }
    //     )
        
    // })


    

    useEffect(() => {
        const updateMeasureState = (state) => {
            //console.log("measure state: ", state);
            if (state && state !== "disabled") {
                setMeasureWidgetState(true);
                setIsMeasuring(true);
                //console.log("State: ", state);
            }
            else{
                measureWidget.current.clear();
            }
        };
    
        const watcher = reactiveUtils.watch(
            () => measureWidget.current.viewModel.state,
            updateMeasureState
        );
    
        // Cleanup function
        return () => {
            watcher.remove();
        };
    }, [measureWidget.current?.viewModel?.state]);

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
        // setIsMeasuring(true)
        setMeasureWidgetState(true)
        setActiveTool(tool) 
        if( measureWidget.current){
            //console.log("Starting measurement Tool: ", measureWidget.current)
            await measureWidget.current.when()
            measureWidget.current.activeTool = tool
            setMeasurementValue(0)
            await measureWidget.current.when()
            measureWidget.current.startMeasurement()
            
            reactiveUtils.watch(
                () => measureWidget.current?.viewModel?.activeViewModel?.state,
                (state) => {
                    if (state) {
                        if(state !=="disabled"){
                            
                            setIsMeasuring(true)
                            console.log('setting set is measured in reactive utils: ', isMeasuring)
                        } else{
                            setIsMeasuring(false)
                            console.log('setting set is measured in reactive utils: ', isMeasuring)
                        }
                        
                        console.log("watch the state:", state)
                    }
                }
            );   
        }
        
    }

    const clearMeasurement = () => {
        
        if( measureWidget.current){
            //console.log("Clearing measurement Tool")
            measureWidget.current.clear()
            setMeasurementValue(0)
            setActiveTool(null)  
            setAreaUnit(areaUnitOptions[0])
            setLinearUnit(linearUnitOptions[0])
        }
        
    }
    // var operationalLayers = map.webMapResponse.itemData.operationalLayers;

    // console.log(mapView.map.layers.items)
    // console.log(Object.keys(mapView))

    // Iterate through each layer in the map
    // mapView.map.layers.forEach(function(layer) {
    //     // Log the layer name and type
    //     console.log("Layer Name: " + layer.title);
    //     console.log("Layer Type: " + layer.type);
    //     console.log("Layer : " + layer.layerObject.setSelectionEnabled);
    // });


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
            {/* <Box display="flex" flexDirection="column" alignItems="center" rowGap={1} p={1}> 
                <Box ref={measureDiv} style={{width:"100%", "--calcite-ui-brand" : theme.palette.primary.main}}> </Box>
            </Box> */}
        </Box>
            )      
}

export default MeasureWidget