
import { 
    CalciteBlock, 
    CalciteButton, 
    CalciteDropdown, 
    CalciteInput, 
    CalciteLabel, 
    CalciteLink, 
    CalciteList, 
    CalciteListItem, 
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
import "@arcgis/map-components/components/arcgis-print";
import { findTargetLayer } from "../Map/Map";
import PrintAreaBox from "./PrintAreaBox";
import CustomMaskLayer from "./CustomMaskLayer";

import Polygon from "@arcgis/core/geometry/Polygon.js";
import Inactive from "../Inactive/Inactive";
import useEsriInterceptor from "./UseInterceptor";

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

       const [ tabSelected, setTabSelected ] = useState('map')
   
       const [ allowedLayouts, setAllowedLayouts ] = useState([])
       const [ allowedFormats, setAllowedFormats ] = useState([])
   
       const [ layout, setLayout ] = useState(null)
       const [ format, setFormat ] = useState([])

       //const [ boxExtent, setBoxExtent ]  = useState(null)
       const [ showPrintArea, setShowPrintArea ] = useState(false)
       const [ printLoading, setPrintLoading ] = useState(false)
       const [ sourceId, setSourceId ] = useState(null)

       const [ printTitle, setPrintTitle ] = useState('untitled')
       const [ printExecuting, setPrintExecuting ] = useState(false)
       const [ printJobs, setPrintJobs ] = useState({})
       
       const currentPrintJobId = useRef(null)
       const boxExtent = useRef(null)
       const maskLayer = useRef(null);
   
       const handleClosePrintPanel = () => {
   
           setPrintPanel(true)
           if(printViewModel.current){
   
               setShowPrintArea(false)
               //printViewModel.current.showPrintAreaEnabled = false
           }
       }

       //revisit custom mask layer
        useEffect(() => {
        if (!arcgisMapRef.current || !showPrintArea || !boxExtent.current) return;
        const map  = arcgisMapRef.current.map
        const view = arcgisMapRef.current.view
        const mapElement = arcgisMapRef?.current;
        
        if(!map || !view) return;

        const removeMaskLayer = () => {
            map.remove(maskLayer.current);
            maskLayer.current = null;
        }

        const createCustomMaskLayer = () => {
            
        console.log("Creating custom mask layer")
        try {

            const printArea = Polygon.fromExtent(boxExtent.current)
            maskLayer.current = new CustomMaskLayer({
                geometry: printArea,
                spatialReference: view.spatialReference,
                distance: 10,
                color: [0, 0, 0, 0.4]
            });
            
            map.add(maskLayer.current);
            } catch (e) {
            console.error("Failed to add CustomMaskLayer:", e);
            }
        
        console.log("custom mask layer: ", maskLayer.current)
        
        }

        if (!maskLayer.current) {
            createCustomMaskLayer()
        }
        const listener = () => {
            if (maskLayer.current) {
                removeMaskLayer()
            }
            createCustomMaskLayer()
    
        }
        mapElement.addEventListener("arcgisViewChange", listener);

        return () => {
            mapElement.removeEventListener("arcgisViewChange", listener);
            if (maskLayer.current) {
                removeMaskLayer()
            }
        }
    
        }, [arcgisMapRef.current, mapView, showPrintArea, boxExtent.current]);

   
       useEffect(() => {
   
           const setupPrintVM = async () => {

               if(!mapView?.ready) return;

   
               if(!printViewModel.current && !printPanelClosed){
                   
                   //console.log("setting up print view model. showarea: ", )
                   printViewModel.current = new PrintVM({
                       view: mapView,
                       printServiceUrl : config.print_service_url
                   })

                   setPrintLoading(true)
                   await printViewModel.current.load()

                   const printServiceTemplates = await getPrintLayouts()
                   //console.log("print service templates: ", printServiceTemplates)
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
   
       const createParcelDefinitionExpression = async (feature) => {
   
           const pins14 = feature.map((feature) => feature.attributes[config.target_layer_unique_id])
   
           const expression =`${config.target_layer_unique_id} IN ('${pins14.join("','")}')`
   
           return expression
       }
   
       const preparePrintParams = async (jobType) => {
   
           if(!arcgisMapRef.current) return;
   
           const template = new PrintTemplate({
               layout: layout,
               format: jobType === 'report' ? 'pdf' : format,
           })

           if(jobType === 'report'){
   
               const map = arcgisMapRef.current.map
               const view = arcgisMapRef.current.view
   
               if(!view) return;
               if(!map) return;
   
               const targetLayer = findTargetLayer(map)
   
               if(!targetLayer) return;
               const sourceId = targetLayer.id

               setSourceId(sourceId)

               const portalItem = new PortalItem({
                portal: config.portal_gis,
                id: config.report_id
               })
   
            //    /template.report = config.reportTemplate
               template.reportItem = portalItem
               template.reportOptions = {
                   "reportSectionOverrides": {
                       "Parcels Current": {
                           "name": "Parcels Current",
                           "sourceId": sourceId
                       }}}
           }
           
           return template
       }

       useEsriInterceptor("printInterceptor", {
        urls: config.print_service_url,
        before: (params) => {
          const query = params.requestOptions?.query;
          if (query?.Web_Map_as_JSON) {
            const webMap = JSON.parse(query.Web_Map_as_JSON);
      
            // Set extent
            if (boxExtent.current) {
              webMap.mapOptions.extent = boxExtent.current;
            }
      
            let operationalLayers = webMap.operationalLayers;
            let legendLayers = webMap.layoutOptions.legendOptions.operationalLayers
      
            if (printJobs[currentPrintJobId.current].type === 'report') {
              webMap.operationalLayers = operationalLayers.map((layer) => {
                if (layer.id === sourceId && definitionQuery.current) {
                    console.log("setting definition query for ", sourceId, definitionQuery.current)
                    layer.layerDefinition.definitionExpression = definitionQuery.current;
                }
                return layer;
              });

              operationalLayers = webMap.operationalLayers;
              
              webMap.layoutOptions.legendOptions.operationalLayers = legendLayers.map((layer) => {
                if(layer.id !== sourceId){
                    return layer
                }
              })

            }


            webMap.operationalLayers = operationalLayers.filter(
                (layer) => layer.id !== "printGraphicsLayer"
              );
      
            query.Web_Map_as_JSON = JSON.stringify(webMap);
          }
        },
        after: (response) => {
            console.log("Modified print response", response);
            response
        }
      }, !!printViewModel.current);
      
      function extractTextInParentheses(text) {
        const regex = /\(([^)]+)\)/;
        const match = text.match(regex);
        return match ? match[1] : null;
      }
      
       const submitPrintRequest = async () => {
           
           const jobKey = Object.keys(printJobs).length 

           
           let jobDetails = {
            "title": `${printTitle}.${tabSelected === 'report' ? 'pdf' : extractTextInParentheses(format)}`,
            "description": translateText("Download and open in new window"),
            "link": "",
            "type": tabSelected
           }

           let job = {}
           job[jobKey] = jobDetails

           currentPrintJobId.current = jobKey

           if(Object.keys(printJobs).length  > 0){
             setPrintJobs({...printJobs, ...job})
           }
           else{
             setPrintJobs(job)
           }
           
           const template  = await preparePrintParams(tabSelected)

           //try {
                
                setTabSelected('prints')
                setPrintExecuting(true)
                const result = await printViewModel.current.print(template)

                if(result?.url){
                    console.log("print result: ", result)
                    //window.open(result.url)
                    setPrintJobs( (prev) => ({
                        ...prev,
                        [jobKey]: {
                            ...job[jobKey],
                            link: result.url
                        }
                    })
                    )
                }
        //    } catch (error) {
        //         console.error("Printing failed")
        //    }
           
           setPrintExecuting(false)
       }
   
       const layoutDiv = () => ((
   
           <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <CalciteLabel>
                    {translateText("File name")}
                    <CalciteInput
                    placeholder="untitled"
                    value={printTitle}
                    onCalciteInputChange={(e) => setPrintTitle(e.target.value)}
                    />
                </CalciteLabel>
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
                   ///loading={printExecuting}
                   onClick={submitPrintRequest}
               >{translateText("Print")}
               </CalciteButton>
           </div>
       ))

       const downloadFile = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

       const updateJobsList = (type) => {

        return Object.entries(printJobs)?.map(([key, values],i) => {

            if(printJobs[key].type === type){
                return(
                    <CalciteListItem
                    key={`${key}`}
                    label={printJobs[key]?.title}
                    description={printJobs[key]?.description}
                    value={printJobs[key]?.title}
                    iconStart={printExecuting ? null : "image"}
                    iconEnd="launch"
                    disabled={!printJobs[key].link}
                    onCalciteListItemSelect={() => {
                        window.open(printJobs[key].link, '_blank')
                        downloadFile(printJobs[key].link, printJobs[key]?.title)
                    }}
                    >   
                    {
                        !printJobs[key].link && (
                            <CalciteLoader 
                            inline
                            scale="s"
                            slot="content-start"
                            />  
                        )
                    }                         
                    </CalciteListItem>
                )
            }

        })

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

                {
                    printViewModel.current && (
                    <PrintAreaBox 
                    mapView={mapView} 
                    selectedLayout={layout} 
                    active={showPrintArea} 
                    boxExtent={boxExtent}
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
                       {searchFeatures && searchFeatures?.length > 0 ? layoutDiv() : <Inactive title={translateText("Select one or more parcels")}/> }
                   </CalciteTab>
                   <CalciteTab 
                       tab="prints"
                       selected={tabSelected === "prints"}
                    >

                       

                        
                        <CalciteBlock
                            open
                            collapsible
                            heading="Maps"
                        >
                        <CalciteList>
                            {updateJobsList('map')}
                                
                        </CalciteList>

                        </CalciteBlock> 

                        <CalciteBlock
                        open
                        collapsible
                        heading="Reports"
                        >
                        <CalciteList>
                            {updateJobsList('report')}
                        </CalciteList>

                        </CalciteBlock>
                       
                        
                   </CalciteTab>
               </CalciteTabs>
           
          
         </CalcitePanel>
    )
}

export default Print