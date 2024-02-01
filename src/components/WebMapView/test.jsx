import React, { useEffect, useRef } from "react";
import UseAppContext from "../../contexts/AppContext";
import { createBaseMap, createFeatureLayers } from "../../arcgis/layers/layers";
import { createSearchSources } from "../../arcgis/search/searchSources";
import { config } from "../../data/config";
import Query from "@arcgis/core/rest/support/Query.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";

export default function WebMapView() {
    const { setMapContainer, mapContainer, setMapView, viewClickEventHandler } = UseAppContext();
    const mapDiv = useRef(null);

    useEffect(() => {
        const createMap = async () => {
            if (mapDiv.current) {
                await setMapContainer(mapDiv.current);
            }
        };

        createMap();

    }, [mapDiv]);

    useEffect(() => {
        const createMapView = async () => {
            if (mapContainer) {
                const map = new Map();
                const view = new MapView({
                    map,
                    center: [-87.8298, 41.8781],
                    zoom: 8,
                    container: mapContainer
                });

                // Set the map view in the context
                setMapView(view);

                // Load additional map configurations, layers, etc.
                const basemap = await createBaseMap();
                map.basemap = basemap;

                const namedLayers = await createFeatureLayers(map);
                const searchSources = await createSearchSources(namedLayers);

                // Additional configurations...

                // Event listener for map click
                view.on("click", viewClickEventHandler);
            }
        };

        createMapView();

    }, []);

    return (
        <div id="MAPCONTAINER" ref={mapDiv} style={{ width: '100%', height: '100%' }}></div>
    );
}
