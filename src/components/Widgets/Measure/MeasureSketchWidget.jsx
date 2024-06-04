
import { Box, MenuItem, Select, Typography, Stack, TextField } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import { ArcgisSketch } from "@arcgis/map-components-react"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";

import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';

import Sketch from "@arcgis/core/widgets/Sketch.js";
import StyledButtonFilledPrimary from "../../Button/Button";


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


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureSketchWidget = () => {
    
    const { mapView, map, translateText  } = UseAppContext()
    // const { translateText, setMapPrintProps } = UseAppContext()
    const sketchDivDOM = useRef(null)
    const graphicsLayer = useRef(null)
    let sketchVM = useRef(null)
    
    // let graphicsLayer = new GraphicsLayer()
    const [activeTool, setActiveTool] = useState(null)
    let [areaMeasurement, setAreaMeasurement] = useState("")

    const getPositiveNumber = (negativeNumber) => {
        const positiveNumber = (negativeNumber < 0) ? -negativeNumber : negativeNumber;
        return positiveNumber.toFixed(2)
    }
    
    let getArea = (polygon) => {
        // TODO make this a state to update in REACT
        const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
        const planarAreaPositive = getPositiveNumber(planarArea);
        console.log('updating planarAreaPositive before ', planarAreaPositive)
        console.log('updating area measurement before', areaMeasurement)            
        setAreaMeasurement(String(planarAreaPositive)) //todo add this back to props 
        console.log('updating planarAreaPositive', planarAreaPositive)
        console.log('updating area measurement ', areaMeasurement)        
        return planarAreaPositive
        
    }
    
    const getLength= (line) =>{
        const planarLength = geometryEngine.planarLength(line, "kilometers");
        const planarLengthPositive = getPositiveNumber(planarLength)
        console.log('planarLength:', planarLength.toFixed(2))
        return planarLengthPositive
    }
    
    function switchType(geom) {
        switch (geom.type) {
            case "polygon":
                getArea(geom);
                break;
            case "polyline":
                getLength(geom);
                break;
            default:
                console.log("No value found");
        }
    }    

    const startMeasuring = async () => {
        await initializeSketchVM()
        
        // TODO IT takes two times for this to become active
        sketchVM.current.create("polyline");

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

            graphicsLayer.current.add(polygonGraphic);
            switchType(polygonGraphic.geometry)
        } 
    }



    const initializeSketchVM = async () =>{
        if (map){
            if (!graphicsLayer.current){
                graphicsLayer.current = new GraphicsLayer()
            }
            map.add(graphicsLayer.current)
            console.log("checking map ", map)
        }
    
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
                    enabled: true, // global snapping is turned on
                    // assigns a collection of FeatureSnappingLayerSource() and enables feature snapping on this layer
                    featureSources: [{ layer: graphicsLayer.current, enabled: true }]
                }        
            })        
        }
        
    }
    
    useEffect( () => {
        console.log("use effect")
        let sketchVMListener = () =>{
            console.log("Listener")
            console.log("Listener sketchVM.current: ",sketchVM.current)
            if(sketchVM.current){
                console.log('If statement current')
                sketchVM.current.on("create", (e) => {
                    const geometry =  e.graphic.geometry;
                    
                    if (e.state === "active") {
                        console.log('active on create')
                        const geometry =  e.graphic.geometry;
                        // console.log("sketch on active",  e)
                        switchType(geometry);
                    }
                    if (e.state === "complete") {
                        console.log('complete on create')
                        const geometry =  e.graphic.geometry;
                        graphicsLayer.current.removeAll();
                        //todo expand on comments for the logic 
                        convertPolyline2Polygon(geometry);
                        
                    }
                    if (
                        e.toolEventInfo &&
                        (e.toolEventInfo.type === "scale-stop" ||
                        e.toolEventInfo.type === "reshape-stop" ||
                        e.toolEventInfo.type === "move-stop")
                        
                    ) {
                        console.log('if statements on create')
                        switchType(geometry);
                    }
                }); 
            }            
            // if(sketchVM.current){
            //     console.log('If statement current')
            //     sketchVM.current.on("create", (e) => {
            //         const geometry =  e.graphic.geometry;
                    
            //         if (e.state === "active") {
            //             console.log('active on create')
            //             const geometry =  e.graphic.geometry;
            //             // console.log("sketch on active",  e)
            //             switchType(geometry);
            //         }
            //         if (e.state === "complete") {
            //             console.log('complete on create')
            //             const geometry =  e.graphic.geometry;
            //             graphicsLayer.current.removeAll();
            //             //todo expand on comments for the logic 
            //             convertPolyline2Polygon(geometry);
                        
            //         }
            //         if (
            //             e.toolEventInfo &&
            //             (e.toolEventInfo.type === "scale-stop" ||
            //             e.toolEventInfo.type === "reshape-stop" ||
            //             e.toolEventInfo.type === "move-stop")
                        
            //         ) {
            //             console.log('if statements on create')
            //             switchType(geometry);
            //         }
            //     }); 
            // }
        }
        sketchVMListener()
    }, [sketchVM]
    )




    return (
        <Box display="flex" flexDirection="column"  rowGap={1}>
            <Typography variant="h5" sx={{display:"flex", flexGrow:1, pt:1, pb:1}}>{`${translateText("Measure settings")}:`}</Typography>
            <Box display="flex" flexDirection="row" gap={1} sx={{justifyContent:"center"}}>
                <StyledButtonFilledPrimary
                    color="primary"
                    startIcon={<StraightenOutlinedIcon/>}
                    text={translateText('Start Measuring')}
                    textVarient={"body2"}
                    // active={activeTool === "distance" ? true: false}
                    onClick={startMeasuring}
                /> 

                {/* <StyledButtonFilledPrimary
                    variant={activeTool === 'area' ? 'contained' : 'outlined'}
                    color="primary"
                    startIcon={<SquareFootOutlinedIcon/>}
                    text={translateText('Area')}
                    textVarient={"body2"}
                    active={activeTool === "area" ? true: false}
                    onClick={() => startMeasuring("area")}
                />  */}

            </Box>
            {/* <div id = "measure-widget-sketch"  style = {{width:300, height:300}} ref={sketchDivDOM} > </div> */}

        </Box>        


        
    )      
}

export default MeasureSketchWidget