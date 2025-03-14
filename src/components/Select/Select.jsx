import "@arcgis/map-components/components/arcgis-sketch";

import { CalciteBlock, CalciteButton, CalciteNotice, CalcitePanel } from "@esri/calcite-components-react";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import "@esri/calcite-components/components/calcite-notice"
import { config } from "../../data/config";

const Select = () => {

    const { selectPanelClosed, setSelectPanel, translateText, arcgisMapRef, queryPolygon, clearResults } = UseAppContext()
    
    const sketchRef = useRef(null)
    const graphicsLayer = useRef(null)

    const [activeTool, setActiveTool] = useState(null)
    const [ hitTestLayers, setHitTestLayers ] = useState(null)

    const findTargetLayer = (map) => {
    
        let layer = map.allLayers.find((layer) => {
            console.log("Layer details: ", layer)
            return `${layer.url}/${layer.layerId}` === config.target_layer_url
        })

        return layer
    }

    const handleClickSelection = async (event) => {
        if (activeTool !== "cursor") return; // Ensure we're using the cursor tool
    
        const view = arcgisMapRef.current?.view;
        if (!view || !graphicsLayer.current || !hitTestLayers) return;

        const opts = {
            include: hitTestLayers
        }

        const hitResponse = await view.hitTest(event, opts);

        console.log("hittest view: ", view)
        console.log("hittest response: ", hitResponse)
        console.log("hittest opts: ", opts)

        const selectedFeatures = hitResponse.results
            .map((result) => result.graphic)
            .filter((graphic) => graphic.layer === graphicsLayer.current);
    
        if (selectedFeatures.length > 0) {
            console.log("Selected Parcels:", selectedFeatures);
    
            // Extract geometries from selected parcels
            const geometries = selectedFeatures.map((graphic) => graphic.geometry);
            
            // Perform union operation on multiple selected parcels
            const queryGeometry = unionOperator.executeMany(geometries);
    
            if (queryGeometry) {
                await queryPolygon(queryGeometry); // Query parcels using the unioned geometry
            } else {
                console.warn("Union operation returned an invalid geometry.");
            }
        }
    };
    
    useEffect(() => {
        const mapElement = arcgisMapRef.current;
        if (!mapElement) return;

        // Attach event listener for clicking on parcels
        mapElement.addEventListener("arcgisViewClick", handleClickSelection);

        return () => {
            // Cleanup event listener when component unmounts or tool changes
            mapElement.removeEventListener("arcgisViewClick", handleClickSelection);
        };
    }, [activeTool]);

    const handleSelection = async (e) => {

        if (!graphicsLayer.current) {
            console.error("GraphicsLayer is not initialized.");
            return;
        }
    
        const geometries = graphicsLayer.current.graphics.map((graphic) => graphic.geometry);
        
        if (!geometries.length) {
            console.warn("No geometries available for selection.");
            return;
        }
    
        const queryGeometry = unionOperator.executeMany(geometries.toArray());
        
        if (!queryGeometry) {
            console.error("Query geometry is invalid.");
            return;
        }
    
        await queryPolygon(queryGeometry);
        graphicsLayer.current.removeAll();

    }

    const handleReset = async () => {
        if(graphicsLayer.current){
            graphicsLayer.current.removeAll()
        }
        clearResults()
    }

    useEffect(() => {
        if (arcgisMapRef.current && !graphicsLayer.current) {
            graphicsLayer.current = new GraphicsLayer();
            const map = arcgisMapRef.current.map;
            
            if (map) {
                console.log("Adding graphics layer to map");
                map.add(graphicsLayer.current);

                let layer = findTargetLayer(map)
                setHitTestLayers([layer])
            }
        }
    }, [arcgisMapRef]);

    const getSelectionTip = (tool) => {
        if (tool === "polygon") {
            return {
                title: translateText("Selecting Parcels with the Polygon Tool"),
                message: translateText("Click on the map to place points and outline your selection area. Double-click or click the starting point to complete the shape and select the parcels inside."),
            };
        } else if (tool === "rectangle") {
            return {
                title: translateText("Selecting Parcels with the Rectangle Tool"),
                message: translateText("Click and drag on the map to draw a rectangle. All parcels within the selected area will be highlighted automatically."),
            };
        }else if (tool === "cursor") {
            return {
                title: translateText("Selecting a Parcel with a Click"),
                message: translateText("Click on an individual parcel to select it. You can click multiple parcels to add to your selection."),
            };
        }
        return { title: "", message: "" }; // Default empty state
    };
    
    const { title, message } = getSelectionTip(activeTool);


    return(
        <CalcitePanel
            closed={selectPanelClosed}
            closable
            heading={translateText("Select")}
            style={{display: selectPanelClosed ? 'none': 'flex'}}
            onCalcitePanelClose={() => {
                setSelectPanel(true)
            }}
            >
                {
                    arcgisMapRef.current ? 
                    <CalciteBlock
                    open
                    heading={translateText("Select Multiple Parcels")}
                    description={translateText("Select multiple parcels on the map by drawing a rectangle, creating a custom polygon, or clicking individual parcels.")}
                    style={{height: '97%', overflow:'clip', display: 'flex', flexDirection: "column", gap: '10px',}}
                    >   
                    <arcgis-sketch
                    ref={sketchRef}
                    layer={graphicsLayer.current}

                    onClick = {(e) => {
                        console.log("icon: ", e.target.icon)
                        setActiveTool(e.target.icon)
                    }}

                    onarcgisCreate = { (e) => {
                        
                        handleSelection(e)
                    }}
                    referenceElement={arcgisMapRef.current}
                    hideCreateToolsPoint
                    hideCreateToolsCircle
                    hideCreateToolsPolyline
                    hideDuplicateButton
                    hideLabelsToggle
                    hideSettingsMenu
                    hideUndoRedoMenu
                    hideSnappingControls
                    hideSelectionCountLabel
                    hideSelectionToolsLassoSelection
                    hideSelectionToolsRectangleSelection
                    autoDestroyDisabled={false}
                    hideDeleteButton={false}
                    scale="l"
                    
                    />


                    <CalciteNotice
                    style={{paddingTop: "15px"}}
                    open={activeTool? true:false}
                    >
                            <div slot="title">{title}</div>
                            <div slot="message">{message}</div>
                    </CalciteNotice>

                </CalciteBlock> : null
                }
                
                <div slot="footer-end" style={{display: "flex", gap: '20px'}}>
                <CalciteButton iconStart="reset" appearance="outline" onClick={() => {handleReset()}}>
                    Reset
                </CalciteButton>
            </div>

        </CalcitePanel>
    )
}

export default Select