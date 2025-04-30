
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
import PrintAreaBox from "./PrintAreaBox";



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
       const [ allowedFormats, setAllowedFormats ] = useState([])
   
       const [ layout, setLayout ] = useState(null)
       const [ format, setFormat ] = useState([])


       //const [ boxExtent, setBoxExtent ]  = useState(null)
       const [ showPrintArea, setShowPrintArea ] = useState(false)
       const [ printLoading, setPrintLoading ] = useState(false)
   
       const boxExtent = useRef(null)
   
       const handleClosePrintPanel = () => {
   
           setPrintPanel(true)
           if(printViewModel.current){
   
               setShowPrintArea(false)
               printViewModel.current.showPrintAreaEnabled = false
   
           }
       }

       useEffect(() => {

        console.log("extent updated: ", boxExtent.current)
       }, [boxExtent.current  ])
   
       useEffect(() => {
   
           const setupPrintVM = async () => {
   
               console.log("updating print view model")

            //    if(!arcgisMapRef.current) return;
            //    const view = arcgisMapRef.current.view

               if(!mapView?.ready) return;
               // if(printRef.current){
                   
               //     const portal = new Portal({
               //         url:"https://test-gis.cookcountyil.gov/gisportal"
               //     })
   
               //     printRef.current.referenceElement = arcgisMapRef.current
               //     printRef.current.portal = portal
               // }
   
               if(!printViewModel.current && !printPanelClosed){
                   
                   console.log("setting up print view model. showarea: ", )
                   printViewModel.current = new PrintVM({
                       view: mapView,
                       //container:printRef.current,
                       printServiceUrl : config.print_service_url
                       //allowedFormats: ["jpg", "png8", "png32"]
                       //showPrintAreaEnabled: showPrintArea,
                       //
                   })

                   setPrintLoading(true)
                   await printViewModel.current.load()
                   //printViewModel.current.printServiceUrl =  config.print_service_url
                   console.log("printViewModel.current: ", printViewModel.current)

                   const printServiceTemplates = await getPrintLayouts()
                   console.log("print service templates: ", printServiceTemplates)
                   setAllowedLayouts(printServiceTemplates)
                   setLayout(printServiceTemplates[0])

                   const formats = await getPrintFormats()
                   setAllowedFormats(formats)
                   setFormat(formats[0])

                   setPrintLoading(false)

                   
               }
               
           }
   
           setupPrintVM();
   
       }, [mapView, printViewModel.current, printPanelClosed])
       

       const getPrintLayouts = async () => {
        return printViewModel.current.printServiceTemplates.items.map((item) => item.layout)

       }
       const getPrintFormats = async () => {
        return printViewModel.current.templatesInfo.format.choiceList.map((format) => format)

       }
   
       useEffect(() => {
   
           const getDefitionQuery = async () => {
               if(searchFeatures && searchFeatures.length > 0){
                   definitionQuery.current = await createParcelDefinitionExpression(searchFeatures)
               }
           }
           getDefitionQuery()
           
       },  [searchFeatures])
   
       useEffect(() => {
           
           const updateLayoutOptions = async () => {
   
               if(!printViewModel.current) return;
               
               if(tabSelected === 'map'){

                    const printServiceTemplates = await getPrintLayouts()
                    setAllowedLayouts(printServiceTemplates)

                    const printFormats = await getPrintFormats()
                    setAllowedFormats(printFormats)
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
   
        //    const layoutItem = new PortalItem({
        //        id: config.layoutTemplates[layout].item,
        //        portal: config.portal_gis
        //    })
   
        //    await layoutItem.load()
   
           const template = new PrintTemplate({
               //layoutItem: layoutItem,
               layout: layout,
               format: format,
               report: null,
               reportItem: null
           })

           console.log("Print template: ", template)
   
           if(tabSelected === 'report'){
   
               const map = arcgisMapRef.current.map
               const view = arcgisMapRef.current.view
   
               if(!view) return;
               if(!map) return;
   
               const targetLayer = findTargetLayer(map)
   
               if(!targetLayer) return;
               sourceId = targetLayer.id
   
               const reportItem = new PortalItem({
                   id: reportItemId,
                   portal: config.portal_gis
                 });
                 
               await reportItem.load();
   
               template.reportItem = reportItem
               template.reportOptions = {
                   "reportSectionOverrides": {
                       "Parcels Current": {
                           "name": "Parcels Current",
                           "sourceId": sourceId
                       }}}
   
           }
           
           return [ template, sourceId ]
       }
   
       const modifyPrintRequest = async () => {
           
           const [ template, sourceId ] = await preparePrintParams()
   
   
               esriConfig.request.interceptors.push({
   
                   urls: config.print_service_url,
                 
                   before: (params) => {
       
                       console.log("request query: ", tabSelected, params)
       
                       const query = params.requestOptions?.query;
                       
                       if (query) {
                           
                           // body is a URL-encoded string; parse it
                           const webMapParam = query.Web_Map_as_JSON
                   
                           if (webMapParam) {
                           const webMap = JSON.parse(webMapParam);

                           //set map extent
                           console.log("setting map extent: ", boxExtent.current)
                           //webMap.mapOptions['extent'] = boxExtent.current
                            
                           if(tabSelected === 'report'){
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
                           }
                           
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
                    allowedLayouts?.length > 0 && allowedLayouts.map((value) => {
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
                               allowedFormats?.length > 0 && allowedFormats.map((format, i ) => {
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

                {
                    printViewModel.current && (
                    <PrintAreaBox 
                    mapView={mapView} 
                    selectedLayout={layout} 
                    active={showPrintArea} 
                    setBoxExtent={boxExtent.current}
                    vm={printViewModel.current}
                    />
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
           
          
         </CalcitePanel>
    )
}

export default Print