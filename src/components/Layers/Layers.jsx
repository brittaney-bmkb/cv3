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

        let yOffset = -20
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
              console.log("layer.labelingInfo ", layer.labelingInfo)
            // if(layer.labelingInfo.length == 0){
                const numbers = layer.title.match(/\d+/g); // Extract numeric values
                let title = numbers ? `'${numbers.join("")}: ' + label` : null;
                
                if(!title){
                    title = 'label'
                }

                let expression = `
                var label = ""

                //if($feature["Shape.STArea()"] > 2000){
                    label = label + Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + "-" + Mid($feature.PIN10, 4, 3) + "-" + Mid($feature.PIN10, 7, 3)
                //}
                //else{
                    //label = label + Mid($feature.PIN10, 0, 2) + "-" + Mid($feature.PIN10, 2, 2) + TextFormatting.NewLine + Mid($feature.PIN10, 4, 3) + "-"  + Mid($feature.PIN10, 7, 3)
                //}
                return ${title}
                
                `

                const labelClass = new LabelClass({  // autocasts as new LabelClass()
                    symbol: {
                        type: "text",
                        color: [255, 255, 255, 255],  // white
                        font: { family: "Arial Unicode MS", size: 10, weight: "bold" },
                        haloColor: [0, 0, 0, 255],  // black
                        haloSize: 1,
                        yoffset: yOffset
                    },
                    labelExpressionInfo: {
                        expression: expression
                      },
                  });
                
                if(!layer.labelingInfo){
                    layer.labelingInfo = [labelClass]
                    layer.labelsVisible = true
                }
                else{
                    layer.labelingInfo[0].symbol.yoffset = yOffset
                    layer.labelingInfo[0].labelExpressionInfo.expression = expression
                }
                  

                yOffset = yOffset+ 15
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
                />
             </CalciteBlock> 
            : null
            }
            

        </CalcitePanel>
    )
}

export default Layers