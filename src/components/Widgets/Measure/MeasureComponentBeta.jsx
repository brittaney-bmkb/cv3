import { Box, MenuItem, Select, Typography } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import { ArcgisSketch } from "@arcgis/map-components-react"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import Sketch from "@arcgis/core/widgets/Sketch.js";


// https://developers.arcgis.com/javascript/latest/tutorials/find-length-and-area/



// this lifted from comparable property search and will needed to be updated for this widget
const MeasureComponentBeta = () => {
    
    const { mapView, map } = UseAppContext()
    const sketchRef = useRef(null)


    // const getLength = (line) =>{
    //     const geodesicLength = geometryEngine.geodesicLength(line, "kilometers");
    //     const planarLength = geometryEngine.planarLength(line, "kilometers");

    //     console.log('geodesicLength: ', geodesicLength);
    //     console.log('planarLength: ', planarLength);
    //     console.log();

    //     // return(geodesicLength, planarLength)
    // }

    function getArea(polygon) {
        // const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
        const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");
        // console.log('geodesicArea:', geodesicArea.toFixed(2), 'planarArea:', planarArea.toFixed(2))
        console.log('planarArea:', planarArea.toFixed(2))
        // return geodesicArea, planarArea

    }

    function getLength(line) {
        // const geodesicLength = geometryEngine.geodesicLength(line, "kilometers");
        const planarLength = geometryEngine.planarLength(line, "kilometers");
        // console.log('geodesicLength:', geodesicLength.toFixed(2), 'planarLength:', planarLength.toFixed(2))
        console.log('planarLength:', planarLength.toFixed(2))
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

    useEffect(() => {
        let graphicsLayer = new GraphicsLayer()


        if (map){
            //event handler opn the sketch 
            map.add(graphicsLayer)
            console.log("checking map ", map)
        }
        console.log('sketchRef.current')
        console.log(sketchRef.current)
        if (sketchRef.current){
            console.log('checking current')
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
            // console.log('Checking initilization of sketch', sketchRef.current)
            // sketch.on("create", (event) => {
            //     console.log("new sketch event", event)
            //     // console.log('checking on sketch propperties');
            //     // console.log(event.graphic.geometry.spatialReference.metersPerUnit)
            //     console.log('checking on sketch propperties');
            //     console.log(event.graphic.geometry)
            // }
            // )

            sketch.on("update", (e) => {
                // console.log("sketch on update", e.graphics[0].geometry)
                
                // const geometry = e.graphic.geometry;
                const geometry =  e.graphics[0].geometry;
                if (e.state === "start") {
                    console.log("sketch on start",  geometry)
                    switchType(geometry);
                }

                if (e.state === "complete") {
                    console.log("sketch on complete", e)
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
                    switchType(geometry);
                }
            });            
                
        }

    }, [sketchRef, map, mapView])



    return (
        
        <div id = "sketchy"  style = {{width:300, height:600}} ref={sketchRef} >

        </div>
    )      
}

export default MeasureComponentBeta