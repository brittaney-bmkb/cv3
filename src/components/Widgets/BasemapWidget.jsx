import { Box } from "@mui/material"
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef } from "react";
import { view } from "../../arcgis/webmap/webmap";
import { config } from "../../data/config";
import Portal from "@arcgis/core/portal/Portal.js";


// this lifted from comparable property search and will needed to be updated for this widget
const BasemapWidget = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()
    const basemapDiv = useRef()
    const basemapWidget = useRef()

    useEffect(() => {
        
        const initializeBasemap = () => {
            if(basemapDiv.current){
                if(!basemapWidget.current){
                    basemapWidget.current = new BasemapGallery({
                        view: view,
                        container: basemapDiv.current,
                        source: new Portal({url: config.portal})
                    })
                }
            }
        }

        initializeBasemap();
        
    
    },[view, basemapWidget, basemapDiv])

    return(
        <Box 
        ref={basemapDiv} 
        display="flex" 
        flex={1}
        overflow={"scroll"}
  
        >
        </Box>
        
    )
}

export default BasemapWidget