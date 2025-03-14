import "@arcgis/map-components/components/arcgis-sketch";

import { CalciteBlock, CalciteButton, CalciteNotice, CalcitePanel } from "@esri/calcite-components-react";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import * as intersectsOperator from "@arcgis/core/geometry/operators/intersectsOperator.js";
import "@esri/calcite-components/components/calcite-notice"
import { config } from "../../data/config";

const Select = () => {

    const {  deselectParcel, selectPanelClosed, setSelectPanel, translateText, arcgisMapRef, queryPolygon, clearResults, primaryResultFeature } = UseAppContext()
    
    const sketchRef = useRef(null)
    const graphicsLayer = useRef(null)

    const [activeTool, setActiveTool] = useState(null)
    const [ mapClicks, setMapClicks ] = useState(null)
    const [ deselectPins, setDeselectPins ] = useState(null)

 
    const handleClickSelection = async (event) => {
        console.log("click selection");
        if (activeTool !== "cursor") return; // Ensure we're using the cursor tool
    
        let mapPoint = event.detail.mapPoint;

        //check if mapPoint interects with an existing selected feature
        //console.log("selected parcels: ", selectedFeatures)
        if(!primaryResultFeature|| primaryResultFeature.length === 0){
            console.log("primaryResultFeature does not exist, adding initial selected parcel")
            const features = await queryPolygon(mapPoint)
            return
        }
        else{
            setMapClicks(mapPoint)

            // if (deselectPins.length === 0) {
            //     console.log("Adding Parcel");
            //     const features = await queryPolygon(mapPoint)
            //     primaryResultRef.current = [...primaryResultRef.current, ...features];
            //     console.log("selected Parcels: ", primaryResultRef.current)
            // } else {
            //     console.log("Removing Parcel", deselectPins);

            //     // Ensure the parcel actually exists in state before attempting to remove
            //     if (primaryResultRef.current.some(f => deselectPins.includes(f.attributes[config.target_layer_id_field]))) {
            //         const filteredParcels = await deselectParcel(deselectPins);
            //         primaryResultRef.current = filteredParcels;

            //     } else {
            //         console.log("Parcel already removed, skipping deselect.");
            //     }
            // } 
            }
        
    };

    useEffect(() => {

        const handleSelectParcels = async () => {
            if(mapClicks){
                // Find features that intersect with the clicked point
                let deselectPins = primaryResultFeature
                .filter(feature => intersectsOperator.execute(mapClicks, feature.geometry))
                .map(feature => feature.attributes[config.target_layer_id_field]);

                console.log("Pins to deselect: ", deselectPins)

                if(deselectPins.length === 0){
                    const features = await queryPolygon(mapClicks)  
                }
                else{
                    setDeselectPins(deselectPins)
                }
            }
        }

        handleSelectParcels()

    }, [mapClicks])


    useEffect(() => {

        const handleDeselectParcels = async () => {
            if(deselectPins && deselectPins.length > 0){
                const features = await deselectParcel(deselectPins); 
            }
        }

        handleDeselectParcels()

    }, [deselectPins])


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
    
        await queryPolygon(queryGeometry, true);
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