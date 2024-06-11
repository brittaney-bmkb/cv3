
import { Box, MenuItem, Select, Typography, Stack, TextField, Divider, InputLabel , FormControl, NativeSelect  } from "@mui/material"
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

// export const linearUnitOptions = [
//     "feet", "yards", "miles", "meters", "kilometers"
// ]

// const areaUnitOptions = [
//     "square-inches", "square-feet", "square-yards", "square-miles", "square-meters", "square-kilometers", "acres"
// ]
// this lifted from comparable property search and will needed to be updated for this widget

//TODO work on menu change
const MeasureSketchWidget = () => {
    
    const { mapView, map, translateText  } = UseAppContext()
    // const sketchDivDOM = useRef(null)
    const graphicsLayer = useRef(null)
    let sketchVM = useRef(null)
    
    // let graphicsLayer = new GraphicsLayer()
    const [activeTool, setActiveTool] = useState(null)
    let [areaMeasurement, setAreaMeasurement] = useState(null)
    let  [linearMeasurement, setLinearMeasurement] = useState(null)
    const [selectedValue, setSelectedValue ] = useState(null);

    let [userGeometry, setUserGeometry ] = useState(null);

    const handleChange = (e) => {
        console.log('handle change event', e)
        setSelectedValue(e.target.value)
        
        if (activeTool==='polygon'){
            getArea(userGeometry, e.target.value)
        } else{
            getLength(userGeometry, e.target.value)

        }


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

        const areaUnitOptions = [
            {value: 'square-feet', label: 'square-feet' },
            {value: 'square-yards', label: 'square-yards' },
            {value: 'square-miles', label: 'square-miles' },
            {value: 'square-meters', label: 'square-meters' },
            {value: 'square-kilometers', label: 'square-kilometers' },
            {value: 'acres', label: 'acres' }
        ]


        return(            
            activeTool === null ? (null) : (
                <FormControl fullWidth>
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
                        // onChange={(e) => setSelectedValue(e.target.value)}
                        onChange={handleChange}
                    >
                        {(e) => console.log('setting selected value', e)}
                        {console.log('selectedValue', selectedValue)}
                        
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
        // console.log("the current selectedValue", selectedValue)
        // TODO make this a state to update in REACT
        const planarArea = geometryEngine.planarArea(polygon, selectedValue);
        const planarAreaPositive = getPositiveNumber(planarArea);
        setAreaMeasurement(planarAreaPositive) //todo add this back to props 
        // console.log('updating planarAreaPositive', planarAreaPositive)
        // console.log('updating area measurement ', planarAreaPositive)        
        return planarAreaPositive
    }
    
    const getLength= (line, selectedValue) =>{
        // console.log("the current selectedValue", selectedValue)
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
                // setSelectedValue('square-meters')                
                getArea(geom);
                break;
            case "polyline":
                setActiveTool(geom.type);
                // setSelectedValue('meters')
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
    }

    const startMeasuring = async () => {
        if(!graphicsLayer.current){
            await createGraphicLayer()
        }
        await initializeSketchVM()
        // setActiveTool(tool)
        // TODO IT takes two times for this to become active
        sketchVM.current.create("polyline");

        sketchVM.current.on("create", (e) => {
        let geometry =  e.graphic.geometry;
        setUserGeometry(geometry)
        
        console.log('regular geom',geometry)
        console.log('user geom',userGeometry)
        
        if (e.state === "active") {
            console.log('active on create',geometry)
            // const geometry =  e.graphic.geometry;
            // console.log("sketch on active",  e)
            setUserGeometry(e.graphic.geometry)
            switchType(geometry);
        }
        if (e.state === "complete") {
            console.log('complete on create', geometry)
            setUserGeometry(e.graphic.geometry)
            // const geometry =  e.graphic.geometry;
            // graphicsLayer.current.removeAll();
            //todo expand on comments for the logic 
            convertPolyline2Polygon(geometry);
            
        }
        if (
            e.toolEventInfo &&
            (e.toolEventInfo.type === "scale-stop" ||
            e.toolEventInfo.type === "reshape-stop" ||
            e.toolEventInfo.type === "move-stop")
            
        ) {
            // console.log('if statements on create')
            switchType(geometry);
        }
        });


        sketchVM.current.on("update", (e) => {
            // console.log("sketch on update", e.graphics[0].geometry)
            // const geometry = e.graphic.geometry;
            const geometry =  e.graphics[0].geometry;
            if (e.state === "start") {
                // console.log("sketch on start",  geometry)
                switchType(geometry);
            }

            if (e.state === "complete") {
                // console.log("sketch on complete", e)
                // switchType(geometry);
                graphicsLayer.current.remove(graphicsLayer.current.graphics.getItemAt(0));
            //   measurements.innerHTML = null;
            }
            if (
                e.toolEventInfo &&
                (e.toolEventInfo.type === "scale-stop" ||
                e.toolEventInfo.type === "reshape-stop" ||
                e.toolEventInfo.type === "move-stop")
                
            ) {
                // console.log("sketch on rescale", e.graphics[0].geometry)
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
        // console.log('Checking if both geoms are positive: ',isPolygon);
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
                    color: '#E54385',
                    width: 3,
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

            console.log("Setting sketchVM: ", sketchVM)

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
                    enabled: true, // global snapping is turned on
                    // assigns a collection of FeatureSnappingLayerSource() and enables feature snapping on this layer
                    featureSources: [{ layer: graphicsLayer.current, enabled: true }]
                }        
            }) 
        } 
        
    }


    return (
        <Box display="flex" flexDirection="column"  rowGap={1}>
            {activeTool == null ? null :
                <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                    {activeTool == "polyline" ? `Length: ${linearMeasurement}` : `Area:  ${areaMeasurement}` }    
                </Box>
            }

            <Typography variant="h5" sx={{display:"flex", flexGrow:1, pt:1, pb:1}}>{`${translateText("Measure settings")}:`}</Typography>

            <DropDownUnitMeasurement/>

            <Box display="flex" flexDirection="column" gap={1} sx={{justifyContent:"center"}}>
                <StyledButtonFilledPrimary
                    color="primary"
                    startIcon={<SquareFootIcon/>}
                    text={translateText('Start Measuring')}
                    textVarient={"body2"}
                    // active={activeTool === "distance" ? true: false}
                    onClick={startMeasuring}
                /> 
                <StyledButtonFilledPrimary
                    color="primary"
                    startIcon={<DeleteSweepIcon/>}
                    text={translateText('Remove all')}
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
                    // onClick={() => startMeasuring("area")}
                /> 

            </Box>
            {/* <div id = "measure-widget-sketch"  style = {{width:300, height:300}} ref={sketchDivDOM} > </div> */}

        </Box>        


        
    )      
}

export default MeasureSketchWidget