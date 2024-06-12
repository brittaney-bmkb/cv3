
import { Box, MenuItem, Select, Typography, Stack, TextField, Divider, InputLabel , FormControl, NativeSelect   } from "@mui/material"
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


const MeasureSketchWidget = () => {
    
    const { mapView, map, translateText  } = UseAppContext()
    // const sketchDivDOM = useRef(null)
    const graphicsLayer = useRef(null)
    let sketchVM = useRef(null)
    
    const [activeTool, setActiveTool] = useState(null)
    let [areaMeasurement, setAreaMeasurement] = useState(null)
    let  [linearMeasurement, setLinearMeasurement] = useState(null)
    const [selectedValue, setSelectedValue ] = useState(null);
    let [userGeometry, setUserGeometry ] = useState(null);
    let [unitAbbrev, setUnitAbbrev ] = useState(null)

    const handleChange = (e) => {
        setSelectedValue(e.target.value)
        unitMeasurementAbbrev(e.target.value)
        
        if (activeTool==='polygon'){
            getArea(userGeometry, e.target.value)
        } else{
            getLength(userGeometry, e.target.value)
        }
    }

    const unitMeasurementAbbrev = (stringToCheck) => {
        const linearUnitOptions = [
            {key: 'feet', value: 'ft' },
            {key: 'yards', value: 'yd'},
            {key: 'miles', value: 'mi' },
            {key: 'meters', value: 'm' },
            {key: 'kilometers', value: 'kms' },
            { key: 'acres', value: 'ac' },
            { key: 'square-feet', value: 'ft', superscript: <sup>2</sup> },
            { key: 'square-meters', value: 'm', superscript: <sup>2</sup> },
            { key: 'square-yards', value: 'yd', superscript: <sup>2</sup> },
            { key: 'square-kilometers', value: 'km', superscript: <sup>2</sup> },
            { key: 'square-miles', value: 'mi', superscript: <sup>2</sup> }            
        ]
        const matchedOption = linearUnitOptions.find(option => 
            stringToCheck === option.key
        );

        if (matchedOption) {
            setUnitAbbrev(
                <span>
                    {matchedOption.value} {matchedOption.superscript ? matchedOption.superscript : ''}
                </span>
            );
        } else {
            console.log("String does not contain any linear units.");
        }
        //https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#AreaUnits
        // "acres"|"ares"|"hectares"|"square-feet"|"square-meters"|"square-yards"|"square-kilometers"|"square-miles"

    }

    const DropDownUnitMeasurement = () => {
        console.log('inside dropdown menu')
        
        const linearUnitOptions = [
            {value: 'feet', label: 'feet' },
            {value: 'yards', label: 'yards' },
            {value: 'miles', label: 'miles' },
            {value: 'meters', label: 'meters' },
            {value: 'kilometers', label: 'kilometers' }
        ]

        //https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-geometryEngine.html#AreaUnits
        // "acres"|"ares"|"hectares"|"square-feet"|"square-meters"|"square-yards"|"square-kilometers"|"square-miles"
        const areaUnitOptions = [
            {value: 'acres', label: 'acres' },
            {value: 'square-feet', label: 'square-feet' },
            {value: 'square-meters', label: 'square-meters' },
            {value: 'square-yards', label: 'square-yards' },
            {value: 'square-kilometers', label: 'square-kilometers' },
            {value: 'square-miles', label: 'square-miles' }
        ]

        return(            
            activeTool === null ? (null) : (
                <Stack direction="row" spacing={2}>
                    <Box component="section" >
                        {activeTool == "polyline" ? 
                            <span> <b>Length:</b> {linearMeasurement} <em>{unitAbbrev}</em> </span> : 
                            <span> <b>Area:</b> {areaMeasurement} <em>{unitAbbrev}</em>  </span>  }   
                    </Box>
                    <FormControl size='small'>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Unit of Measurement
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
        console.log("the current selectedValue", selectedValue)
        // TODO make this a state to update in REACT
        const planarArea = geometryEngine.planarArea(polygon, selectedValue);
        const planarAreaPositive = getPositiveNumber(planarArea);
        setAreaMeasurement(planarAreaPositive) //todo add this back to props 
        console.log('updating planarAreaPositive', planarAreaPositive)
        console.log('updating area measurement ', areaMeasurement)        
        console.log('updating polygon measurement ', polygon)        
        return planarAreaPositive
    }
    
    const getLength= (line, selectedValue) =>{
        console.log("the current selectedValue", selectedValue)
        const planarLength = geometryEngine.planarLength(line, selectedValue);
        const planarLengthPositive = getPositiveNumber(planarLength)
        setLinearMeasurement(planarLengthPositive) //todo add this back to props 
        // console.log('planarLength:', planarLength.toFixed(2))
        return planarLengthPositive
    }
    
    function switchType(geom) {
        switch (geom.type) {
            case "polygon":
                setActiveTool(geom.type);
                setSelectedValue('square-meters')  
                setUserGeometry(geom)              
                getArea(geom);
                break;
            case "polyline":
                setActiveTool(geom.type);
                setSelectedValue('meters')
                setUserGeometry(geom)
                getLength(geom, selectedValue);
                break;
            default:
                console.log("No value found");
        }
    }    
    
    const createGraphicLayer = async () => {
        graphicsLayer.current = new GraphicsLayer()
        mapView.map.add(graphicsLayer.current)
    }

    const removeAllGraphics = async () => {
        graphicsLayer.current.removeAll();
        setActiveTool(null)       
        setAreaMeasurement(null)
        setLinearMeasurement(null)
        setSelectedValue(null)
        setUserGeometry(null)
        setUnitAbbrev(null)
    }

    const completeAllGraphics = async () => {
        sketchVM.current.complete();
        // setActiveTool(null)       
        // setAreaMeasurement(null)
        // setLinearMeasurement(null)
        // setSelectedValue(null)
        // setUserGeometry(null)
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
                setUserGeometry(e.graphic.geometry)
                switchType(geometry);
            }
            if (e.state === "complete") {
                setUserGeometry(e.graphic.geometry) 
                convertPolyline2Polygon(geometry);
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
                color: '#ffb6c1',
                outline: {
                    color: [245, 0, 127, 0.05],
                    width: 5,
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
                    color: "#219ebc",
                    width: 6
                },                
                defaultCreateOptions: { hasZ: false },
                snappingOptions: { // autocasts to SnappingOptions()
                    distance:8,
                    enabled: true, // global snapping is turned on
                    featureEnabled: true,
                    // assigns a collection of FeatureSnappingLayerSource() and enables feature snapping on this layer
                    featureSources: [{ layer: graphicsLayer.current, enabled: true }]
                }        
            }) 
        }
    }


    return (
        <Box display="flex" flexDirection="column"  rowGap={1}>

            <Divider />
            <Box display="flex" flexDirection="column" gap={1} sx={{justifyContent:"center"}}>
                <StyledButtonFilledPrimary
                    color="primary"
                    startIcon={<SquareFootIcon/>}
                    text={translateText('Measure')}
                    textVarient={"body2"}
                    // active={activeTool === "distance" ? true: false}
                    onClick={startMeasuring}
                /> 
                <StyledButtonFilledPrimary
                    color="primary"
                    startIcon={<DeleteSweepIcon/>}
                    text={translateText('Remove')}
                    textVarient={"body2"}
                    // active={activeTool === "distance" ? true: false}
                    onClick={removeAllGraphics}
                />                 

                <StyledButtonFilledPrimary
                    // variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<CheckCircleOutlineIcon/>}
                    text={translateText('Done')}
                    textVarient={"body2"}
                    // active={activeTool === "area" ? true: false}
                    onClick={completeAllGraphics}
                /> 

            </Box>
            <Divider />

            <DropDownUnitMeasurement/>
            {/* <div id = "measure-widget-sketch"  style = {{width:300, height:300}} ref={sketchDivDOM} > </div> */}

        </Box>        


        
    )      
}

export default MeasureSketchWidget