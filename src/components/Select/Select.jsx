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

    const {  
        deselectParcel, 
        selectPanelClosed, 
        setSelectPanel, 
        translateText, 
        arcgisMapRef, 
        queryPolygon, 
        clearResults, 
        primaryResultFeature,
        propertyDetailPanelClosed,
        searchFeatures,
        togglePanel, 
        setSearchResults,
        searchTerm
     } = UseAppContext()
    
    const sketchRef = useRef(null)
    const graphicsLayer = useRef(null)
    const selectedFeatures = useRef([])

    const [activeTool, setActiveTool] = useState("cursor")
    const [ mapClicks, setMapClicks ] = useState(null)
    const [ selectedParcels, setSelectedParcels ] = useState(primaryResultFeature)
    const [ deselectPins, setDeselectPins ] = useState(null)

    const primaryResultFeatureRef = useRef(primaryResultFeature);

    useEffect(() => {
    primaryResultFeatureRef.current = primaryResultFeature;
    }, [primaryResultFeature]);


    useEffect(() => {

        if(selectPanelClosed && sketchRef.current){
            sketchRef.current.cancel()
            selectedFeatures.current = []
        }

    }, [selectPanelClosed])

 
    const handleClickSelection = async (event) => {
        console.log("click selection");
    
        if (activeTool !== "cursor") return;
    
        const mapPoint = event.detail.mapPoint;
        setMapClicks(mapPoint);
    
        let deselectPins = [];
        if (searchFeatures?.length > 0) {
            deselectPins = searchFeatures
                .filter(feature => intersectsOperator.execute(mapPoint, feature.geometry))
                .map(feature => feature.attributes[config.target_layer_id_field]);
        }
    
        if (deselectPins.length === 0) {
            console.log("queryPolygon Search Features: ", searchFeatures)
            console.log("queryPolygon local state: ", selectedFeatures.current)
            const features = await queryPolygon(mapPoint, false);

            //update selectedFeatures

            if(selectedFeatures.current){
                selectedFeatures.current = searchFeatures ? searchFeatures : []
                selectedFeatures.current.push(features)
            }
           



            console.log("queryPolygon local state Updated: ", selectedFeatures.current)

            //setSearchResults(null, selectedFeatures.current, searchTerm, selectedFeatures.current)
        //     selectedFeatures.current = [
        //         ...searchFeatures,
        //         ...features]
        //     //setSearchResults(null, features, searchTerm, features)
        //     setSearchResults(selectedFeatures.current);
        //     console.log("queryPolygon selectedFeatures.current ", selectedFeatures.current);
        }
    
        console.log("Pins to deselect: ", deselectPins);
    };
    

    // useEffect(() => {

    //     const handleDeselectParcels = async () => {
    //         if(deselectPins && deselectPins.length > 0){
    //             const features = await deselectParcel(deselectPins); 
    //             setSelectedParcels(features)
    //         }
    //     }

    //     handleDeselectParcels()

    // }, [deselectPins])


    // useEffect(() => {

    //     console.log("watching for map clicks")
    //     const mapElement = arcgisMapRef.current;
    //     if (!mapElement) return;

    //     if(selectPanelClosed) return;

    //     // Attach event listener for clicking on parcels
    //     mapElement.addEventListener("arcgisViewClick", handleClickSelection);

    //     return () => {
    //         // Cleanup event listener when component unmounts or tool changes
    //         mapElement.removeEventListener("arcgisViewClick", handleClickSelection);
    //     };
    // }, [activeTool, arcgisMapRef, selectPanelClosed]);

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
    
        let features = await queryPolygon(queryGeometry, true);
        graphicsLayer.current.removeAll();

        //turn on property detail panel if its not already on
        if(propertyDetailPanelClosed && features?.length === 1){
            togglePanel('property')
        }
        else{
            togglePanel('search')
        }

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