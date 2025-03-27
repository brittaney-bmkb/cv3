import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-layer-list";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";

import { useEffect, useRef, useState } from "react";
import { config } from "../../data/config";

const Layers = () => {

    const { 
        layersPanelClosed, 
        setLayersPanel, 
        translateText, 
        arcgisMapRef,
        isMobile
     } = UseAppContext()
    
    const layerListRef = useRef(null);

    const [visibleLayers, setVisibleLayers] = useState([]);
    const [ maxYear, setMaxYear ] = useState()

    useEffect(() => {

        const getCurrentYear = async () => {

            if(!arcgisMapRef.current) return;

            const map = arcgisMapRef.current.map
    
            const labelsLayer = map.allLayers.find((layer) => layer.title === config.parcel_label_layer)
            
            const { features } = await labelsLayer.queryFeatures()

            const years = features.map((feature) => feature.InGIS)
            
            const max = Math.max(...years)

            setMaxYear(max)
        }

        getCurrentYear()

    }, [arcgisMapRef])


    const handleLayerChanges = () => {

        if (!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map;
        if (!map) return;

        const targetLayer  = map.allLayers.find((layer) => layer.title === config.target_layer_name)
    
        const visibleParcelYears = map.layers.items
                                        .filter((layer) => layer.title === config.historical_group_name) // Correct equality check
                                        .flatMap((groupLayer) => groupLayer.allLayers.items) // Flatten into a single array
                                        .filter((item) => item.visible)
                                        .map((item) => item)
                                        .map((item) => {
                                            const numbers = item.title.match(/\d+/g); // Extract numeric values
                                            return numbers ? numbers.join("") : null; // Join and return numbers, or null if none
                                        })
                                        .filter((num) => num !== null);

        //update labelingInfos
        const labelsLayer = map.allLayers.find((layer) => layer.title === config.parcel_label_layer)

        console.log("labelsLayer.labelingInfo: ", labelsLayer.labelingInfo)


        labelsLayer.labelingInfo = []
        

        let activeCondition = ''
        let inactiveCondition = ''
        
        const yearsArray = visibleParcelYears.map((year) => {return `InGIS <= ${year}`})
        
        if(yearsArray.length === 0 && !targetLayer.visible){
            labelsLayer.layersVisible = false
            return
        }

        if(yearsArray.length > 0){
            activeCondition =  activeCondition + `((${yearsArray.join(' OR ')}) AND LastActive IS NULL)`
            inactiveCondition = inactiveCondition + `(${yearsArray.join(' OR ')}) AND LastActive IS NOT NULL`
            if(targetLayer.visible){    
                activeCondition = activeCondition + ' OR '
            }
        }
        
        if(targetLayer.visible){
            console.log("target layer is visible")
            activeCondition = activeCondition  + "LastActive IS NULL"
        }

    

        //START HERE TO UPDATE LABEL CLASS 
        //REFERENCE EXISTING LABEL CLASS
        //look for 'inactive' string in label expression to determin if
        //label class is active or inactive
        //const activeLabelClasss = labelsLayer.labelingInfo.filter((label) => label.labelExpression.Info.expression)

        //TEMP LABEL CLASSES
        const activeLabelClasses = {
            labelExpressionInfo: {
                expression: `$feature.PIN10`
            },
            where: activeCondition,
        };

        const inactiveLabelClasses = {
            labelExpressionInfo: {
                expression: `'Inactive:' + $feature.PIN10`
            },
            where: inactiveCondition,
        };
        
        console.log("labels activeCondition: ", activeCondition)
        console.log("labels inactiveCondition: ", inactiveCondition)

        console.log("labelsLayer.labelingInfo: ", labelsLayer.labelingInfo)


        const labelsArray = []
        if(activeCondition !== ""){
            labelsArray.push(activeLabelClasses) 
        }
        if(inactiveCondition !==""){
            labelsArray.push(inactiveLabelClasses) 
        }

        labelsLayer.labelingInfo = labelsArray
        if(labelsArray.length > 0){
            labelsLayer.labelsVisible = true
        }
        

        if(yearsArray.length === 0 && targetLayer.visible === false){
            labelsLayer.labelsVisible = false
        }

    
        setVisibleLayers([...visibleParcelYears])

        console.log("visible parcel years: ", visibleParcelYears)
    }


    return(
        <CalcitePanel
        closed={layersPanelClosed}
        closable
        heading={translateText("Layers")}
        style={{display: layersPanelClosed ? 'none': 'inherit'}}
        onCalcitePanelClose={() => {
            setLayersPanel(true)
        }}
        scale={isMobile ? "s" : "m"}
        >
            {
                arcgisMapRef.current ? 
                <CalciteBlock
                open
                heading="Add a layer to the map"
                description={translateText("Toggle layers to show/hide them in the map")}
                scale={isMobile ? "s" : "m"}
                style={{height: '100%', overflow:'clip'}}
                >   
                <arcgis-layer-list
                ref={layerListRef}
                referenceElement={arcgisMapRef.current}
                visibilityAppearance="checkbox"
                showFilter
                filterPlaceholder={translateText("Search for layers")}
                onClick={() => {handleLayerChanges()}}
                />
             </CalciteBlock> 
            : null
            }
            

        </CalcitePanel>
    )
}

export default Layers