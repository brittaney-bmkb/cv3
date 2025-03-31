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

        const currentYear = 2024
        if (!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map;
        
        if (!map) return;

        console.log("Updating labels")
        const targetLayer  = map.allLayers.find((layer) => layer.title === config.target_layer_name)
    
        const visibleParcelYears = map.layers.items
                                        .filter((layer) => layer.title === config.historical_group_name) // Correct equality check
                                        .flatMap((groupLayer) => groupLayer.allLayers.items) // Flatten into a single array
                                        .filter((item) => item.visible && item.parent.visible)
                                        .map((item) => item)
                                        .map((item) => {
                                            const numbers = item.title.match(/\d+/g); // Extract numeric values
                                            return numbers ? numbers.join("") : null; // Join and return numbers, or null if none
                                        })
                                        .filter((num) => num !== null);

        //update labelingInfos
        const labelsLayer = map.allLayers.find((layer) => layer.title === config.parcel_label_layer)

        if(!labelsLayer) return;
        console.log("labelsLayer.labelingInfo: ", labelsLayer.labelingInfo)

        let activeCondition = ''
        let inactiveCondition = ''
        
        const yearsArrayActive = visibleParcelYears.map((year) => {return `InGIS <= ${year}`})
        const yearsArrayInactive = visibleParcelYears.map((year) => {return `(InGIS <= ${year} AND LastActive >= ${year})`})
        
        if(visibleParcelYears.length === 0 && (!targetLayer.visible || ! targetLayer.parent.visible)){
            labelsLayer.labelsVisible = false
            return
        }
        else{
            labelsLayer.labelsVisible = true
        }

        if(yearsArrayActive.length > 0){
            activeCondition =  activeCondition + `((${yearsArrayActive.join(' OR ')}) AND LastActive IS NULL)`
            
            if(targetLayer.visible && targetLayer.parent.visible){    
                
                activeCondition = activeCondition + ' OR '
            }
        }
        if(yearsArrayInactive.length > 0){
            inactiveCondition = inactiveCondition + `(${yearsArrayInactive.join(' OR ')})`
        }
        else{
            inactiveCondition = inactiveCondition + "PIN10 IS NULL"
        }
        
        if(targetLayer.visible  && targetLayer.parent.visible){
            console.log("target layer is visible: ", targetLayer)
            activeCondition = activeCondition  + "LastActive IS NULL"
        }

        // ACTIVE ARCADE SCRIPT

        let labelYearExpression = `

        var label = ""

        if($feature["Shape.STArea()"] > 800){
        label = label + Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + "-" + Mid($feature.PIN10, 4, 3) + "-" + Mid($feature.PIN10, 7, 3)
        }
        else{
        //return Mid($feature.PIN10, 1, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 2, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 3, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 4, 1)  + TextFormatting.NewLine + Mid($feature.PIN10, 5, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 6, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 7, 1)+ TextFormatting.NewLine + Mid($feature.PIN10, 8, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 9, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 10, 1)
        label = label + Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + TextFormatting.NewLine + Mid($feature.PIN10, 4, 3) + "-"  + Mid($feature.PIN10, 7, 3)
        }

        var stackedYears = '' 
        
        var years = [${visibleParcelYears}]

        for(var index in years) {
            if($feature.InGIS <= years[index] && ISEMPTY($feature.LastActive)){
                stackedYears = stackedYears + years[index] + TextFormatting.NewLine
            }
        }

        var addCurrentYear = ${targetLayer.visible  && targetLayer.parent.visible}
        if(addCurrentYear){
            stackedYears  = stackedYears + '${currentYear}' + TextFormatting.NewLine + label
        }
        else{
            stackedYears  = stackedYears + label
        }
  
        return stackedYears
        

        `

        // INACTIVE ARCADE SCRIPT

        let inactiveLabelYearExpression = `

        var label = ""

        if($feature["Shape.STArea()"] > 800){
        label = label + Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + "-" + Mid($feature.PIN10, 4, 3) + "-" + Mid($feature.PIN10, 7, 3)
        }
        else{
        //return Mid($feature.PIN10, 1, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 2, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 3, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 4, 1)  + TextFormatting.NewLine + Mid($feature.PIN10, 5, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 6, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 7, 1)+ TextFormatting.NewLine + Mid($feature.PIN10, 8, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 9, 1) + TextFormatting.NewLine + Mid($feature.PIN10, 10, 1)
        label = label + Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + TextFormatting.NewLine + Mid($feature.PIN10, 4, 3) + "-"  + Mid($feature.PIN10, 7, 3)
        }

        var stackedYears = '' 
        
        var years = [${visibleParcelYears}]

        for(var index in years) {
            if($feature.InGIS <= years[index] && $feature.LastActive >= years[index]){
                stackedYears = stackedYears + years[index] + TextFormatting.NewLine
            }
        }

        if(stackedYears != '') {
        stackedYears  = stackedYears + label
        }
        

  
        return stackedYears
        `
        console.log("expression: ", inactiveLabelYearExpression)

        labelsLayer.labelingInfo.map((labelClass) => {
            console.log("label class names: ", labelClass.name)

            let name = labelClass.name
            if(name.toLowerCase() === 'inactive' && inactiveCondition !== ""){
                 console.log("adding inactive condition: ", inactiveCondition)
            //     labelClass.where = inactiveCondition
                
                labelClass.labelExpressionInfo  ={
                    expression: inactiveLabelYearExpression
                  };
            }
            if(name.toLowerCase() === 'active' && activeCondition !== ""){
                console.log("adding active condition: ", activeCondition)
                //labelClass.where = activeCondition
                
                labelClass.labelExpressionInfo  ={
                    expression: labelYearExpression
                  };
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