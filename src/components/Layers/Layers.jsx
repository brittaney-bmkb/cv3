import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-layer-list";


import { useEffect, useRef, useState } from "react";
import { config } from "../../data/config";

const Layers = () => {

    const { 
        layersPanelClosed, 
        setLayersPanel, 
        translateText, 
        arcgisMapRef,
        isMobile,
        mapView
     } = UseAppContext()
    
    const layerListRef = useRef(null);

    useEffect(() => {

        if (!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map;
        
        if (!map) return;

        handleLayerChanges()
      
    }, [arcgisMapRef, mapView])


    const handleLayerChanges = () => {


        if (!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map;
        
        if (!map) return;

        console.log("Updating labels")
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

        let activeCondition = ''
        let inactiveCondition = ''
        
        const yearsArrayActive = visibleParcelYears.map((year) => {return `InGIS <= ${year}`})
        const yearsArrayInactive = visibleParcelYears.map((year) => {return `(InGIS <= ${year} AND LastActive >= ${year})`})
        
        if(visibleParcelYears.length === 0 && !targetLayer.visible){
            labelsLayer.labelsVisible = false
            return
        }
        else{
            labelsLayer.labelsVisible = true
        }

        if(yearsArrayActive.length > 0){
            activeCondition =  activeCondition + `((${yearsArrayActive.join(' OR ')}) AND LastActive IS NULL)`
            
            if(targetLayer.visible){    
                activeCondition = activeCondition + ' OR '
            }
        }
        if(yearsArrayInactive.length > 0){
            inactiveCondition = inactiveCondition + `(${yearsArrayInactive.join(' OR ')})`
        }
        else{
            inactiveCondition = inactiveCondition + "PIN10 IS NULL"
        }
        
        if(targetLayer.visible){
            console.log("target layer is visible")
            activeCondition = activeCondition  + "LastActive IS NULL"
        }

        
        labelsLayer.labelingInfo.map((labelClass) => {
            console.log("label class names: ", labelClass.name)

            let name = labelClass.name
            if(name.toLowerCase() === 'inactive' && inactiveCondition !== ""){
                console.log("adding inactive condition: ", inactiveCondition)
                labelClass.where = inactiveCondition
            }
            if(name.toLowerCase() === 'active' && activeCondition !== ""){
                console.log("adding active condition: ", activeCondition)
                labelClass.where = activeCondition
            }
        })
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