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

        const currentYear = 2025
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

        let activeLabelYearExpression = `

        

        function formatPin(parcelArea, pin){

            var label = ""

            if(parcelArea > 500){
                label = label + Mid(pin, 0, 2) + "-" + Mid(pin, 2, 2) + "-" + Mid(pin, 4, 3) + "-" + Mid(pin, 7, 3)
                }
            else{
                label = label + Mid(pin, 0, 2) + "-" + Mid(pin, 2, 2) + TextFormatting.NewLine + Mid(pin, 4, 3) + "-"  + Mid(pin, 7, 3)
                }

            return label
        }


        var addCurrentYear = ${targetLayer.visible  && targetLayer.parent.visible}
        var stackedYears = '' 
        var years = [${visibleParcelYears}]

        //Stacked Years Array
        //Iterate over all visible years

        var parcelLabel = ""
        var pins = []
        for(var index in years) {
            if($feature.InGIS <= years[index] && ISEMPTY($feature.LastActive)){
                Push(pins, $feature.PIN10)
            }
        }

        //Check if PIN is same for all years
        var pinsUnique = Distinct(pins)
        
        //if all the same add all years to label expression
        if(Count(pinsUnique) == 1){
            for(var index in years) {
                if($feature.InGIS <= years[index] && ISEMPTY($feature.LastActive)){
                    stackedYears =  stackedYears + years[index] + TextFormatting.NewLine
                }
            }
            var formattedPin = formatPin($feature["Shape.STArea()"], pinsUnique[0])
            parcelLabel = stackedYears + formattedPin
        }

        return parcelLabel
        `

        // INACTIVE ARCADE SCRIPT

        let inactiveLabelYearExpression = `

         function formatPin(parcelArea, pin){

            var label = ""

            if(parcelArea > 500){
                label = label + Mid(pin, 0, 2) + "-" + Mid(pin, 2, 2) + "-" + Mid(pin, 4, 3) + "-" + Mid(pin, 7, 3)
                }
            else{
                label = label + Mid(pin, 0, 2) + "-" + Mid(pin, 2, 2) + TextFormatting.NewLine + Mid(pin, 4, 3) + "-"  + Mid(pin, 7, 3)
                }

            return label
        }


        var addCurrentYear = ${targetLayer.visible  && targetLayer.parent.visible}
        var stackedYears = '' 
        var years = [${visibleParcelYears}]

        //Stacked Years Array
        //Iterate over all visible years

        var parcelLabel = ""
        var pins = []
        for(var index in years) {
            if($feature.InGIS <= years[index] && !ISEMPTY($feature.LastActive)){
                Push(pins, $feature.PIN10)
            }
        }

        //Check if PIN is same for all years
        var pinsUnique = Distinct(pins)
        
        //if all the same add all years to label expression
        if(Count(pinsUnique) == 1){
            for(var index in years) {
                if($feature.InGIS <= years[index] && !ISEMPTY($feature.LastActive)){
                    stackedYears =  stackedYears + years[index] + TextFormatting.NewLine
                }
            }
            var formattedPin = formatPin($feature["Shape.STArea()"], pinsUnique[0])
            parcelLabel = stackedYears  +  formattedPin
        }

        return parcelLabel
  
        `
        console.log("expression: ", inactiveLabelYearExpression, labelsLayer)

        labelsLayer.labelingInfo.map((labelClass) => {
            console.log("label class names: ", labelClass.name)

            let name = labelClass.name
            if(name.toLowerCase() === 'inactive' && inactiveCondition !== ""){
                 //console.log("adding inactive condition: ", inactiveCondition)
            //     labelClass.where = inactiveCondition
                labelClass.deconflictionStrategy = "none";
                labelClass.repeatLabel = false
                labelClass.labelExpressionInfo  ={
                    expression: inactiveLabelYearExpression
                  };
            }
            if(name.toLowerCase() === 'active' && activeCondition !== ""){
                //console.log("adding active condition: ", activeCondition)
                //labelClass.where = activeCondition
                labelClass.deconflictionStrategy = "none";
                labelClass.repeatLabel = false
                labelClass.labelExpressionInfo  ={
                    expression: activeLabelYearExpression
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