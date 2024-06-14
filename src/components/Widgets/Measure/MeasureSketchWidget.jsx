
import { Box, Button, Select, Typography, Stack, TextField, Divider, InputLabel , FormControl, NativeSelect   } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import { ArcgisSketch } from "@arcgis/map-components-react"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Sketch from "@arcgis/core/widgets/Sketch.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";

import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import StyledButtonFilledPrimary from "../../Button/Button";
import CalculateIcon from '@mui/icons-material/Calculate';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import { CalciteIcon } from "@esri/calcite-components-react";
import { theme } from "../../../theme";

//// https://developers.arcgis.com/javascript/latest/tutorials/find-length-and-area/
//// https://developers.arcgis.com/javascript/latest/tutorials/find-length-and-area/#add-an-event-listener
//// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch.html#update
//// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch.html#event-update
//// https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html
//// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch.html#properties-summary
//// https://developers.arcgis.com/javascript/latest/sample-code/sketch-geometries/
//// https://developers.arcgis.com/javascript/latest/api-reference/esri-views-interactive-snapping-SnappingOptions.html
//// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch.html
//// https://community.esri.com/t5/arcgis-javascript-maps-sdk-questions/how-to-convert-a-line-to-polygon-in-js-api-4-x/m-p/420334#M38612
//// https://community.esri.com/t5/arcgis-javascript-maps-sdk-questions/getting-geodesic-area-ve/td-p/121084 // negative values 
//// 


//TODO Remove and draw should only after start of session - DONE 
//TODO continue to test merge                     - DONE
//TODO better layer out for buttons               - DONE 
//TODO have abbr unit set                         - DONE 
//TODO Inspect colors over aerial                 - DONE
//TODO graphic style & add graphics to themes.js  - DONE
//TODO typography                                 - DONE
// TODO change abbrevbation to match drop down    - DONE

//TODO have tool and layer close when tool exists - Done
//TODO hittest - IP 


//TODO Done button should only appear is graphic not complete

