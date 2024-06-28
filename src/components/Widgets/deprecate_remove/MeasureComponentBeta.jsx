import { Box, MenuItem, Select, Typography, Stack, TextField } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import { ArcgisSketch } from "@arcgis/map-components-react"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import Sketch from "@arcgis/core/widgets/Sketch.js";


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



export const linearUnitOptions = [
    "feet", "yards", "miles", "meters", "kilometers"
]

const areaUnitOptions = [
    "square-inches", "square-feet", "square-yards", "square-miles", "square-meters", "square-kilometers", "acres"
]

// this lifted from comparable property search and will needed to be updated for this widget
const MeasureComponentBeta = () => {
    
    const { mapView, map,translateText  } = UseAppContext()
    // const { translateText, setMapPrintProps } = UseAppContext()
    const sketchRef = useRef(null)
    const graphicsLayer = useRef(null)

    const [areaUnit, setAreaUnit] = useState(areaUnitOptions[0])
    const [linearUnit, setLinearUnit] = useState(linearUnitOptions[0])

    const [areaMeasurement, setAreaMeasurement] = useState(0)
    const [linearMeasurement, setLinearMeasurement] = useState(0)


    const getPositiveNumber = (negativeNumber) => {
        //https://community.esri.com/t5/arcgis-javascript-maps-sdk-questions/getting-geodesic-area-ve/td-p/121084
        const positiveNumber = (negativeNumber < 0) ? -negativeNumber : negativeNumber;
        // console.log('positiveNumber: ', positiveNumber, 'negative number:', negativeNumber, typeof positiveNumber)

        return positiveNumber.toFixed(2)
        
    }

    // useEffect(() => {
    // }, []);

    const getArea = (polygon) => {
        // TODO make this a state to update in REACT
        const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
        const planarAreaPositive = getPositiveNumber(planarArea);
        setAreaMeasurement(planarAreaPositive)
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
        // console.log('Checking geom values',geom)
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

    const checkLatLongArray = (geom) => {
        let polygonRings = geom.paths[0]
        let firstLat =polygonRings[0][0]
        let firstLon = polygonRings[0][1]
        let lastLat = polygonRings[polygonRings.length -1][0]
        let lastLon = polygonRings[polygonRings.length -1][1]
        let results = (firstLat === lastLat && firstLon === lastLon)
        return results
    }


    useEffect(() => {

        let graphicsLayer = new GraphicsLayer()
        if (map){
            //event handler opn the sketch 
            map.add(graphicsLayer)
            console.log("checking map ", map)
        }

        if (sketchRef.current){

            const convertPolyline2Polygon = (geom) => {
                let isPolygon = checkLatLongArray(geom)
                console.log('Checking if both geoms are positive: ',isPolygon);
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

                    graphicsLayer.add(polygonGraphic);
                    switchType(polygonGraphic.geometry)
                } 
            }

            // TODO start with replace SketchViewModel 
            const sketch = new Sketch({
                view:mapView,
                layer: graphicsLayer, 
                // availableCreateTools: ["polyline", "polygon"],
                availableCreateTools: ["polyline"],
                creationMode:"continuous",
                container: sketchRef.current,
                visibleElements: {
                    createTools: {
                        point: false,
                        circle: false
                    },
                    selectionTools:{
                        "lasso-selection": false,
                        "rectangle-selection":false,
                    },
                    settingsMenu: true,
                    undoRedoMenu: true
                },
                snappingOptions: { // autocasts to SnappingOptions()
                    enabled: true, // global snapping is turned on
                    // assigns a collection of FeatureSnappingLayerSource() and enables feature snapping on this layer
                    featureSources: [{ layer: graphicsLayer, enabled: true }]
                }                
            })

            sketch.on("create", (e) => {
                const geometry =  e.graphic.geometry;
                
                if (e.state === "active") {
                    // console.log('active on create')
                    const geometry =  e.graphic.geometry;
                    // console.log("sketch on active",  e)
                    switchType(geometry);
                }
                if (e.state === "complete") {
                    // console.log('complete on create')
                    const geometry =  e.graphic.geometry;
                    graphicsLayer.removeAll();
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

            // sketch.on("update", (e) => {
            //     // console.log("sketch on update", e.graphics[0].geometry)
                
            //     // const geometry = e.graphic.geometry;
            //     const geometry =  e.graphics[0].geometry;
            //     if (e.state === "start") {
            //         // console.log("sketch on start",  geometry)
            //         switchType(geometry);
            //     }

            //     if (e.state === "complete") {
            //         // console.log("sketch on complete", e)
            //         // switchType(geometry);
            //         graphicsLayer.remove(graphicsLayer.graphics.getItemAt(0));
                    
            //     //   measurements.innerHTML = null;
            //     }
            //     if (
            //         e.toolEventInfo &&
            //         (e.toolEventInfo.type === "scale-stop" ||
            //         e.toolEventInfo.type === "reshape-stop" ||
            //         e.toolEventInfo.type === "move-stop")
                    
            //     ) {
            //         // console.log("sketch on rescale", e.graphics[0].geometry)
            //         switchType(geometry);
            //     }
            // });            
        }

    }, [sketchRef, map, mapView, graphicsLayer, areaMeasurement])

    return (
        <Box display="flex" flexDirection="column"  rowGap={1}>
            <Typography variant="h5" sx={{display:"flex", flexGrow:1, pt:1, pb:1}}>{`${translateText("Measure settings")}:`}</Typography>
            <div id = "measure-widget-sketch"  style = {{width:300, height:300}} ref={sketchRef} > </div>
            <Box display="flex" flexDirection="column" pl={1} rowGap={2}>
            <Stack direction="row" sx={{alignItems:"center"}}  spacing={2}>
                <Typography variant="body2" sx={{display:"flex", flexGrow:1}}>{translateText("Unit of Measurement")}</Typography>
                {/* <Select
                value={layoutValue}
                onChange={handleLayoutOptionChange}
                sx={{width: 'auto', height:40}}
                >
                    {formatLayoutOptions}
                </Select> */}
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}  spacing={2}>
                <Typography variant="body2" sx={{display:"flex", flexGrow:1}}>{translateText("Output format")}</Typography>
                {/* <Select
                value={formatValue}
                onChange={handleFormatOptionChange}
                sx={{width: 'auto', height:40}}
                >
                    {formatDropdownOptions}
                </Select> */}
            </Stack>             
            {/* Choose Formats */}
            {/* <Stack direction="row" sx={{alignItems:"center"}} spacing={2}>
                <Typography variant="body2" sx={{display:"flex", flexGrow:1}}>{translateText("Map title")}</Typography>
                <TextField 
                    id="print-title" 
                    //label="Title" 
                    variant="outlined" 
                    size="small"
                    
                    placeholder="Title"
                    onChange={handleInput}
                    sx={{width: 'auto', height:40}}
                />
            </Stack> 

 */}
            </Box>
        </Box>        


        
    )      
}

export default MeasureComponentBeta