
import { 
    CalciteBlock, 
    CalciteButton, 
    CalciteDropdown, 
    CalciteLabel, 
    CalciteLoader, 
    CalciteOption, 
    CalcitePanel, 
    CalciteScrim, 
    CalciteSelect, 
    CalciteSwitch, 
    CalciteTab, 
    CalciteTabNav, 
    CalciteTabs, 
    CalciteTabTitle 
} from "@esri/calcite-components-react"

import "@esri/calcite-components/dist/components/calcite-tabs";
import "@esri/calcite-components/dist/components/calcite-tab";
import "@esri/calcite-components/dist/components/calcite-tab-nav";
import "@esri/calcite-components/dist/components/calcite-tab-title";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-option";
import "@esri/calcite-components/dist/components/calcite-switch";

import UseAppContext from "../../contexts/AppContext"
import { config } from "../../data/config";
import { useEffect, useRef, useState } from "react";

import Portal from "@arcgis/core/portal/Portal.js";
import PortalItem from "@arcgis/core/portal/PortalItem.js";

//print modules & dependencies 
import PrintVM from "@arcgis/core/widgets/Print/PrintViewModel.js";
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";
import esriConfig from "@arcgis/core/config";
import * as print from "@arcgis/core/rest/print.js";
import "@arcgis/map-components/components/arcgis-print";
import { findTargetLayer } from "../Map/Map";


