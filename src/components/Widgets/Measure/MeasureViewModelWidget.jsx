
import { Box, Button, Typography, Stack, Divider, InputLabel , FormControl, NativeSelect   } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import { CalciteIcon } from "@esri/calcite-components-react";
import { theme } from "../../../theme";
import { ContactEmergency } from "@mui/icons-material";

//270-measure-widget-redesign-polygon-polyline

const MeasureViewModelWidget = () => {
    
    const { mapView, translateText  } = UseAppContext()
    const graphicsLayer = useRef(null) // ESRI graphics
    let sketchVM = useRef(null) //ESRI sketchVM
    const [activeTool, setActiveTool] = useState(null) // active tool plyline or polygon 
    let [areaMeasurement, setAreaMeasurement] = useState(null) //polygon unit area
    let  [linearMeasurement, setLinearMeasurement] = useState(null) // line unit length 
    let [userGeometry, setUserGeometry ] = useState(null); // user created geom in props
    let [selectedValue, setSelectedValue ] = useState(null); //drop down menu 
    let [unitAbbrev, setUnitAbbrev ] = useState(null) // unit abbreviation 

    const measurementUnitOptions = [
        //TODO this object should be the main object
        { key: 'feet',              value: 'ft', label: translateText("feet")  },
        { key: 'yards',             value: 'yd', label: translateText("yards") },
        { key: 'miles',             value: 'mi', label: translateText("miles") },
        { key: 'meters',            value: 'm',  label: translateText("meters") },
        { key: 'kilometers',        value: 'km', label: translateText("kilometers") },
        { key: 'acres',             value: 'ac', label: translateText("acres") },
        { key: 'square-feet',       value: 'ft', label: translateText("square-feet"),       superscript: <sup>2</sup> },
        { key: 'square-meters',     value: 'm',  label: translateText("square-meters"),     superscript: <sup>2</sup> },
        { key: 'square-yards',      value: 'yd', label: translateText("square-yards"),      superscript: <sup>2</sup> },
        { key: 'square-kilometers', value: 'km', label: translateText("square-kilometers"), superscript: <sup>2</sup> },
        { key: 'square-miles',      value: 'mi', label: translateText("square-miles"),      superscript: <sup>2</sup> }            
    ]

    const unitMeasurementAbbrev = (stringToCheck) => {

        const matchedOption = measurementUnitOptions.find(option => 
            stringToCheck === option.key
        );

        if (matchedOption) {
            setUnitAbbrev(
                <span>
                    {matchedOption.value} {matchedOption.superscript ? matchedOption.superscript : ''}
                </span>
            );
        } 
    }

    const handleChange = (e) => {
        // setSelectedValue(e.target.value)
        unitMeasurementAbbrev(e.target.value)
        
        if (activeTool==='polygon'){
            getArea(userGeometry, e.target.value)
        } else{
            getLength(userGeometry, e.target.value)
        }
    }

    const DropDownUnitMeasurement = () => {
        // measurementUnitOptions should be the main object

        // this function controls the drop down menu and handles the change for unit abbrv and 
        // the unit calculation. 
        
        const linearUnitOptions = [
            {value: 'feet', label: translateText("feet") },
            {value: 'yards', label: translateText("yards") },
            {value: 'miles', label: translateText("miles") },
            {value: 'meters', label: translateText("meters") },
            {value: 'kilometers', label: translateText("kilometers") }
        ]

        const areaUnitOptions = [
            {value: 'acres', label: translateText("acres") },
            {value: 'square-feet', label: translateText("square-feet")  },
            {value: 'square-meters', label: translateText("square-meters") },
            {value: 'square-yards', label: translateText("square-yards") },
            {value: 'square-kilometers', label: translateText("square-kilometers") },
            {value: 'square-miles', label: translateText("square-miles") }
        ]

        return(            
            activeTool === null ? (null) : (
                <Stack direction="column" spacing={2}>
                    <Box component="section" >
                        {activeTool == "polyline" ? 
                            <span><Typography variant="h3"> {translateText("Length")}: {linearMeasurement} {unitAbbrev}</Typography> </span> : 
                            <span><Typography variant="h3"> {translateText("Area")}: {areaMeasurement} {unitAbbrev}</Typography> </span> }   
                    </Box>
                    <FormControl size='small'>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        <Typography variant="subtitle2">{translateText("Unit of Measurement")}</Typography>
                    </InputLabel>
                        <NativeSelect
                            inputProps={{
                            name: 'unitType',
                            id: 'unit-measure-select',
                            }}
                            value={selectedValue}
                            onChange={handleChange}
                        >
                            {activeTool ==="polygon" ? (
                                    areaUnitOptions.map((measureUnitOptions)  => (
                                        <option key={measureUnitOptions.value} value={measureUnitOptions.value}>
                                            {measureUnitOptions.label}
                                        </option>
                                    )) 
                                ) : (
                                    linearUnitOptions.map((measureUnitOptions)  => (
                                        <option key={measureUnitOptions.value} value={measureUnitOptions.value}>
                                            {measureUnitOptions.label}
                                        </option>
                                    )) 
                                )
                            }
                        </NativeSelect>            
                    </FormControl>        
                </Stack>
            )
        )
    }



    const getPositiveNumber = (negativeNumber) => {
        const positiveNumber = (negativeNumber < 0) ? -negativeNumber : negativeNumber;
        return positiveNumber.toFixed(2)
    }
    
    const getArea = (polygon) => {
        console.log("Get area: ", polygon, selectedValue)
        const planarArea = geometryEngine.planarArea(polygon, selectedValue);
        const planarAreaPositive = getPositiveNumber(planarArea);
        setAreaMeasurement(planarAreaPositive) //todo add this back to props       
        return planarAreaPositive
    }
    
    const getLength= (line) =>{
        console.log("Get length: ", line, selectedValue)
        const planarLength = geometryEngine.planarLength(line, selectedValue);
        const planarLengthPositive = getPositiveNumber(planarLength)
        setLinearMeasurement(planarLengthPositive) //todo add this back to props 
        return planarLengthPositive
    }
    
    function switchType(geom) {
        console.log("Check out geom type",geom.type);
        //switches between polyline and polygon and sets props as needed to reflect in widget
        switch (geom.type) {
            
            case "polygon":
                setActiveTool(geom.type);
                setUserGeometry(geom)
                // setSelectedValue('square-meters')  
                // unitMeasurementAbbrev('square-meters')
                getArea(geom);
                break;
            case "polyline":
                setActiveTool(geom.type);
                setUserGeometry(geom)
                // setSelectedValue('meters')
                // unitMeasurementAbbrev('meters')
                getLength(geom);
                break;
            default:
                console.log("No value found");
        }
    }    
    
    const createGraphicLayer = async () => {
        //creates the graphic needed to be added in the map. 
        graphicsLayer.current = new GraphicsLayer({
            title:"measureGraphic" // makes is searchable for WebMapComponentBeta to clear when widget not in use and for hittest to not occur
        })
        mapView.map.add(graphicsLayer.current)
    }

    const removeAllGraphics = async () => {
        //removes all graphics and set props to null as if in a new session 
        graphicsLayer.current.removeAll();
        setActiveTool(null)       
        setAreaMeasurement(null)
        setLinearMeasurement(null)
        setSelectedValue(null)
        setUserGeometry(null)
        setUnitAbbrev(null)
    }

    const completeAllGraphics = async () => {
        //completes all graphics with the done button
        sketchVM.current.complete();
    }

    // const checkDropDownAbbrev = (menuValue, abbrevValue) =>{
    //     //levaing in this function for posterity but may not be needed. 
    //     // console.log('Inside Console Log', abbrevValue)
    //     // menuValue is key in object
    //     // abbrevValue is value  in object. WE want this key in order to set it in the drop down. 

    //     // measurementUnitOptions.some(option => option.value === value && option.key === key);
    //     // if (!abbrevValue){
    //         const menuValueOption = measurementUnitOptions.find(option => menuValue === option.key );
    //         const abbrevValueOption = measurementUnitOptions.find(option => abbrevValue === option.value );

    //         if (menuValueOption.key === abbrevValueOption.key ){
    //             setSelectedValue(abbrevValueOption.key)
    //         }
    
    //         console.log('menuValueOption',menuValueOption)
    //         console.log('abbrevValueOption',abbrevValueOption)

    //     // }


    // }

    const startMeasuring = async (geom_type) => {
        
        // heart of the widget, controls all creation and update of a polyline/polygon
        // from here the majority of functions are altered. 
        if(!graphicsLayer.current){ await createGraphicLayer() }
        await initializeSketchVM()

        

        if (sketchVM.current.state ==='active'){
            sketchVM.current.cancel()

        } else{
            removeAllGraphics()
            console.log("Currently selected value: ", selectedValue)
            sketchVM.current.create(geom_type); // polygon || polyline
        }

        sketchVM.current.on("create", (e) => {
            if (e.graphic){
                let geometry =  e.graphic.geometry;
                setUserGeometry(geometry)
                
                if (e.state === "active") {
                    // if (activeTool==='polygon'){
                    //     setSelectedValue('square-meters')  
                    //     unitMeasurementAbbrev('square-meters')
                    // } else{
                    //     setSelectedValue('meters')  
                    //     unitMeasurementAbbrev('meters')
                    // }

                    setUserGeometry(e.graphic.geometry)
                    switchType(geometry);
    
                }
                if (e.state === "complete") {
                    console.log('complete state')
                    setUserGeometry(e.graphic.geometry) 
                    // convertPolyline2Polygon(geometry);
                }
                if (
                    e.toolEventInfo &&
                    (e.toolEventInfo.type === "scale-stop" ||
                    e.toolEventInfo.type === "reshape-stop" ||
                    e.toolEventInfo.type === "move-stop")
                    
                ) {
                    console.log('rescale state')
                    switchType(geometry);
                }

            }


        });
        
        // useEffect(() => {
        //     const updateUnitType  = () => {
        //         if (activeTool==='polygon'){
        //             setSelectedValue('square-meters')  
        //             unitMeasurementAbbrev('square-meters')
        //         } else{
        //             setSelectedValue('meters')  
        //             unitMeasurementAbbrev('meters')
        //         }
        //     }
        //     updateUnitType()

        //     // return () => {
        //     //   window.removeEventListener('resize', handleResize);
        //     //   //window.removeEventListener('resize', resizeOps);
        //     // };
        
        //     //window.innerHeight
        //   }, [selectedValue, unitAbbrev, activeTool]);


        sketchVM.current.on("update", (e) => {
            const geometry =  e.graphics[0].geometry;
            if (e.state === "start") {
                switchType(geometry);
            }
            if (e.state === "complete") {
                //TODO NEED TO REMOVE AND TEST 
                // console.log("sketch on complete", e)
                // switchType(geometry);
                // graphicsLayer.current.remove(graphicsLayer.current.graphics.getItemAt(0));
            //   measurements.innerHTML = null;
            }
            if (
                e.toolEventInfo &&
                (e.toolEventInfo.type === "scale-stop" ||
                e.toolEventInfo.type === "reshape-stop" ||
                e.toolEventInfo.type === "move-stop")
                
            ) {
                switchType(geometry);
            }
        });
    }    
    // const checkLatLongArray = (geom) => {
    //     //checks the first and last points in a line to see if they match. IF they match then the polyline should be
    //     // converted to a polygon
    //     let polygonRings = geom.paths[0]
    //     let firstLat =polygonRings[0][0]
    //     let firstLon = polygonRings[0][1]
    //     let lastLat = polygonRings[polygonRings.length -1][0]
    //     let lastLon = polygonRings[polygonRings.length -1][1]
    //     let results = (firstLat === lastLat && firstLon === lastLon)
    //     return results
    // }


    // const convertPolyline2Polygon = (geom) => {
    //     //converts polyline to polygon and creates the graphic as needed. 
    //     // colors need to be altered in theme js 
    //     let isPolygon = checkLatLongArray(geom)
    //     if (isPolygon){
    //         const polygon = {
    //             type:"polygon",
    //             spatialReference: {
    //                 wkid: 102671,
    //                 latestWkid:3436
    //             },                
    //             rings:geom.paths[0]
    //         };
    //         const simplePolygonSymbol = {
    //             type: "simple-fill",
    //             color: theme.measureGraphics.polygon.color,
    //             outline: {
    //                 color: theme.measureGraphics.polygonOutline.color,
    //                 width: theme.measureGraphics.polygonOutline.width,
    //             },
    //         };       
    //         const polygonGraphic = new Graphic({
    //             geometry: polygon,
    //             symbol: simplePolygonSymbol
    //         });
    //         graphicsLayer.current.removeAll();
    //         graphicsLayer.current.add(polygonGraphic);
    //         switchType(polygonGraphic.geometry)
    //     }
    // }

    // const simplePolygonSymbol = {
    //     type: "simple-fill",
    //     color: theme.measureGraphics.polygon.color,
    //     outline: {
    //         color: theme.measureGraphics.polygonOutline.color,
    //         width: theme.measureGraphics.polygonOutline.width,
    //     },
    // };  

    const initializeSketchVM = async () =>{
        //initializes the ESRI sketch View Model. 
        if(!sketchVM.current){
            sketchVM.current = new SketchViewModel({
                view: mapView,
                layer: graphicsLayer.current, 
                creationMode:"continuous",
                polylineSymbol: {
                    type: "simple-line",
                    color: theme.measureGraphics.line.color,
                    width: theme.measureGraphics.line.width
                },
                polygonSymbol: {
                    type: "simple-fill",
                    color: theme.measureGraphics.polygon.color,
                    outline: {
                        color: theme.measureGraphics.polygonOutline.color,
                        width: theme.measureGraphics.polygonOutline.width,
                    },
                },         
                defaultCreateOptions: { hasZ: false },
                snappingOptions: { // autocasts to SnappingOptions()
                    distance:8, // snapping tolerance by pixels
                    enabled: true, // global snapping is turned on
                    featureEnabled: false,
                    selfEnabled: true,
                    // assigns a collection of FeatureSnappingLayerSource() and enables feature snapping on this layer
                    // featureSources: [{ layer: graphicsLayer.current, enabled: true }]
                }        
            }) 
        }
    }

    return (
        <Box display="flex" flexDirection="column"  rowGap={1}>

            <Divider />

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
                    onClick={() => {startMeasuring("polyline")} }>   
                        <CalciteIcon icon="measure-line"/>
                        <Typography variant="body1">
                            {translateText("Distance")}
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
                    onClick={() => {startMeasuring("polygon")} }>   
                        <CalciteIcon icon="measure-area"/>
                        <Typography variant="body1">
                            {translateText("Area")}
                        </Typography>
                </Button>                

            </Stack>
            <Divider />
            <DropDownUnitMeasurement/>
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
        : ''}
        </Box>        
    )      
}

export default MeasureViewModelWidget
