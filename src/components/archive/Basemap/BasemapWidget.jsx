import { Box } from "@mui/material"
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";

import { useEffect, useRef } from "react";
import { config } from "../../../data/config";
import Portal from "@arcgis/core/portal/Portal.js";
import UseAppContext from "../../../contexts/AppContext";


// this lifted from comparable property search and will needed to be updated for this widget
const BasemapWidget = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary, mapView } = UseAppContext()
    const basemapDiv = useRef()
    const basemapWidget = useRef()

    useEffect(() => {
        
        const initializeBasemap = () => {
            if(basemapDiv.current){
                if(!basemapWidget.current){
                    basemapWidget.current = new BasemapGallery({
                        view: mapView,
                        container: basemapDiv.current,
                        source: {
                                    portal: config.portal,
                                    query: {
                                    id: config.basemap_group_id
                                    }
                                }
                    })
                }
            }
        }

        initializeBasemap();
        
    
    },[mapView, basemapWidget, basemapDiv])

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