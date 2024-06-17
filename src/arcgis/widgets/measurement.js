
import { distance } from "@arcgis/core/geometry/geometryEngine";
import MeasurementVM from "@arcgis/core/widgets/Measurement/MeasurementViewModel.js";
import Measurement from "@arcgis/core/widgets/Measurement.js";
import { view } from "../webmap/webmap";


let measurement 

export async function initializeMeasureWidget(container){
    measurement = new Measurement({
        view:view,
        //container:container,
        activeTool: "distance",
        linearUnit:"feet",
        viewModel:{
            view:view,
            activeTool: "distance",
            linearUnit:"feet"
            //unitOptions:["square-us-feet","square-yards"],
            //areaUnit: "square-us-feet"
        }
    });
    // measurement.view = view
    // measurement.container = container 
    // measurement.activeTool = 'distance'
    //console.log('measure widget', measurement)  

    return measurement
}


export async function updateMeasureTool(activeTool){
    measurement.clear()
    measurement.activeTool = activeTool
}


export async function clearMeasure(){
    measurement.clear()
}