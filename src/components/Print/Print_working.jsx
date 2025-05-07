
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
import Print from "@arcgis/core/widgets/Print.js";
import PrintTemplate from "@arcgis/core/rest/support/PrintTemplate.js";
import PrintParameters from "@arcgis/core/rest/support/PrintParameters.js";
import esriConfig from "@arcgis/core/config";
import * as print from "@arcgis/core/rest/print.js";
import "@arcgis/map-components/components/arcgis-print";
import { findTargetLayer } from "../Map/Map";


const PrintFormats = ["jpg", "png8", "png32"]

//TODO ADD PRINT TEMPLATES
const Printer = () => {

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

    const [ allowedLayouts, setAllowedLayouts ] = useState(config.layoutTemplates)
    const [ allowedFormats, setAllowedFormats ] = useState(PrintFormats)

    const [ layout, setLayout ] = useState(Object.keys(allowedLayouts)[0])
    const [ format, setFormat ] = useState([])

    const [ showPrintArea, setShowPrintArea ] = useState(true)
    const [ printLoading, setPrintLoading ] = useState(false)

    const printRef = useRef(null)

    const handleClosePrintPanel = () => {

        setPrintPanel(true)
        if(printViewModel.current){

            setShowPrintArea(false)
            printViewModel.current.showPrintAreaEnabled = false

        }
    }

    useEffect(() => {

        const setupPrintVM = async () => {

            console.log("updating print view model")

            if(!mapView) return;

            // if(printRef.current){
                
            //     const portal = new Portal({
            //         url:"https://test-gis.cookcountyil.gov/gisportal"
            //     })

            //     printRef.current.referenceElement = arcgisMapRef.current
            //     printRef.current.portal = portal
            // }

            if(!printViewModel.current){

                const view = arcgisMapRef.current.view

                if(!view.ready) return;

                //console.log("setting up print view model. showarea: ", showPrintArea)
                printViewModel.current = new PrintVM({
                    view: view,
                    //container:printRef.current,
                    //printServiceUrl : config.print_service_url
                    //allowedFormats: ["jpg", "png8", "png32"]
                    //showPrintAreaEnabled: showPrintArea,
                    //
                })
            }


            if(!printPanelClosed && printViewModel.current){
                setPrintLoading(true)
                await printViewModel.current.load()
                printViewModel.current.printServiceUrl =  config.print_service_url
               // printViewModel.current.allowedLayouts = ["Layout_8x11"]
                printViewModel.current.showPrintAreaEnabled = showPrintArea
                console.log("print view model setup", printViewModel.current)

                
                // //printViewModel.current.templateOptions.id = "letter-ansi-a-portrait-7f0f0ade0fa9dc29824fb25bbf32ac0f"
                // printViewModel.current.templateOptions.layout = layout

                
                console.log("printViewModel.current: ", printViewModel.current?.templatesInfo, layout)
                setPrintLoading(false)
            }
            
        }

        setupPrintVM();

    }, [printRef, arcgisMapRef.current, printViewModel, showPrintArea])
    

    useEffect(() => {

        const getDefitionQuery = async () => {
            if(searchFeatures && searchFeatures.length > 0){
                definitionQuery.current = await createParcelDefinitionExpression(searchFeatures)
            }
        }
        getDefitionQuery()
        
    },  [searchFeatures])

    useEffect(() => {
        
        const updateLayoutOptions = () => {

            if(!printViewModel.current) return;
            
            if(tabSelected === 'map'){

                setAllowedLayouts(config.layoutTemplates)

                setAllowedFormats(PrintFormats)
            }
            else if(tabSelected === 'report'){
                setAllowedLayouts(config.reportTemplates)

                setAllowedFormats(['pdf'])
            }
        }

        updateLayoutOptions()

    }, [tabSelected, printViewModel.current?.templatesInfo])

    const createParcelDefinitionExpression = async (feature) => {

        const pins14 = feature.map((feature) => feature.attributes[config.target_layer_unique_id])

        const expression =`${config.target_layer_unique_id} IN ('${pins14.join("','")}')`

        return expression
    }

    const preparePrintParams = async () => {

        if(!arcgisMapRef.current) return;

        let sourceId = '' 

        const layoutItem = new PortalItem({
            id: config.layoutTemplates[layout].item,
            portal: config.portal_gis
        })

        await layoutItem.load()

        const template = new PrintTemplate({
            layoutItem: layoutItem,
            layout: config.layoutTemplates[layout].name,
            format: 'jpg',
            report: null,
            reportItem: null
        })

        // if(tabSelected === 'report'){

        //     const map = arcgisMapRef.current.map
        //     const view = arcgisMapRef.current.view

        //     if(!view) return;
        //     if(!map) return;

        //     const targetLayer = findTargetLayer(map)

        //     if(!targetLayer) return;
        //     sourceId = targetLayer.id

        //     const reportItem = new PortalItem({
        //         id: reportItemId,
        //         portal: config.portal_gis
        //       });
              
        //     await reportItem.load();

        //     template.reportItem = reportItem
        //     template.reportOptions = {
        //         "reportSectionOverrides": {
        //             "Parcels Current": {
        //                 "name": "Parcels Current",
        //                 "sourceId": sourceId
        //             }}}

        // }
        
        return [ template, sourceId ]
    }

    const modifyPrintRequest = async () => {
        
        const [ template, sourceId ] = await preparePrintParams()


            esriConfig.request.interceptors.push({

                urls: config.print_service_url,
              
                before: (params) => {
    
                    console.log("request query: ", tabSelected, params)
    
                    const query = params.requestOptions?.query;
                    
                    if (query && tabSelected === 'report') {
                        
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
        
        


        console.log("print template: ", template)
        const result = await printViewModel.current.print(template)

        // console.log("print param: ", param)
        // const result = await executePrint(config.print_service_url, param);

        if(result?.url){
            console.log("print result: ", result.url)
            window.open(result.url)
        }
    }

    const layoutDiv = () => ((

        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <CalciteLabel
            >
                {translateText("Layout")}
                <CalciteSelect
                onCalciteSelectChange={(e) => {
                    console.log("setting layout: ", e.target.value)
                    setLayout(e.target.value)
                }}
                >
                    
                {
                //Object.entries(allowedLayouts).map(([key, value], i ) => {
                    printViewModel.current?.templatesInfo?.layout?.choiceList.map((value) => {
                    return(
                        <CalciteOption 
                        key={value}
                        value={value}
                        >
                            {value}
                        </CalciteOption>
                    )
                })
                }

                </CalciteSelect>
            </CalciteLabel>
            
            <CalciteLabel
                layout="inline"
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

            {
                tabSelected === 'map' && (
                    <CalciteLabel>
                        {translateText('Format')}

                        <CalciteSelect
                        onCalciteSelectChange={(e) => {
                            console.log("setting format: ", e.target.value)
                            setFormat(e.target.value)
                        }}      
                        >
                        {
                            allowedFormats?.map((format, i ) => {
                                return(
                                    <CalciteOption 
                                    key={i}
                                    value={format}
                                    >
                                        {format}
                                    </CalciteOption>
                                )
                            })
                            }
                        </CalciteSelect>
                    </CalciteLabel>
                )
            }
            
            
            <CalciteButton
                disabled={!arcgisMapRef.current ||(tabSelected === 'report' && !primaryResultFeature)}
                onClick={modifyPrintRequest}
            >(Print)
            </CalciteButton>
        </div>
    ))

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
                slot="title-group"
                onCalciteTabChange={(e) => 
                    
                    {
                        console.log("selected tab: ", e.target.selectedTabId)
                        setTabSelected(e.target.selectedTabId)
                    }
                }
                >
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
                    style={{padding: '15px'}}
                    >
                    {layoutDiv()}
                </CalciteTab>
                <CalciteTab 
                    tab="report"
                    selected={tabSelected === "report"}
                    style={{padding: '15px'}}
                >
                    {layoutDiv()}
                </CalciteTab>
                <CalciteTab 
                    tab="prints"
                    selected={tabSelected === "prints"}
                    >
                </CalciteTab>
            </CalciteTabs>
        
         {/* <arcgis-print
            ref={printRef}
            //referenceElement={arcgisMapRef.current}
            //printServiceUrl={config.print_service_url}
            //templateOptions = {printTemplate.current}
            //portal={portal ? portal : null}
            //style={{overflow:'auto', height: '100%'}}
            //showPrintAreaEnabled
        />  */}

        {/* <div ref={printRef}
        ></div> */}



         </CalcitePanel>
    )
}

export default Printer