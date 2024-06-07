import { ArcgisMap, ArcgisZoom } from "@arcgis/map-components-react"
import { useEffect, useRef, useState } from "react";
import UseAppContext from "../../contexts/AppContext";
import { createFeatureLayerFromGraphics, createFeatureLayerFromFeatures, removeLayer } from "../../arcgis/layers/layers";
import { theme } from "../../theme";
import MapButtonGroup from "../MapButtonGroup";
import { Box, Fade, Typography, IconButton } from "@mui/material";
import { TableRowsOutlined } from "@mui/icons-material";
import { config } from "../../data/config";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Query from "@arcgis/core/rest/support/Query.js";

const selectedParcelTitle = "Selected Parcel"
const webmapParcelLayerTitle = config.target_layer_name
const comparableParcelTitle = "Comparable Parcels"

const WebMapComponentBeta = () => {

    const { 
        searchFeatures,
        primaryResultFeature, 
        setPrimaryResultFeature,
        newSearch,
        setSearchResults,
        setMapView, 
        queryMapPoint, 
        comparableParcels, 
        setSecondaryResultFeature,
        secondaryResultFeature,
        screenWidth,
        panelWidgetVisible,
        translateText,
        setShowMapMoblie,
        searchSources,
        setMapViewScale,
        setCoordinates,
        selectMultiple,
        panelDisplay,
        setPanelDisplay,
        panelPrimaryVisible,
        setPanelPrimaryVisibility,
        setPanelDisplaySecondary,
        panelDisplayWidget
        } = UseAppContext()

    const arcgisMapRef = useRef(null)
    const [ mapLoading, setMapLoading ] = useState(true)
    const [ targetLayer, setTargetLayer ] = useState(null)
    const [ selectedParcelsPrimary, setSelectedParcelsPrimary ] = useState(null)
    const [ comparableParcelLayer, setComparableParcelLayer ] = useState(null)
    const [ hitTestLayers, setHitTestLayers ] = useState([])

    const zoomToExtent = async (features) => {

        let extent

        if(Array.isArray(features)){
            const geometries = features.map((feature) => feature.geometry);
            extent = geometryEngine.union(geometries);
        }

        else{
            if('geometry' in features){
                extent = features.geometry
            }
            else{
                console.log("zoom to extent: ", features)
                console.log("quering extent ")
                extent = await features.queryExtent()
            }
        }
        
        arcgisMapRef.current.goTo(extent)
    }

    const addLayerToMap = async (source, title, theme, type) => {

        console.log(`adding ${title} layer to map`)

        if(arcgisMapRef.current && mapLoading === false){

            let map = arcgisMapRef.current.map
            
            await removeLayer(map, title)

            if(title === "Comparable Parcels"){
                await removeLayer(map, "Selected Comparable Parcel")
            }
           

            if(source){
                let featLayer 
                if(type === "graphics"){
                    featLayer = await createFeatureLayerFromGraphics(source, "OBJECTID", "polygon", title, theme)
                }
                if(type === "features"){
                    featLayer = await createFeatureLayerFromFeatures(source, title, theme)
                }
                

                if(featLayer){

                    map.add(featLayer)
                    console.log(`Add ${title} to map: `, map)
                    //zoomToExtent(featLayer)
                }
                
            }

        }
    }


    const findTargetLayer = (map) => {

        let layer = map.allLayers.find((layer) => {
            //console.log("Layer details: ", layer)
            return `${layer.url}/${layer.layerId}` === config.target_layer_url
        })

        return layer
    }

    
    const findLayerByTitle = (map, title) => {

        let layer = map.allLayers.find((layer) => {
            //console.log("Layer details: ", layer)
            return layer.title === title
        })

        return layer
    }

    const featureExists = (features, value) => {
        return features.some(feature => feature.attributes[config.target_layer_unique_id] === value)
    }

    const fetchParcelAttributes = async (objectIds) => {

        console.log("objectIds: ", objectIds)
        let where = objectIds.join(',')

        let query = new Query({
            where: `OBJECTID IN (${where})`,
            outFields: ["*"],
            returnGeometry: true
        })

        let { features } = await targetLayer.queryFeatures(query)

        return features
    }

    const removeAllFeatures = async (layer) => {
        let { features } = await layer.queryFeatures()
        //console.log("features to remove: ", features)

        //add new primaryResultFeature to add features
        //if it is not null
        //add features from the selectedParcelsPrimary to delete features
        const addEdits = {
            deleteFeatures: features ?? []
        }

        //apply edits
        await layer.applyEdits(addEdits)
    }

    const addFeatures = async (results, multiple, typeIsFeature) => {

        let objectIds = []
        let addGraphics = []
        let features

        if(!typeIsFeature){
            results.map(result => {
                console.log("result being added: ", result)
                addGraphics.push(result.graphic)
                objectIds.push(result.graphic.attributes['OBJECTID'])
            })
        }
        
        else{
            addGraphics = results
        }
        

        const addEdits = {
            addFeatures: addGraphics,
        }

        if(!selectedParcelsPrimary){
            await createAndAddFeatureLayer(addGraphics, "graphics", selectedParcelTitle, theme.layers.primary)
        }

        else{
            await selectedParcelsPrimary.applyEdits(addEdits)
        }
        

        //fetch features for graphics to be added
        let fetchedFeatures = await fetchParcelAttributes(objectIds)

        //update state of primaryResultsFeature with fetched features
        if(multiple && primaryResultFeature){
            let existingFeatures = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
            features = [...fetchedFeatures, ...existingFeatures]
        }
        else{
            features = fetchedFeatures
        }
        setPrimaryResultFeature(features, false)
        setSearchResults(null, features)

        if(!panelDisplay || panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
        }
        
        return addGraphics
    }

    const removeFeatures = async (results) => {
        let objectIds = []
        let removeGraphics = []
        console.log("removing objectids: ", results)
        results.map(result => {
            removeGraphics.push(result.graphic)
            console.log("removing objectids: ", result.graphic.attributes['OBJECTID'])
            objectIds.push(result.graphic.attributes['OBJECTID'])
        })

        const addEdits = {
            deleteFeatures: removeGraphics
        }

        await selectedParcelsPrimary.applyEdits(addEdits)

        console.log("ObjectIds to remove: ", objectIds)
        let existingFeatures = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
        let updatedFeatures = existingFeatures.filter(feature => !objectIds.includes(feature.attributes['OBJECTID']))

        setPrimaryResultFeature(updatedFeatures, false)
        setSearchResults(null, updatedFeatures)

        if(!panelDisplay || panelDisplay !== "resultsList"){
            setPanelDisplay("resultsList")
        }
        
        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
        }

        return removeGraphics
    }

    const handleHitTest = async (event) => {
        //[v3.0.0-beta.3]

        console.log("onArcgisViewClick: ", event)

        //const view = event.target.view
        const view = arcgisMapRef.current.view

        const options = {
            include: hitTestLayers
        }

        const response = await view.hitTest(event.detail.screenPoint, options)

        if(!response) return;

        //set point coordinates
        let mapPoint = event.detail.mapPoint
        setCoordinates(mapPoint.x, mapPoint.y)

        if(response.results.length > 0){
            console.log("Hit Test Layers: ", hitTestLayers)
            console.log("onArcgisViewClick: hittest results ", response.results)

            //check if the clicked feature is a selected parcel
            let selectedGraphicsDetected = response.results.filter(result => result.graphic.layer.title === selectedParcelTitle)
            let selectedComparableDetected = response.results.filter(result => result.graphic.layer.title === comparableParcelTitle)
            
            //console.log("selectedGraphicsDetected: ", selectedGraphicsDetected)

            if(selectMultiple){
                //if select multiple === true
                //check if the hittest results include any previously selected layers

                if(selectedGraphicsDetected.length > 0){
                    console.log(`${selectedGraphicsDetected.length} Selected Parcels Detected`)
                    console.log(`Removing ${selectedGraphicsDetected.length} parcels`)

                    await removeFeatures(response.results)
                }
                else{
                    console.log(`${selectedGraphicsDetected.length} Selected Parcels Detected`)
                    console.log(`Adding ${response.results.length} parcels`)

                    await addFeatures(response.results, selectMultiple)
                    
                }
            }
            else{
                //if user clicks on a comparable parcel
                //set selectedComparableParcels (setSecondaryResultFeature)
                //update the secondary panel to display comparable parcel details
                if(selectedComparableDetected?.length > 0){

                    // console.log("comparable parcel layer clicked")
                    const clickedParcel = response.results.filter(result => [webmapParcelLayerTitle, comparableParcelLayer].includes(result.graphic.layer.title) )


                    console.log("comparable parcel selected: ", selectedComparableDetected)
                    console.log("comparable parcels: ", comparableParcels)

                    const clickedParcelObjIds = clickedParcel.map(parcel => parcel.graphic.attributes['OBJECTID'])

                    const showParcelDetail = comparableParcels.filter(feature => clickedParcelObjIds.includes(feature.attributes["OBJECTID"]))

                    if(showParcelDetail.length > 0){
                        setSecondaryResultFeature(showParcelDetail)
                        setPanelDisplaySecondary("propertyDetailNearby")
                    }


                }
                else if (selectedParcelsPrimary && selectedComparableDetected.length === 0){

                    if(selectedGraphicsDetected.length === 0){
                        console.log("selected parcels not clicked")
                        await removeAllFeatures(selectedParcelsPrimary)
                        await addFeatures(response.results)
                        //setCoordinates(mapPoint.x, mapPoint.y)
                    }

                    else{
                        //select primary search parcel detected
                        const clickedParcel = response.results.filter(result => [webmapParcelLayerTitle, selectedParcelTitle].includes(result.graphic.layer.title) )
                        console.log("display parcel details: ", clickedParcel)

                        const clickedParcelObjIds = clickedParcel.map(parcel => parcel.graphic.attributes['OBJECTID'])

                        console.log("clickedParcelObjId ", clickedParcelObjIds)

                        const showParcelDetail = searchFeatures.filter(feature => clickedParcelObjIds.includes(feature.attributes["OBJECTID"]))
                        
                        console.log("showParcelDetail: ", showParcelDetail)

                        if(showParcelDetail.length > 0){
                            setPrimaryResultFeature(showParcelDetail, false)
                            setPanelDisplay("propertyDetail")
                        }
                    }  
                }

                else if(!selectedParcelsPrimary && selectedComparableDetected.length === 0){
                    await addFeatures(response.results)
                    //setCoordinates(mapPoint.x, mapPoint.y)
                }
                
            }
            
        }
        
    }

    const handleClick = () => {
        console.log("Setting secondary panel display")
        setShowMapMoblie( false)
    }

    const setInitalHitTestLayers = async (layer) => {

        console.log("setInitalHitTestLayers")
        //update targetLayer state with parcel layer
        setTargetLayer(layer)
        //update hittest list layers with parcel layer
        //to apply the user to select/deselect layers from the 
        //web map
        setHitTestLayers([layer])
    } 
    
    const createAndAddFeatureLayer = async (source, sourceType, title, style) => {

        await addLayerToMap(source, title, style, sourceType)

        //get the layer object
        let layer = findLayerByTitle(arcgisMapRef.current.map, title)

        //set the selectedParcelsPrimary state to the layer
        if(title === selectedParcelTitle){
            setSelectedParcelsPrimary(layer)
        }
        else if(title === comparableParcelTitle){
            setComparableParcelLayer(layer)
        }
        

        await updateHitTestLayers(layer)
    }

    const updateHitTestLayers = async (layer) => {

        console.log("updateHitTestLayers")
        //add the layer to the hittest array
        let newHitTestLayers = [ ...hitTestLayers, layer]
                
        console.log("hittest layers: ", newHitTestLayers)

        //update the state of the hittest layers
        setHitTestLayers(newHitTestLayers)
    }


    useEffect(() => {

        const configureWebMap = async () => {
            if(arcgisMapRef && mapLoading === false && searchSources){
                //console.log("loading new map: ", arcgisMapRef.current.view)
    
                let view = arcgisMapRef.current.view
                view.constraints = {
                    rotationEnabled: false
                }
                
                if(screenWidth < theme.breakpoints.values.md){
                    view.ui.move("zoom", "bottom-right")
                }
    
                else{
                    view.ui.move("zoom", "top-right")
                }
                
                //v3.0.0-beta.3 find target layer (Parcel Current)
                let map = arcgisMapRef.current.map
                let layer = await findTargetLayer(map)

                await setInitalHitTestLayers(layer)
            }
        }

        configureWebMap()
        

    }, [arcgisMapRef, mapLoading, screenWidth, searchSources])

    useEffect(() => {

        const displayPrimaryResultFeature = async () => {

            if(arcgisMapRef.current && !mapLoading && targetLayer){

                if(!selectedParcelsPrimary && primaryResultFeature){
                    //if selecetd parcels primary layer does not exist create it from the
                    await createAndAddFeatureLayer(primaryResultFeature, "features", selectedParcelTitle, theme.layers.primary)

                    zoomToExtent(primaryResultFeature)
                }

                else if(selectedParcelsPrimary && newSearch){
                    //get features from primaryResultFeature and add them to the selectedParcelsPrimary layer
                    //clear existing features from the selectedParcelsPrimaryLayer
                    await removeAllFeatures(selectedParcelsPrimary)

                    if(primaryResultFeature && selectedParcelsPrimary){
                        //add new primaryResultFeature to add features
                        let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
                        // //if it is not null
                        // //add features from the selectedParcelsPrimary to delete features
                        const addEdits = {
                            addFeatures: features ?? [],
                        }

                        // //apply edits
                        await selectedParcelsPrimary.applyEdits(addEdits)
                    }
                
                }

                else if(!primaryResultFeature && selectedParcelsPrimary){
                    console.log("clearing primary parcel selection")
                    await removeAllFeatures(selectedParcelsPrimary) 
                }

                //if primaryResultFeature is not null then zoom to newly added features
                if(primaryResultFeature){
                    zoomToExtent(primaryResultFeature)
                }
            }
        }

        
    displayPrimaryResultFeature()

    }, [ primaryResultFeature, newSearch, arcgisMapRef, mapLoading, targetLayer ])

    useEffect(() => {
        
        console.log("comparable parcels use effect triggereed: ", comparableParcels)
        console.log("comparable parcels layer : ", comparableParcelLayer)
        //addLayerToMap(comparableParcels, "Comparable Parcels", theme.layers.secondary, "features")
        const displayComparableParcels = async () => {

            if(arcgisMapRef.current){

                if(!comparableParcelLayer && comparableParcels){
                    //if comparable parcel layer does not exist create it from array of features
                    await createAndAddFeatureLayer(comparableParcels, "features", comparableParcelTitle, theme.layers.secondary)

                    //const primaryFeaturesArray = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
                    //const zoomFeatures = [...primaryFeaturesArray, ...comparableParcels]
                    zoomToExtent(comparableParcels)
                }

                else if(comparableParcelLayer && (!comparableParcels || comparableParcelLayer?.length === 0)){
                    await removeAllFeatures(comparableParcelLayer)
                }

                else if(comparableParcelLayer && comparableParcels){

                    console.log("Adding comparable features to map")
                    const addEdits = {
                        addFeatures: comparableParcels,
                    }

                    comparableParcelLayer.applyEdits(addEdits)

                    //const primaryFeaturesArray = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
                    //const zoomFeatures = [...primaryFeaturesArray, ...comparableParcels]
                    zoomToExtent(comparableParcels)
                }
            }

        }

        displayComparableParcels()

    }, [ comparableParcels, arcgisMapRef])

    useEffect(() => {

        addLayerToMap(secondaryResultFeature, "Selected Comparable Parcel", theme.layers.secondarySelected, "features")

    }, [ secondaryResultFeature, arcgisMapRef, mapLoading ])

    useEffect(() => {
        const removeAllGraphics = () => {
            if(arcgisMapRef.current?.map){
                const isMeasure = panelDisplayWidget === "measure"
                const isSelect = panelDisplayWidget === "sketch"
                const map = arcgisMapRef.current.map
    
                if(!isSelect || !panelWidgetVisible){
                    //remove all select graphics
    
                    const foundGraphic = findLayerByTitle(map,"selectGraphic")
                    
                    if(foundGraphic){
                        foundGraphic.removeAll()
                    }
                    
                    
                }
            }

            
        }

        removeAllGraphics()

    }, [panelDisplayWidget, panelWidgetVisible, arcgisMapRef.current])
   
    return(
        <Box
        display="flex"
        width="100%"
        height="100%"
        justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"}
        >
        <ArcgisMap
        ref={arcgisMapRef}
        itemId="779a9643c58f4a48a002a9b277a8bcc7"

        onArcgisViewReadyChange={(event) => {
            console.log('MapView ready', event);
            setMapLoading(false)
            setMapView(event.target.view)
            }}
        onArcgisViewChange={(event) => {
            //console.log("view change: ", event)
            //setMapViewScale(event.target.view)
        }}
        onArcgisViewClick={(event) => {
            
            if(event.detail.native.button === 2){
                console.log("onArcgisViewClick: right click, button =", event.detail.native.button)
            }
            else{
                console.log("onArcgisViewClick: left click, button =", event.detail.native.button)
                // handleViewClick(event.detail.mapPoint)
                handleHitTest(event)
            }
        }}
        // onArcgisViewPointerMove={}


        >   
        </ArcgisMap>
        <Box 
            id="mapButtonGroup"
            // justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"} 
            position="absolute" 
            pt={2}
            pl={screenWidth < theme.breakpoints.values.md ? 0 : 2}
            zIndex={2}
            sx={{boxSizing:"border-box"}}
            height="auto"
            width="auto"
            >
                <MapButtonGroup/>
            </Box>

            <Fade 
                appear
                in={!panelWidgetVisible}>
                    <IconButton 
                    onClick={handleClick}
                    sx={{
                        position: "absolute",
                        bgcolor:theme.palette.primary.main, 
                        zIndex:"modal",
                        display:!panelWidgetVisible && screenWidth <= theme.breakpoints.values.sm ? "flex" : "none",
                        width:50,
                        height:50,
                        flexDirection:"column",
                        bottom:20,
                        boxShadow:5
                        }}>
                        <TableRowsOutlined htmlColor="white"/>
                        <Typography variant="subtitle1" color="white">{translateText("Data")}</Typography>
                    </IconButton>
                </Fade>
        </Box>
        

    )
}

export default WebMapComponentBeta