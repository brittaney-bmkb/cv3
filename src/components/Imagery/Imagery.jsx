import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource.js";
import { CalciteAction, CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import { config } from "../../data/config";
import { useEffect, useRef, useState } from "react";

    

const Imagery = () => {

    const { imageryPanelClosed, setImageryPanel, translateText, arcgisMapRef, language } = UseAppContext()

    const basemapRef = useRef(null)
    const [source, setSource] = useState(null)



    useEffect(() => {
        if(!arcgisMapRef.current) return;

        if(!basemapRef.current) return;

        console.log("Imagery component mounted, arcgisMapRef: ", arcgisMapRef.current)
        
        const basemapSource = new PortalBasemapsSource({
        portal: config.portal,
        query: {
            id: config.basemap_group_id
        },
        updateBasemapsCallback: async (basemaps) => {
            
            // Update the label of the basemap gallery
            for (const basemap of basemaps) {
                await basemap.load()
                console.log("Basemap title: ", basemap.title)
                basemap.title = translateText(basemap.title);

            }

            console.log("Basemaps updated: ", basemaps)
            return basemaps;    
            }
        }) 

        basemapRef.current.souce = basemapSource
        setSource(basemapSource)


    }, [arcgisMapRef.current, language, basemapRef.current])

    return(
        <CalcitePanel
        id="imagery-panel"
        closed={imageryPanelClosed}
        closable
        heading={translateText("Imagery")}
        style={{display: imageryPanelClosed ? 'none': 'flex'}}
        onCalcitePanelClose={() => {
            setImageryPanel(true)
        }}
        >
        <CalciteAction 
            slot="header-actions-start" 
            icon="question" 
            text="help" 
            onClick={() => {
                window.open(`${config.hub_site_url_resources}#${config.hub_site_resources_bookmarks["imagery"]}`, '_blank')
            }}>
        </CalciteAction>  
            {
                arcgisMapRef.current ? 
                <CalciteBlock
                open
                heading={translateText("Add aerial imagery to the map")}
                description={translateText("Toggle between aerial imagery and basemaps to update the map.")}
                // "Select a basemap from the options below to update the map"
                //style={{height: '95%', overflow:'clip'}}
                >   
                <arcgis-basemap-gallery
                ref={basemapRef}
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