//TODO ADD PRINT TEMPLATES
const Print = () => {

    const { 
        printPanelClosed, 
        setPrintPanel, 
        translateText, 
        arcgisMapRef,
        mapView,
        primaryResultFeature,
        searchFeatures
    } = UseAppContext()
    
    const printViewModel = useRef(null)
    const definitionQuery = useRef(null)
    const [ reportItemId, setReportItemId ] = useState(config.reportTemplates[Object.keys(config.reportTemplates)[0]].reportItem)
    const [ layoutItemId, setLayoutItemId ] = useState(config.reportTemplates[Object.keys(config.reportTemplates)[0]].layoutItem)

    const [ tabSelected, setTabSelected ] = useState('map')
    const [ allowedLayouts, setAllowedLayouts ] = useState([])
    const [ showPrintArea, setShowPrintArea ] = useState(true)
    const [ printLoading, setPrintLoading ] = useState(false)

    const handleClosePrintPanel = () => {

        setPrintPanel(true)
        if(printViewModel.current){

            setShowPrintArea(false)
            printViewModel.current.showPrintAreaEnabled = false

        }
    }

    const handleReportSelection = (layout, report) => {

        setLayoutItemId(layout)
        setReportItemId(report)
    }


    useEffect(() => {

        const setupPrintVM = async () => {

            console.log("updating print view model")

            if(!mapView) return;

            if(!printViewModel.current){

                const view = arcgisMapRef.current.view

                if(!mapView.ready) return;

                //console.log("setting up print view model. showarea: ", showPrintArea)
                printViewModel.current = new PrintVM({
                    view: view,
                    allowedLayouts: config.layoutTemplates
                    //showPrintAreaEnabled: showPrintArea,
                    //printServiceUrl: config.print_service_url
                })
            }


            if(!printPanelClosed && printViewModel.current){
                setPrintLoading(true)
                await printViewModel.current.load()
                printViewModel.current.showPrintAreaEnabled = showPrintArea
                console.log("print view model setup", printViewModel.current)
                setPrintLoading(false)
            }
            
        }

        setupPrintVM();

    }, [printViewModel, mapView, showPrintArea, printPanelClosed])
    

    useEffect(() => {

        const getDefitionQuery = async () => {
            if(searchFeatures && searchFeatures.length > 0){
                definitionQuery.current = await createParcelDefinitionExpression(searchFeatures)
            }
        }
        getDefitionQuery()
        
    },  [searchFeatures])

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

        let reportItem = new PortalItem({
            id: reportItemId,
            portal: config.portal_gis
          });
          
        await reportItem.load();

        let layoutItem = new PortalItem({
            id: layoutItemId,
            portal: config.portal_gis
        })

        await layoutItem.load()

        const template = new PrintTemplate({
            layoutItem: layoutItem,
            reportItem: reportItem,
            format: "pdf",
            reportOptions: {
                "reportSectionOverrides": {
                    "Parcels Current": {
                        "name": "Parcels Current",
                        "sourceId": sourceId
                    }}}
        })
        
        // const params = new PrintParameters({
        //     template: template,
        //     view: view
        // })

        return [ template, sourceId ]
    }

    const executePrint = async (url, params) => {
        const printResult = print.execute(url, params)

        return printResult
    }

    const modifyPrintRequest = async () => {
        
        const [ template, sourceId ] = await preparePrintParams()

        esriConfig.request.interceptors.push({

            urls: config.print_service_url,
          
            before: (params) => {

                console.log("request query: ", params)

                const query = params.requestOptions?.query;
                
                if (query) {
                    
                    // body is a URL-encoded string; parse it
                    const webMapParam = query.Web_Map_as_JSON
            
                    if (webMapParam) {
                    const webMap = JSON.parse(webMapParam);
            
                    // Modify the operational layers by adding a 
                    //definiton query to the parcel layer
                    const operationalLayers = webMap.operationalLayers
                    webMap.operationalLayers = operationalLayers.map((layer) => {

                        if(layer.id === sourceId && definitionQuery.current){
                            console.log("applying defintion expression to: ", layer.id, definitionQuery.current)
                            layer.layerDefinition.definitionExpression = definitionQuery.current
                        }

                        return layer
                    })

                    //add selected parcel layers to map
                    //find selected parcel layer and push to operational layers
            
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

        const result = await printViewModel.current.print(template)

        // console.log("print param: ", param)
        // const result = await executePrint(config.print_service_url, param);

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
            {
                printLoading && 
                (
                <CalciteScrim>
                    <CalciteLoader/>
                </CalciteScrim> 
                )
            }
            <CalciteTabs bordered scale="l">
                <CalciteTabNav 
                slot="title-group">
                    <CalciteTabTitle 
                        tab="map"
                        selected={tabSelected === "map"}
                        >
                        Map
                    </CalciteTabTitle>
                    <CalciteTabTitle 
                        tab="report"
                        selected={tabSelected === "report"}>
                        Report
                    </CalciteTabTitle>
                    <CalciteTabTitle 
                        tab="prints"
                        selected={tabSelected === "prints"}
                        >
                        Prints
                    </CalciteTabTitle>
                </CalciteTabNav>
                <CalciteTab 
                    tab="map"
                    selected={tabSelected === "map"}
                    >
                </CalciteTab>
                <CalciteTab 
                    tab="report"
                    selected={tabSelected === "report"}
                    style={{padding: '15px'}}
                >
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <CalciteLabel
                            scale="l"
                        >
                            Layout
                            <CalciteSelect scale="l">
                                {
                                    Object.entries(config.reportTemplates).map(([key, value], i ) => {

                                        return(
                                            <CalciteOption 
                                            key={i}
                                            value={key}
                                            onClick={() => {handleReportSelection(value.layoutItem, value.reportItem)}}
                                            >
                                                {value.label}
                                            </CalciteOption>
                                        )
                                    })
                                }

                            </CalciteSelect>
                        </CalciteLabel>
                        
                        <CalciteLabel
                            layout="inline"
                            scale="l"
                        >
                            <CalciteSwitch
                                checked={showPrintArea}
                                onCalciteSwitchChange={(e) => {
                                    console.log("calcite switch changed", e)
                                    setShowPrintArea(!showPrintArea)
                                }}
                            />
                            {translateText("Show print area")}
                        </CalciteLabel>
                        
                        
                        <CalciteButton
                            disabled={!arcgisMapRef.current || !primaryResultFeature}
                            onClick={modifyPrintRequest}
                        >Print
                        </CalciteButton>
                    </div>
                </CalciteTab>
                <CalciteTab 
                    tab="prints"
                    selected={tabSelected === "prints"}
                    >
                </CalciteTab>

            </CalciteTabs>
        
        {/*  <arcgis-print
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