const MeasureSketchWidget = () => {
    
    const { mapView, map, translateText  } = UseAppContext()
    const graphicsLayer = useRef(null) // ESRI graphics
    let sketchVM = useRef(null) //ESRI sketchVM
    const [activeTool, setActiveTool] = useState(null) // active tool plyline or polygon 
    let [areaMeasurement, setAreaMeasurement] = useState(null) //polygon unit area
    let  [linearMeasurement, setLinearMeasurement] = useState(null) // line unit length 
    
    let [userGeometry, setUserGeometry ] = useState(null); // user created geom in props
    let [selectedValue, setSelectedValue ] = useState(null); //drop down menu 
    let [unitAbbrev, setUnitAbbrev ] = useState(null) // unit abbreviation 

    const handleChange = (e) => {
        setSelectedValue(e.target.value)
        unitMeasurementAbbrev(e.target.value)
        
        if (activeTool==='polygon'){
            getArea(userGeometry, e.target.value)
        } else{
            getLength(userGeometry, e.target.value)
        }
    }

    const measurementUnitOptions = [
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

    const DropDownUnitMeasurement = () => {
        
        const linearUnitOptions = [
            {value: 'feet', label: translateText("feet") },
            {value: 'yards', label: translateText("yards") },
            {value: 'miles', label: translateText("miles") },
            {value: 'meters', label: translateText("meters") },
            {value: 'kilometers', label: translateText("kilometers") }
        ]

        //https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#AreaUnits
        // "acres"|"ares"|"hectares"|"square-feet"|"square-meters"|"square-yards"|"square-kilometers"|"square-miles"
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
                            // defaultValue={areaUnitOptions[0].value}
                            // defaultValue={selectedValue}
                            inputProps={{
                            name: 'unitType',
                            id: 'unit-measure-select',
                            }}
                            value={selectedValue}
                            onChange={handleChange}
                        >
                        
                        {/* {      measurementUnitOptions.map((measureUnitOptions)  => (
                                        <option key={measureUnitOptions.key} value={measureUnitOptions.key}>
                                            {measureUnitOptions.label}
                                        </option>
                                    )) } */}
                                
                  
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



    // useEffect(() => {

    //     const updateUnits = () =>{
    //         //check if user geom is not null and selected
    //             //inside check if polygon or polyline 
                        
    //     // if (activeTool==='polygon'){
    //     //     getArea(userGeometry, e.target.value)
    //     // } else{
    //     //     getLength(userGeometry, e.target.value)
    //     // }

    //     }
    //     //watch for changes in user geom, 
    //     //if user geom , selected value is not null amd other conditions
    //     // active tool then just replicate what's in the use change. 

    //     // updateUnits(); // todo keep 
        

    // }, [userGeometry, selectedValue, activeTool ]);



    const getPositiveNumber = (negativeNumber) => {
        const positiveNumber = (negativeNumber < 0) ? -negativeNumber : negativeNumber;
        return positiveNumber.toFixed(2)
    }
    
    const getArea = (polygon, selectedValue) => {
        const planarArea = geometryEngine.planarArea(polygon, selectedValue);
        const planarAreaPositive = getPositiveNumber(planarArea);
        setAreaMeasurement(planarAreaPositive) //todo add this back to props       
        return planarAreaPositive
    }
    
    const getLength= (line, selectedValue) =>{
        const planarLength = geometryEngine.planarLength(line, selectedValue);
        const planarLengthPositive = getPositiveNumber(planarLength)
        setLinearMeasurement(planarLengthPositive) //todo add this back to props 
        return planarLengthPositive
    }
    
    function switchType(geom) {
        switch (geom.type) {
            case "polygon":
                setActiveTool(geom.type);
                setSelectedValue('square-meters')  
                setUserGeometry(geom)              
                getArea(geom);
                // setUnitAbbrev()
                unitMeasurementAbbrev('square-meters')
                break;
            case "polyline":
                setActiveTool(geom.type);
                setSelectedValue('meters')
                setUserGeometry(geom)
                getLength(geom, selectedValue);
                unitMeasurementAbbrev('meters')
                break;
            default:
                console.log("No value found");
        }
    }    
    
    const createGraphicLayer = async () => {
        graphicsLayer.current = new GraphicsLayer({
            title:"measureGraphic"
        })
        mapView.map.add(graphicsLayer.current)
    }

    const removeAllGraphics = async () => {
        graphicsLayer.current.removeAll();
        setActiveTool(null)       
        setAreaMeasurement(null)
        setLinearMeasurement(null)
        setSelectedValue(null)
        setUserGeometry(null)
        setUnitAbbrev('m')
    }

    const completeAllGraphics = async () => {
        sketchVM.current.complete();
        // setActiveTool(null)       
        // setAreaMeasurement(null)
        // setLinearMeasurement(null)
        // setSelectedValue(null)
        // setUserGeometry(null)
    }

    const checkDropDownAbbrev = (menuValue, abbrevValue) =>{
        //levaing in this function for posterity but may not be needed. 
        // console.log('Inside Console Log', abbrevValue)
        // menuValue is key in object
        // abbrevValue is value  in object. WE want this key in order to set it in the drop down. 

        // measurementUnitOptions.some(option => option.value === value && option.key === key);
        // if (!abbrevValue){
            const menuValueOption = measurementUnitOptions.find(option => menuValue === option.key );
            const abbrevValueOption = measurementUnitOptions.find(option => abbrevValue === option.value );

            if (menuValueOption.key === abbrevValueOption.key ){
                setSelectedValue(abbrevValueOption.key)
            }
    
            console.log('menuValueOption',menuValueOption)
            console.log('abbrevValueOption',abbrevValueOption)

        // }


    }

    const startMeasuring = async () => {
        if(!graphicsLayer.current){ await createGraphicLayer() }
        await initializeSketchVM()
        // setActiveTool(tool)
        // TODO IT takes two times for this to become active

        sketchVM.current.create("polyline");
        sketchVM.current.on("create", (e) => {

            let geometry =  e.graphic.geometry;
            setUserGeometry(geometry)
            
            if (e.state === "active") {
                // if(unitAbbrev.props){
                //     checkDropDownAbbrev(selectedValue, unitAbbrev.props.children[0] )
                // }
                setUserGeometry(e.graphic.geometry)
                switchType(geometry);

            }
            if (e.state === "complete") {
                console.log('complete state')
                setUserGeometry(e.graphic.geometry) 
                convertPolyline2Polygon(geometry);
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
        });


        sketchVM.current.on("update", (e) => {
            const geometry =  e.graphics[0].geometry;
            if (e.state === "start") {
                switchType(geometry);
            }
            if (e.state === "complete") {
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
    const checkLatLongArray = (geom) => {
        let polygonRings = geom.paths[0]
        let firstLat =polygonRings[0][0]
        let firstLon = polygonRings[0][1]
        let lastLat = polygonRings[polygonRings.length -1][0]
        let lastLon = polygonRings[polygonRings.length -1][1]
        let results = (firstLat === lastLat && firstLon === lastLon)
        return results
    }


    const convertPolyline2Polygon = (geom) => {
        let isPolygon = checkLatLongArray(geom)
        if (isPolygon){
            const polygon = {
                type:"polygon",
                spatialReference: {
                    wkid: 102671,
                    latestWkid:3436
                },                
                rings:geom.paths[0]
            };
            const simplePolygonSymbol = {
                type: "simple-fill",
                color: theme.measureGraphics.polygon.color,
                outline: {
                    color: theme.measureGraphics.polygonOutline.color,
                    width: theme.measureGraphics.polygonOutline.width,
                },
            };       
            const polygonGraphic = new Graphic({
                geometry: polygon,
                symbol: simplePolygonSymbol
            });
            graphicsLayer.current.removeAll();
            graphicsLayer.current.add(polygonGraphic);
            switchType(polygonGraphic.geometry)
        }
    }

    const initializeSketchVM = async () =>{
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
                defaultCreateOptions: { hasZ: false },
                snappingOptions: { // autocasts to SnappingOptions()
                    distance:8,
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
                // divider={<Divider orientation="horizontal" flexItem />}
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
                    onClick={startMeasuring}>   
                        <CalciteIcon icon="measure-area"/>
                        <Typography variant="body1">
                            {translateText("Draw")}
                        </Typography>
                </Button>

                {/* { (activeTool) ? 

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
                    </Button> : '' }


                { (activeTool) ? 
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
                    </Button> : '' } */}
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

export default MeasureSketchWidget
