import { Box, MenuItem, Select, Typography } from "@mui/material"
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
//// 
//// 
//// 
//// 


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureComponentBeta = () => {
    
    const { mapView, map } = UseAppContext()
    const sketchRef = useRef(null)
    const graphicsLayer = useRef(null)

    const getPositiveNumber = (negativeNumber) => {
        //https://community.esri.com/t5/arcgis-javascript-maps-sdk-questions/getting-geodesic-area-ve/td-p/121084
        let positiveNumber = (negativeNumber < 0) ? -negativeNumber : negativeNumber;
        console.log('positiveNumber: ', positiveNumber, 'negative number:', negativeNumber, typeof positiveNumber)

        return positiveNumber.toFixed(2)
        
    }

    const getArea = (polygon) => {
        // TODO make this a state to update in REACT
        const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
        
        // console.log(typeof planarArea)
        // console.log('planarArea:', planarArea.toFixed(2))

        console.log('planarArea:', getPositiveNumber(planarArea))
    }

    const getLength= (line) =>{
        const planarLength = geometryEngine.planarLength(line, "kilometers");
        console.log('planarLength:', planarLength.toFixed(2))
    }

    function switchType(geom) {
        console.log('Checking geom values',geom)
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
        // console.log('sketchRef.current')
        // console.log(sketchRef.current)

        
        if (sketchRef.current){

            const convertPolyline2Polygon = (geom) =>{

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
                    console.log('Polygon Graphics')
                    const polygonGraphic = new Graphic({
                        geometry: polygon,
                        symbol: simplePolygonSymbol
                    });
        
                    console.log('graphicsLayer Before:', graphicsLayer)
        
                    // console.log('adding new graphic', polygonGraphic)
                    // // sketchRef.current.layer.add(polygonGraphic);
                    // graphicsLayer.add = polygonGraphic;
                    graphicsLayer.add(polygonGraphic);
                    // // map.layers.add(polygonGraphic)
        
                    console.log('graphicsLayer after:', graphicsLayer)

                    console.log('polygonGraphic: ', polygonGraphic.geometry.type)

        
                    switchType(polygonGraphic.geometry)
        
                
                    // console.log('See the polygon:', polygon)
                } else{
        
                }
        
                // console.log('Checking the convert geom',geom.paths[0])
        
            }

            // console.log('checking current')
            const sketch = new Sketch({
                view:mapView,
                layer: graphicsLayer, 
                availableCreateTools: ["polyline", "polygon"],
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
                    const geometry =  e.graphic.geometry;
                    // console.log("sketch on active",  e)
                    switchType(geometry);
                }
                if (e.state === "complete") {
                    const geometry =  e.graphic.geometry;
                    console.log("sketch on complete", e)
                    //TODO turns this back on and see what happens. 
                    // convertPolyline2Polygon
                    convertPolyline2Polygon(geometry);
                    // switchType(geometry);
                    
                    // graphicsLayer.remove(graphicsLayer.graphics.getItemAt(0));
                    // measurements.innerHTML = null;
                }
                if (
                    e.toolEventInfo &&
                    (e.toolEventInfo.type === "scale-stop" ||
                    e.toolEventInfo.type === "reshape-stop" ||
                    e.toolEventInfo.type === "move-stop")
                    
                ) {
                    console.log("sketch on rescale", e.graphics[0].geometry)
                    switchType(geometry);
                }
            }); 

            sketch.on("update", (e) => {
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
                    graphicsLayer.remove(graphicsLayer.graphics.getItemAt(0));
                    
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

    }, [sketchRef, map, mapView, graphicsLayer])



    return (
        <div id = "measure-widget-sketch"  style = {{width:300, height:600}} ref={sketchRef} > </div>
    )      
}

export default MeasureComponentBeta