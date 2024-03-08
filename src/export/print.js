import * as print from "@arcgis/core/rest/print.js";
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";
import { view } from "../arcgis/webmap/webmap";
import { config } from "../data/config";


// function printResult(result) {
//     console.log(result.url);
//     //window.open(result.url);
//     return result.url
//   }

  function printError(err) {
    console.log("Something broke: ", err);
  }

export const printMap = async (mapLayout, mapFormat, mapTitle) => {

    console.log("map print props: ", mapLayout, mapFormat, mapTitle)

    const template = new PrintTemplate({
        format: mapFormat,
        exportOptions: {
            dpi: 300
        },
        layout: mapLayout,
        layoutOptions: {
            titleText: mapTitle,
        }
    })

    const params = new PrintParameters({
        view: view,
        template: template
    })

    try {
        let result = await print.execute(config.print_service_url, params)
        return result.url
    }
    catch (e) {
        printError()
    } 
}



