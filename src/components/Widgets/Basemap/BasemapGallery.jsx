import { ArcgisBasemapGallery } from "@arcgis/map-components-react"
import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource.js";
import { useEffect, useRef, useState } from "react"
import { config } from "../../../data/config";
import UseAppContext from "../../../contexts/AppContext";
import { Box } from "@mui/material";

const BasemapGallery = () => {

    const basemapGalleryRef = useRef(null)
    const { mapView } = UseAppContext()

    const source = new PortalBasemapsSource({
        portal: config.portal,
        query: {
            id: config.basemap_group_id
        }
    }) 

    useEffect(() => {

        const configureBasemapGallery = () => {
            if(basemapGalleryRef.current && mapView){

                const basemapGallery = basemapGalleryRef.current

                if(!basemapGallery.view){
                    console.log("configuring basemap gallery view: ", basemapGallery)
                    basemapGallery.view = mapView
                }
            }
        }

        configureBasemapGallery()

    }, [basemapGalleryRef, mapView])

    return(
        <ArcgisBasemapGallery
            ref={basemapGalleryRef}
            source = {source}
        />
    )
}

export default BasemapGallery