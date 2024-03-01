
import { distance } from "@arcgis/core/geometry/geometryEngine";
import MeasurementVM from "@arcgis/core/widgets/Measurement/MeasurementViewModel.js";
import Measurement from "@arcgis/core/widgets/Measurement.js";
import { view } from "../webmap/webmap";


let measurement 

export async function initializeMeasureWidget(container){
    measurement = new Measurement({
        view:view,
        container:container,
        activeTool: "distance"
    });
    // measurement.view = view
    // measurement.container = container 
    // measurement.activeTool = 'distance'
    console.log('measure widget', measurement)  

    return measurement.visible
}


export async function updateMeasureTool(activeTool){
    measurement.clear()
    measurement.activeTool = activeTool
}


export async function clearMeasure(){
    measurement.clear()
}