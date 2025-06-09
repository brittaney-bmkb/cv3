import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-layer-list";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";


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

        let yOffset = 0
        let yOffsetNeg = -50
        if (!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map;
        
        if (!map) return;

        console.log("Updating labels")
        const targetLayer  = map.allLayers.find((layer) => layer.title === config.target_layer_name)
        //targetLayer.labelsVisible = false
    
        const visibleParcelYears = map.layers.items
                                        .filter((layer) => layer.title === config.historical_group_name || layer.title === 'Parcels') // Correct equality check
                                        .flatMap((groupLayer) => groupLayer.allLayers.items) // Flatten into a single array
                                        .filter((item) => item.visible && item.parent.visible)
                                        .map((item) => item)

        

        
        visibleParcelYears.map((layer, i) => {
              
            // if(layer.labelingInfo.length == 0){
                const numbers = layer.title.match(/\d+/g); // Extract numeric values
                let title = numbers ? `'${numbers.join("")}: ' + TextFormatting.NewLine + label` : null;
                
                if(!title){
                    title = 'label'
                }

                let expression = `
                var label = ""

                if($feature.YMax-$feature.YMin < $feature.XMax-$feature.XMin-20){
                    label = Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + "-" + Mid($feature.PIN10, 4, 3) + "-" + Mid($feature.PIN10, 7, 3)
                }
                else{
                    label= Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + TextFormatting.NewLine + Mid($feature.PIN10, 4, 3) + "-"  + Mid($feature.PIN10, 7, 3)
                }
                return ${title}
                
                `
                let color = null
                if(layer.title !== config.target_layer_name){
                    console.log(layer.renderer.symbol.data.symbol.symbolLayers)
                    color = layer.renderer.symbol.data.symbol.symbolLayers[0].color
                }
                
                console.log("layer", layer)
                let symbol = {
                    type: "text",
                    color:  color ? color : [255, 255, 255, 255], // white
                    font: { family: "Arial Unicode MS", size: 11, weight: "bold" },
                    haloColor: [0, 0, 0, 255],  // black
                    haloSize: 1.5,
                    yoffset: i <= 3 ? yOffset : yOffsetNeg,
                    // xoffset: i > 1 ? xOffset : 0 
                }
                const labelClass = new LabelClass({  // autocasts as new LabelClass()
                    symbol: symbol,
                    labelExpressionInfo: {
                        expression: expression
                      },
                    minScale: layer.minScale/2,
                    maxScale: layer.maxScale,
                    deconflictionStrategy: 'static',
                    repeatLabel: false
                  });
                
                if(!layer.labelingInfo){
                    layer.labelingInfo = [labelClass]
                    layer.labelsVisible = true
                }
                else{
                    //layer.labelingInfo[0].symbol.yoffset = yOffset
                    layer.labelingInfo[0].labelExpressionInfo.expression = expression
                    layer.labelingInfo[0].symbol = symbol
                    layer.labelingInfo[0].deconflictionStrategy  = 'static'
                    layer.labelingInfo[0].minScale= layer.minScale/2
                    layer.labelingInfo[0].maxScale= layer.maxScale
                    layer.labelingInfo[0].repeatLabel = false
                }
                  

                yOffset = yOffset + 45
                if(i >3){
                    yOffsetNeg = yOffsetNeg -45
                }
            //}
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
                listItemCreatedFunction={ (event) => {
                    let item = event.item
                    item.title = translateText(item.title, true)
                }}
                />
             </CalciteBlock> 
            : null
            }
            

        </CalcitePanel>
    )
}

export default Layers