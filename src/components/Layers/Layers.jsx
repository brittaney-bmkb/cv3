import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-layer-list";

const Layers = () => {

    const { layersPanelClosed, setLayersPanel, translateText, arcgisMapRef } = UseAppContext()
    
    //console.log("map view: ", arcgisMapRef.current)
    return(
        <CalcitePanel
        closed={layersPanelClosed}
        closable
        heading={translateText("Layers")}
        style={{display: layersPanelClosed ? 'none': 'flex'}}
        onCalcitePanelClose={() => {
            setLayersPanel(true)
        }}
        >
            {
                arcgisMapRef.current ? 
                <CalciteBlock
                open
                heading="Add a layer to the map"
                description={translateText("Toggle layers to show/hide them in the map")}
                style={{height: '95%', overflow:'clip'}}
                >   
                <arcgis-layer-list
                referenceElement={arcgisMapRef.current}
                visibilityAppearance="checkbox"
                showFilter
                filterPlaceholder={translateText("Search for layers")}
                />
            </CalciteBlock> : null
            }
            

        </CalcitePanel>
    )
}

export default Layers