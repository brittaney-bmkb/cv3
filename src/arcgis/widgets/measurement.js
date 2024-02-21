
import { distance } from "@arcgis/core/geometry/geometryEngine";
import MeasurementVM from "@arcgis/core/widgets/Measurement/MeasurementViewModel.js";
import Measurement from "@arcgis/core/widgets/Measurement.js";
import { view } from "../webmap/webmap";


export async function initializeMeasureWidget(){

    const measurement = new Measurement();
    console.log('MeasurementVM: ', measurement )
    measurement.view = view
    //measurement.container = container 
    measurement.activeTool = 'distance'
    console.log('measure widget', measurement)  
    // let measurement = new MeasurementVM({
    //     viewModel: {
    //         view: view,
    //         container: container,
    //         activeTool: "direct-line"
    //       }
    //     });
    //   console.log("Active ViewModel: ", measurement.viewModel.activeViewModel);

    // const measurement = new MeasurementVM();

    // console.log('measure widget view', view)
    // measurement.view = view
    // measurement.container = container 
    // measurement.activeTool = 'distance'
    // console.log('measure widget', measurement)    
    // console.log("Active ViewModel: ", measurement.viewModel.activeViewModel);
    // Add the component to the view using the DefaultUI's `add()` method.
    // view.ui.add(document.getElementById('MEASURECONTAINER'), "top-right"); // this breaks something

    return measurement

    // Create new instance of the Measurement widget
    // https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Measurement-MeasurementViewModel.html
    
    // const measurement = await MeasurementVM();
    // console.log('measure widget view', view)
    // measurement.view = view
    // measurement.container = container 
    // measurement.activeTool = 'distance'
    // console.log('measure widget', measurement)

    // return view


    


}
