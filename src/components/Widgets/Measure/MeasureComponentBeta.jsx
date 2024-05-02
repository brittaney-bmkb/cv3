import { Box, MenuItem, Select, Typography } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import { ArcgisSketch } from "@arcgis/map-components-react"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

// this lifted from comparable property search and will needed to be updated for this widget
const MeasureComponentBeta = () => {
    
    const { mapView, map } = UseAppContext()
    const sketchRef = useRef(null)

    useEffect(() => {
        let graphicsLayer = new GraphicsLayer()

        // console.log()
        if (map){
            console.log("Map.ready", map)

            //event handler opn the sketch 
            map.add(graphicsLayer)
            console.log("checking map ", map)
        }
        if (sketchRef.current){

            sketchRef.current.view = mapView
            sketchRef.current.layer = graphicsLayer

            sketchRef.current.on("create", function(event){
                if(event.state =="complete"){
                    graphicsLayer.add(event.graphic)
                    console.log("Completed graphics", graphicsLayer)

                }
            })

        }


        


    }, [sketchRef, map])



    return (
        <ArcgisSketch onSketchCreate = {(event) => { 
            if(event.state =="complete"){
                console.log("Completed graphics", graphicsLayer)
            }
        } } creation-mode="continuous" layout="horizontal" ref = {sketchRef}>

        </ArcgisSketch>
            )      
}

export default MeasureComponentBeta