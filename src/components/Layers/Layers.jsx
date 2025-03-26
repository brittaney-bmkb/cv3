import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-layer-list";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import LabelClass from "@arcgis/core/layers/support/LabelClass.js";

import { useEffect, useRef, useState } from "react";
import { config } from "../../data/config";


const pin10LabelClass = new LabelClass({
    labelExpressionInfo: { expression: "$feature.PIN10" },
    symbol: {
      type: "text",  // autocasts as new TextSymbol()
      color: "black",
      haloSize: 1,
      haloColor: "white"
    }
  });

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


    const handleLayerChanges = () => {

        if (!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map;
        if (!map) return;

        const visibleParcelYears = map.layers.items
                                        .filter((layer) => layer.title === config.historical_group_name) // Correct equality check
                                        .flatMap((groupLayer) => groupLayer.allLayers.items) // Flatten into a single array
                                        .filter((item) => item.visible)
                                        .map((item) => item)
                                        // .map((item) => {
                                        //     const numbers = item.title.match(/\d+/g); // Extract numeric values
                                        //     return numbers ? numbers.join("") : null; // Join and return numbers, or null if none
                                        // })
                                        // .filter((num) => num !== null);

        //update labelingInfos
        visibleParcelYears.map((layer) => {
            if(layer.visible){
                layer.labelingInfo = pin10LabelClass
            }
            else{
                layer.labelingInfo = null
            }
            
        })

        setVisibleLayers([...visibleParcelYears])

        console.log("visible parcel years: ", visibleParcelYears)
    }

    const handleLabels = () => {


    }

    useEffect(() => {
        if (!arcgisMapRef.current) return;

        const map = arcgisMapRef.current.map;
        if (!map) return;

        // Filter out group layers
        const updateVisibleLayers = () => {
            const nonGroupLayers = map.allLayers.filter(layer => !layer.layers);
            const visible = nonGroupLayers.filter(layer => layer.visible);
            setVisibleLayers([...visible]);
        };

        // Listen for layer additions/removals/movements
        map.allLayers.on("change", (event) => {
            console.log("Layer added: ", event.added);
            console.log("Layer removed: ", event.removed);
            console.log("Layer moved: ", event.moved);
            updateVisibleLayers();
        });

        // Watch for visibility changes in layers
        const visibilityWatcher = reactiveUtils.watch(
            () => map.allLayers.filter(layer => layer.visible),
            (newVisibleLayers, oldVisibleLayers) => {
                console.log()

                const added = newVisibleLayers.filter(layer => !oldVisibleLayers.includes(layer));
                const removed = oldVisibleLayers.filter(layer => !newVisibleLayers.includes(layer));

                added.forEach(layer => console.log(layer.title, "is now visible"));
                removed.forEach(layer => console.log(layer.title, "is now hidden"));

                setVisibleLayers(newVisibleLayers);
            }
        );

        return () => {
            visibilityWatcher.remove();
        };
    }, [arcgisMapRef]);

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