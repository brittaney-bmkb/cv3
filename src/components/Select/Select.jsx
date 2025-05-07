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

    const [activeTool, setActiveTool] = useState(null)
    const [activeIcon, setActiveIcon] = useState(null)
    const [ title, setTitle ] = useState("")
    const [ message, setMessage ] = useState("")

    useEffect(() => {

        if(selectPanelClosed && sketchRef.current){
            sketchRef.current.cancel()
            selectedFeatures.current = []
        }

    }, [selectPanelClosed])

 
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

    const getSelectionTip = async (tool) => {

        console.log("setting active tool: ", tool)

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
                message: translateText("Click on an individual parcel to select it. You can click multiple parcels to add to your selection. Deselect by clicking on a selected parcel."),
            };
        }
        return { title: "", message: "" }; // Default empty state
    };
    

    useEffect(() => {

        const updateHelp = async () => {

            const { title, message } = await getSelectionTip(activeTool);

            setTitle(title)
            setMessage(message)
        }
        
        updateHelp();

    }, [activeTool])


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
                    onarcgisReady = {(e) => {
                        console.log("ready event", e )
                    }}
                    onarcgisPropertyChange = {(e) => {
                        console.log("property change: ", e)
                        if(e.target.state=== "active"){
                            setActiveTool(e.target.activeTool)
                        }
                        if(e.target.state=== "ready" && !e.target.activeTool){
                            setActiveTool("cursor")
                        }
                    }
                    }
                    // onarcgisUpdate = {(e) => {
                    //     console.log("update event: ", e)
                    // }}

                    onarcgisCreate = { (e) => {
                        //console.log("create event", e )
                        if(e.detail.state === "complete"){
                            handleSelection(e)
                        }
                        
                    }}
                    referenceElement={arcgisMapRef.current}
                    hideCreateToolsPoint
                    hideCreateToolsCircle
                    hideCreateToolsPolyline
                    hideDuplicateButton
                    hideLabelsToggle
                    hideCustomSelectionTool
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