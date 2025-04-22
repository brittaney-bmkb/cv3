import Portal from "@arcgis/core/portal/Portal.js";
import { CalciteBlock, CalciteButton, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-print";
import { config } from "../../data/config";
import { useEffect, useRef } from "react";

import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";
import esriConfig from "@arcgis/core/config";
import * as print from "@arcgis/core/rest/print.js";
import { findTargetLayer } from "../Map/Map";




//TODO ADD PRINT TEMPLATES
const Print = () => {

    const { 
        printPanelClosed, 
        setPrintPanel, 
        translateText, 
        arcgisMapRef,
        mapView,
        primaryResultFeature
    } = UseAppContext()
    
    const printRef = useRef(null)
    const printTemplate = useRef(null)
    const printParams = useRef(null)

    const handleClosePrintPanel = () => {

        setPrintPanel(true)
    }

    let portal = new Portal({
        url: config.portal// First instance
      });


    useEffect(() => {

        if(printRef.current && printPanelClosed){
            if(printRef.current.showPrintAreaEnabled){
                printRef.current.showPrintAreaEnabled = false
            }
        }
    },  [arcgisMapRef, printRef, printPanelClosed])


    useEffect(() => {

        



    },  [arcgisMapRef.current, mapView, printParams.current])


    const createParcelDefinitionExpression = async (feature) => {

        const pins14 = feature.map((feature) => feature.attributes[config.target_layer_unique_id])

        const expression =`${config.target_layer_unique_id} IN ('${pins14.join("','")}')`

        return expression
    }

    const preparePrintParams = async () => {

        if(!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map
        const view = arcgisMapRef.current.view

        if(!view) return;
        if(!map) return;

        const targetLayer = findTargetLayer(map)

        if(!targetLayer) return;
        const sourceId = targetLayer.id

        let template = new PrintTemplate({
            layout: "MAP_ONLY",
            report: "CookViewer Report",
            format: "PDF",
            reportOptions: {
                "reportSectionOverrides": {
                    "Parcels Current": {
                        "name": "Parcels",
                        "sourceId": sourceId
                    }}}
        })
        
        const params = new PrintParameters({
            template: template,
            view: view
        })

        return [params, sourceId]
    }

    const executePrint = async (url, params) => {
        const printResult = print.execute(url, params)

        return printResult
    }

    const modifyPrintRequest = async () => {
        
        const  [ param, sourceId ] = await preparePrintParams()

        console.log("print clicked")
        const expression = await createParcelDefinitionExpression(primaryResultFeature)

        esriConfig.request.interceptors.push({

            urls: config.print_service_url,
          
            before: (params) => {
                const query = params.requestOptions?.query;
                console.log("request query: ", query)
                if (query) {
                    
                    // body is a URL-encoded string; parse it
                    const webMapParam = query.Web_Map_as_JSON
            
                    if (webMapParam) {
                    const webMap = JSON.parse(webMapParam);
            
                    // Modify the operational layers by adding a 
                    //definiton query to the parcel layer
                    const operationalLayers = webMap.operationalLayers
                    webMap.operationalLayers = operationalLayers.map((layer) => {

                        if(layer.id === sourceId){
                            console.log("applying defintion expression to: ", layer.id, expression)
                            layer.layerDefinition.definitionExpression = expression
                        }

                        return layer
                    })
            
                    // Re-encode the modified JSON back into the body
                    params.requestOptions.query.Web_Map_as_JSON = JSON.stringify(webMap);
                    }
              }
            },
          
            after: (response) => {
              console.log("Modified print response", response);
              return response;
            }
        });


        

        console.log("print param: ", param)
        const result = await executePrint(config.print_service_url, param);

        if(result?.url){
            console.log("print result: ", result.url)
            window.open(result.url)
    
        }


    }

    return(
        <CalcitePanel
        closed={printPanelClosed}
        closable
        heading={translateText("Print")}
        style={{display: printPanelClosed ? 'none': 'flex'}}
        onCalcitePanelClose={() => {
            handleClosePrintPanel()
        }}
        >

            <CalciteButton
            disabled={!arcgisMapRef.current}
            onClick={modifyPrintRequest}
            >Print</CalciteButton>

        
            {/* <arcgis-print
                ref={printRef}
                referenceElement={arcgisMapRef.current}
                // printServiceUrl={config.print_service_url}
                // templateOptions = {printTemplate.current}
                //portal={portal ? portal : null}
                //style={{overflow:'auto', height: '100%'}}
                showPrintAreaEnabled
                />  */}

        </CalcitePanel>
    )
}

export default Print