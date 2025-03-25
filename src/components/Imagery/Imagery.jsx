import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource.js";
import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import { config } from "../../data/config";

const Imagery = () => {

    const { imageryPanelClosed, setImageryPanel, translateText, arcgisMapRef } = UseAppContext()
    
    const source = new PortalBasemapsSource({
        portal: config.portal,
        query: {
            id: config.basemap_group_id
        }
    }) 

    return(
        <CalcitePanel
        closed={imageryPanelClosed}
        closable
        heading={translateText("Imagery")}
        style={{display: imageryPanelClosed ? 'none': 'flex'}}
        onCalcitePanelClose={() => {
            setImageryPanel(true)
        }}
        >
            {
                arcgisMapRef.current ? 
                <CalciteBlock
                open
                heading="Add aerial imagery to the map"
                description={translateText("Toggle aerial imagery yada yada yada to show/hide them in the map")}
                //style={{height: '95%', overflow:'clip'}}
                >   
                <arcgis-basemap-gallery
                referenceElement={arcgisMapRef.current}
                source={source}
                style={{overflow:'auto', height: '100%'}}
                />
            </CalciteBlock> : null
            }
            

        </CalcitePanel>
    )
}

export default Imagery