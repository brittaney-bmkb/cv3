import { useEffect, useRef, useState } from "react";
import UseAppContext from "../../contexts/AppContext";
import { createFeatureLayerFromGraphics, createFeatureLayerFromFeatures, removeLayer, createGraphic } from "../../arcgis/layers/layers";
import { theme } from "../../theme";
import MapButtonGroup from "../MapButtonGroup";
import { Box, Fade, Typography, IconButton } from "@mui/material";
import { TableRowsOutlined } from "@mui/icons-material";
import { config } from "../../data/config";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Query from "@arcgis/core/rest/support/Query.js";
import { useSearchParams } from "react-router-dom";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const selectedParcelTitle = "Selected Parcel"
const webmapParcelLayerTitle = config.target_layer_name
const comparableParcelTitle = "Comparable Parcels"
const selectedComparableParcelTitle = "Selected Comparable Parcels"

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";

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
        panelSecondaryVisible,
        panelPrimaryVisible,
        setPanelPrimaryVisibility,
        setPanelSecondaryVisibility,
        setPanelDisplaySecondary,
        panelDisplaySecondary,
        setComparableParcels,
        panelDisplayWidget,
        comparableType, 
        measureWidgetState,
        measureWidget,
        returnSearchParam,
        searchBufferGeometry,
        searchResultPoint,
        setSearchBufferGeometry,
        anyAttributesIncluded,
        setPropertyDetailPanel,
        togglePanel,
        arcgisMapRef
        } = UseAppContext()

    //const arcgisMapRef = useRef(null)
    const [ mapLoading, setMapLoading ] = useState(true)
    const [ targetLayer, setTargetLayer ] = useState(null)
    const [ selectedParcelsPrimary, setSelectedParcelsPrimary ] = useState(null)
    const [ comparableParcelLayer, setComparableParcelLayer ] = useState(null)
    const [ selectedComparableParcelLayer, setSelectedComparableParcelLayer ] = useState(null)
    const [ bufferGraphicsLayer, setBufferGraphicsLayer ] = useState(null)
    const [ hitTestLayers, setHitTestLayers ] = useState([])
    const [routeParams, setSearchParams] = useSearchParams();

    const zoomToExtent = async (features) => {

        let extent

        if(Array.isArray(features)){
            const geometries = features.map((feature) => feature.geometry);
            console.log("geometries: ", geometries)
            if(geometries?.length > 0){
                extent = geometryEngine.union(geometries);
            }
            
        }

        else{
            if('geometry' in features){
                extent = features.geometry
            }
            else{
                ////console.log("zoom to extent: ", features)
                ////console.log("quering extent ")
                extent = await features.queryExtent()
            }
        }
        
        if(extent){
            arcgisMapRef.current.goTo(extent)
        }
        
    }

    const addLayerToMap = async (source, title, theme, type) => {

        ////console.log(`adding ${title} layer to map`)

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
                    ////console.log(`Add ${title} to map: `, map)
                    //zoomToExtent(featLayer)
                }
                
            }

        }
    }

    const clearComparableParcels = async () => {

        //clear comparables from map when primary selected parcel changes
        if(selectedComparableParcelLayer){
            await removeAllFeatures(selectedComparableParcelLayer)
            setComparableParcels(null)
            if(panelSecondaryVisible === true && ["propertyDetailNearby","propertyDetailComparable","resultsListNearby","resultsListComparables","nearbyProperties","comparablePropertySearch"].includes(panelDisplaySecondary)){
                setPanelSecondaryVisibility(false)
            }
        }

        if(comparableParcelLayer){
            await removeAllFeatures(comparableParcelLayer)
        }
    }

    const findTargetLayer = (map) => {

        let layer = map.allLayers.find((layer) => {
            //////console.log("Layer details: ", layer)
            return `${layer.url}/${layer.layerId}` === config.target_layer_url
        })

        return layer
    }

    
    const findLayerByTitle = (map, title) => {

        let layer = map.allLayers.find((layer) => {
            //////console.log("Layer details: ", layer)
            return layer.title === title
        })

        return layer
    }


    const fetchParcelAttributes = async (objectIds) => {

        ////console.log("objectIds: ", objectIds)
        let where = objectIds.join(',')

        let query = new Query({
            where: `OBJECTID IN (${where})`,
            outFields: ["*"],
            returnGeometry: true
        })

        let { features } = await targetLayer.queryFeatures(query)

        return features
    }

    const removeAllFeatures = async (layer, where) => {

        let query;

        if(where){
            query = new Query({
                where: where
            })
        }
        let { features } = query ? await layer.queryFeatures(query) : await layer.queryFeatures()
        //////console.log("features to remove: ", features)

        //add new primaryResultFeature to add features
        //if it is not null
        //add features from the selectedParcelsPrimary to delete features
        const addEdits = {
            deleteFeatures: features ?? []
        }

        //apply edits
        await layer.applyEdits(addEdits)

        // //const param = await returnSearchParam(updatedFeatures)
        // console.log("Removing all search parameters")
        // setSearchParams({})
        
    }

    const addFeatures = async (results, multiple, typeIsFeature) => {

        let objectIds = []
        let addGraphics = []
        let features

        if(!typeIsFeature){
            results.map(result => {
                //////console.log("result being added: ", result)
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
        
        //trigger clearing of searchBuffer Geometry when 
        //user user updates selected parcels
        setSearchBufferGeometry(null, null)
        setPrimaryResultFeature(features, false)
        setSearchResults(null, features, null, features)

        console.log("adding URL parameters for select multiple - click tool")
        const param = await returnSearchParam(features)
        setSearchParams(param)

        // if(!panelDisplay || panelDisplay !== "resultsList"){
        //     setPanelDisplay("resultsList")
        // }
        
        // if(!panelPrimaryVisible || panelPrimaryVisible === false){
        //     setPanelPrimaryVisibility(true)
        // }


        togglePanel('search')
        
        return addGraphics
    }

    const removeFeatures = async (results) => {
        let objectIds = []
        let removeGraphics = []
        ////console.log("removing objectids: ", results)

        results.map(result => {
            removeGraphics.push(result.graphic)
            ////console.log("removing objectids: ", result.graphic.attributes['OBJECTID'])
            objectIds.push(result.graphic.attributes['OBJECTID'])
        })

        const addEdits = {
            deleteFeatures: removeGraphics
        }

        await selectedParcelsPrimary.applyEdits(addEdits)

        ////console.log("ObjectIds to remove: ", objectIds)
        let existingFeatures = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
        let updatedFeatures = existingFeatures.filter(feature => !objectIds.includes(feature.attributes['OBJECTID']))

        setPrimaryResultFeature(updatedFeatures, false)
        setSearchResults(null, updatedFeatures, null, updatedFeatures)

        console.log("removing URL parameters for select multiple - click tool")
        const param = await returnSearchParam(updatedFeatures)
        setSearchParams(param)

        // if(!panelDisplay || panelDisplay !== "resultsList"){
        //     setPanelDisplay("resultsList")
        // }
        
        // if(!panelPrimaryVisible || panelPrimaryVisible === false){
        //     setPanelPrimaryVisibility(true)
        // }

        togglePanel('search')

        return removeGraphics
    }

    const handleHitTest = async (event) => {
        //[v3.0.0-beta.3]

        ////console.log("onArcgisViewClick: ", event)

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
            ////console.log("Hit Test Layers: ", hitTestLayers)
            ////console.log("onArcgisViewClick: hittest results ", response.results)

            //check if the clicked feature is a selected parcel
            let selectedGraphicsDetected = response.results.filter(result => result.graphic.layer.title === selectedParcelTitle)
            let selectedComparableDetected = response.results.filter(result => result.graphic.layer.title === comparableParcelTitle)
            
            //////console.log("selectedGraphicsDetected: ", selectedGraphicsDetected)

            if(selectMultiple){
                //if select multiple === true
                //check if the hittest results include any previously selected layers
                
                if(selectedGraphicsDetected.length > 0){
                    ////console.log(`${selectedGraphicsDetected.length} Selected Parcels Detected`)
                    ////console.log(`Removing ${selectedGraphicsDetected.length} parcels`)

                    await removeFeatures(response.results)

                    //clear comparables from map when primary selected parcel changes
                    clearComparableParcels()
                } else {
                    ////console.log(`${selectedGraphicsDetected.length} Selected Parcels Detected`)
                    ////console.log(`Adding ${response.results.length} parcels`)

                    await addFeatures(response.results, selectMultiple)

                    //clear comparables from map when primary selected parcel changes
                    clearComparableParcels()
                    
                }
            } else if (measureWidgetState){
                // FOR MEASURE widget only
                // need to make sure if a parcel is selected it doesn't remove it while measuring. 
                // One selected parcel is OK. 
                if(selectedGraphicsDetected.length > 1){
                    await removeFeatures(response.results)
                    //// NOT NEEDED!? but needs futher testing for measureWidgetState
                    //// clear comparables from map when primary selected parcel changes 
                    // clearComparableParcels()
                }
            } else {
                //if user clicks on a comparable parcel
                //set selectedComparableParcels (setSecondaryResultFeature)
                //update the secondary panel to display comparable parcel details
                if(selectedComparableDetected?.length > 0){

                    // ////console.log("comparable parcel layer clicked")
                    const clickedParcel = response.results

                    ////console.log("comparable parcel selected: ", selectedComparableDetected)
                    //////console.log("comparable parcels: ", comparableParcels)

                    const clickedParcelObjIds = clickedParcel.map(parcel => parcel.graphic.attributes['OBJECTID'])

                    const showParcelDetail = comparableParcels.filter(feature => clickedParcelObjIds.includes(feature.attributes["OBJECTID"]))

                    ////console.log("showPArcelDetail: ", showParcelDetail)
                    if(showParcelDetail.length > 0){
                        setSecondaryResultFeature(showParcelDetail)
                        setPanelDisplaySecondary(comparableType === "nearby" ? "propertyDetailNearby": "propertyDetailComparable")
                    }

                }
                else if (selectedParcelsPrimary && selectedComparableDetected.length === 0){

                    if(selectedGraphicsDetected.length === 0){
                        console.log("selected parcels not clicked")
                        await removeAllFeatures(selectedParcelsPrimary)
                        await addFeatures(response.results)
                        

                        //clear comparables from map when primary selected parcel changes
                        clearComparableParcels()
                    }

                    else{
                        //select primary search parcel detected
                        const clickedParcel = response.results
                        ////console.log("display parcel details: ", clickedParcel)

                        const clickedParcelObjIds = clickedParcel.map(parcel => parcel.graphic.attributes['OBJECTID'])

                        ////console.log("clickedParcelObjId ", clickedParcelObjIds)

                        const showParcelDetail = searchFeatures.filter(feature => clickedParcelObjIds.includes(feature.attributes["OBJECTID"]))
                        
                        console.log("showParcelDetail: ", showParcelDetail)

                        if(showParcelDetail.length > 0){
                            
                            //let features = searchFeatures.filter(feature => !clickedParcelObjIds.includes(feature.attributes['OBJECTID']))

                            ////console.log("remove features: ", features)
                            
                            const where = `OBJECTID NOT IN (${clickedParcelObjIds.join(",")})`
                            await removeAllFeatures(selectedParcelsPrimary, where)

                            setPrimaryResultFeature(showParcelDetail, false)
                            setPanelDisplay("propertyDetail")
                            setPropertyDetailPanel(false)
                        }
                    }  
                }
                //new parcel selected
                else if(!selectedParcelsPrimary && selectedComparableDetected.length === 0){

                    await addFeatures(response.results)
                    //setCoordinates(mapPoint.x, mapPoint.y)
                }
                
            }
            
        }
        
    }

    const handleClick = () => {
        ////console.log("Setting secondary panel display")
        setShowMapMoblie( false)
    }

    const setInitalHitTestLayers = async (layer) => {

        ////console.log("setInitalHitTestLayers")
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
        else if(title === selectedComparableParcelTitle){
            ////console.log("setting selected comparable parcel layer")
            setSelectedComparableParcelLayer(layer)
        }
        

        await updateHitTestLayers(layer)
    }

    const updateHitTestLayers = async (layer) => {

        ////console.log("updateHitTestLayers")
        //add the layer to the hittest array
        let newHitTestLayers = [ ...hitTestLayers, layer]
                
        ////console.log("hittest layers: ", newHitTestLayers)

        //update the state of the hittest layers
        setHitTestLayers(newHitTestLayers)
    }

    //configure map on load
    useEffect(() => {

        const configureWebMap = async () => {
            if(arcgisMapRef && mapLoading === false && searchSources){
                //////console.log("loading new map: ", arcgisMapRef.current.view)
    
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

    //add search buffer graphic to map when searchBufferGeometry changes
    useEffect(() => {

        const createSearchBufferGraphics = async () => {
            let view; 
            let map;

            if(arcgisMapRef.current){
                view = arcgisMapRef.current.view
                map = arcgisMapRef.current.map
            }
    
            
            if(searchResultPoint?.length > 0 && searchBufferGeometry?.length > 0 && view){

                //check to make sure primaryResultFeature is new and not in searchFeatures
                //const primaryInSearchFeature = anyAttributesIncluded(primaryResultFeature, searchFeatures)

                console.log("adding buffer graphics to map: ", searchResultPoint)
    
                let pointGraphics = await Promise.all(searchResultPoint.map(async(point) => {
    
                    console.log("point geometry: ", point)
    
                    let graphic = await createGraphic(point, "point")
    
                    console.log("point graphic created: ", graphic)
                    
                    return graphic
                    //view.graphics.add(graphic)
                }))
    
                let bufferGraphics = await Promise.all(searchBufferGeometry.map(async(polygon) => {
    
                    console.log("polygon geometry: ", polygon)
    
                    let graphic = await createGraphic(polygon, "polygon")
    
                    console.log("polygon graphic created: ", graphic)
    
                    //view.graphics.add(graphic)
    
                    return graphic
                }))

                let allGraphics = [...pointGraphics, ...bufferGraphics]

                //check to see if graphics layer already exists
                let foundBufferGraphic = await findLayerByTitle(map, "bufferGraphics")
                if(foundBufferGraphic){
                    //remove all graphics
                    foundBufferGraphic.removeAll()
                    //remove from map
                    map.remove(foundBufferGraphic)
                }

                let newGraphicsLayer = new GraphicsLayer({
                    title: "bufferGraphics"
                })

                setBufferGraphicsLayer(newGraphicsLayer)

                newGraphicsLayer.addMany(allGraphics)

                map.add(newGraphicsLayer)
    
                console.log("features selected: ", primaryResultFeature)

                if(primaryResultFeature?.length === 0){
                    console.log("no features detected zooming to buffered area:", bufferGraphics[0])
                    view.goTo(bufferGraphics[0])
                }
            }
    
            
        }


        createSearchBufferGraphics()

    },[searchResultPoint])

    //remove search buffer graphics
    useEffect(() => {

        let map;
        const removeSearchBufferGraphics = async () => {
            if(arcgisMapRef.current){
                map = arcgisMapRef.current.map
            }

            if(!bufferGraphicsLayer){
                return
            }

            if(!primaryResultFeature || (!searchBufferGeometry && !searchResultPoint)){
                console.log("Removing buffer graphics")
                //remove graphics
                //setSearchBufferGeometry(null, null)
                let foundBufferGraphic = await findLayerByTitle(map, "bufferGraphics")
                
                if(foundBufferGraphic){
                    console.log("found graphic to remove: ", foundBufferGraphic)
                    foundBufferGraphic.removeAll()
                    map.remove(foundBufferGraphic)
                }
                
                // if(view){
                //     if(view.graphics?.items?.length > 0){
                //         console.log("removing all graphics from view: ", view.graphics)
                //         view.graphics.items.map(graphic => {
                //             view.graphics.remove(graphic)
                //         })
                //     }
                // } 
            }
        }
        removeSearchBufferGraphics()

    }, [searchResultPoint, searchBufferGeometry, primaryResultFeature])


    useEffect(() => {

        const displayPrimaryResultFeature = async () => {

            if(arcgisMapRef.current && !mapLoading && targetLayer){

                if(!selectedParcelsPrimary && primaryResultFeature){
                    //if selecetd parcels primary layer does not exist create it from the
                    await createAndAddFeatureLayer(primaryResultFeature, "features", selectedParcelTitle, theme.layers.primary)

                    //zoomToExtent(primaryResultFeature)
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

                        // //updating url parameters
                        // const param = await returnSearchParam(features)
                        // setSearchParams(param)
                    }
                }

                else if(!primaryResultFeature && selectedParcelsPrimary){
                    ////console.log("clearing primary parcel selection")
                    await removeAllFeatures(selectedParcelsPrimary) 

                }

                //if primaryResultFeature is not null then zoom to newly added features
                if(primaryResultFeature){
                    if(newSearch){
                        zoomToExtent(primaryResultFeature)
                    }
                    
                    //clear comparables from map when primary selected parcel changes
                    clearComparableParcels()

                }
            }
        }

        
    displayPrimaryResultFeature()

    }, [ primaryResultFeature, newSearch, arcgisMapRef, mapLoading, targetLayer ])

    useEffect(() => {
        
        ////console.log("comparable parcels use effect triggereed: ", comparableParcels)
        ////console.log("comparable parcels layer : ", comparableParcelLayer)
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

                    if(selectedComparableParcelLayer){
                        await removeAllFeatures(selectedComparableParcelLayer)
                    }
                }

                else if(comparableParcelLayer && comparableParcels){

                    ////console.log("removing existing selected parcels")
                    await removeAllFeatures(comparableParcelLayer)

                    ////console.log("Adding comparable features to map")
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

        const displaySelectedComparableParcel = async () => {

            if(arcgisMapRef.current){
                if(secondaryResultFeature && !selectedComparableParcelLayer){
                    //create selected comparable parcel layer
                    await createAndAddFeatureLayer(secondaryResultFeature, "features", selectedComparableParcelTitle, theme.layers.secondarySelected)
                    zoomToExtent(secondaryResultFeature) 
                }
                else if((!secondaryResultFeature || !comparableParcels) && selectedComparableParcelLayer){
                    //if there are no selected secondary parcels then remove all features
                    await removeAllFeatures(selectedComparableParcelLayer)
                }
                else if(secondaryResultFeature && selectedComparableParcelLayer){

                    ////console.log("removing existing selected parcels")
                    await removeAllFeatures(selectedComparableParcelLayer)
                    
                    ////console.log("Adding selected comparable features to map: ", secondaryResultFeature)
                    const addEdits = {
                        addFeatures: Array.isArray(secondaryResultFeature) ? secondaryResultFeature : [secondaryResultFeature],
                    }

                    selectedComparableParcelLayer.applyEdits(addEdits)

                    zoomToExtent(secondaryResultFeature)
                }
            }
        }
        displaySelectedComparableParcel()
        //addLayerToMap(secondaryResultFeature, "Selected Comparable Parcel", theme.layers.secondarySelected, "features")
    }, [ secondaryResultFeature, arcgisMapRef ])


    //Remove all graphics from map when panelDisplayWidget, panelWidgetVisible changes
    useEffect(() => {
        const removeAllGraphics = () => {

            if(arcgisMapRef.current?.map){
                const isMeasure = panelDisplayWidget === "measureWidget"
                const isSelect = panelDisplayWidget === "sketch"
                const map = arcgisMapRef.current.map
    
                if(!isSelect || !panelWidgetVisible){
                    //remove all select graphics
    
                    const foundGraphic = findLayerByTitle(map,"selectGraphic")
                    
                    if(foundGraphic){
                        foundGraphic.removeAll()
                        removeLayer(map, "selectGraphic")
                    }
                }

                //TODO add print props into state
                if(!isMeasure || !panelWidgetVisible ){
                    //This is for the measureViewModelWidget
                    if (measureWidget != null ){
                        measureWidget.clear()
                    }

                    //This is for the MeasureSketchWidget
                    const foundGraphicMeasure = findLayerByTitle(map,"measureGraphic")
                    if(foundGraphicMeasure){
                        console.log('removing all measure graphics')
                        foundGraphicMeasure.removeAll()
                        removeLayer(map, 'measureGraphic')
                    }
                }
            }
        }
        removeAllGraphics()
    }, [panelDisplayWidget, panelWidgetVisible, arcgisMapRef.current])

    return(
        // <Box
        // display="flex"
        // width="100%"
        // height="100%"
        // justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"}
        // >
        <arcgis-map
        ref={arcgisMapRef}
        item-id={config.webmap_id}
        zoom={8}

        onarcgisViewReadyChange={(event) => {
            console.log('MapView ready', event);
            setMapLoading(false)
            setMapView(event.target.view)
            }}
        onarcgisViewChange={(event) => {
            console.log("view change: ", event)
            if(panelDisplayWidget === "layersWidget" && panelWidgetVisible){
                setMapViewScale(event.target.view)
            }
            
        }}
        onarcgisViewClick={(event) => {
            
            if(event.detail.native.button === 2){
                ////console.log("onArcgisViewClick: right click, button =", event.detail.native.button)
            }
            else{
                ////console.log("onArcgisViewClick: left click, button =", event.detail.native.button)
                // handleViewClick(event.detail.mapPoint)
                let foundSelectGraphic = findLayerByTitle(arcgisMapRef.current.map, "selectGraphic")
                let foundMeasureGraphic = findLayerByTitle(arcgisMapRef.current.map, "measureGraphic") //no longer needed 

                // console.log("CURRENT MAP ON CLICK", arcgisMapRef.current.map)

                // console.log("found MEASURE graphic: ", foundMeasureGraphic)
                if( !foundSelectGraphic  || !selectMultiple || !measureWidgetState){
                // if((!foundSelectGraphic && !foundMeasureGraphic) || !selectMultiple || (!isMeasuring)){ //TODO this is for the measureSketchWidget
                    // console.log("The if block executes because one of the conditions is falsy.");
                    
                    handleHitTest(event)
                }
                

            }
        }}
        // // onArcgisViewPointerMove={}
        >   
        <arcgis-zoom position="top-right"/>
        </arcgis-map>
        // <Box 
        //     id="mapButtonGroup"
        //     // justifyContent={screenWidth < theme.breakpoints.values.md ? "center" : "left"} 
        //     position="absolute" 
        //     pt={2}
        //     pl={screenWidth < theme.breakpoints.values.md ? 0 : 2}
        //     zIndex={2}
        //     sx={{boxSizing:"border-box"}}
        //     height="auto"
        //     width="auto"
        //     >
        //         <MapButtonGroup/>
        //     </Box>

            // <Fade 
            //     appear
            //     in={!panelWidgetVisible}>
            //         <IconButton 
            //         onClick={handleClick}
            //         sx={{
            //             position: "absolute",
            //             bgcolor:theme.palette.primary.main, 
            //             zIndex:"modal",
            //             display:!panelWidgetVisible && screenWidth <= theme.breakpoints.values.sm ? "flex" : "none",
            //             width:50,
            //             height:50,
            //             flexDirection:"column",
            //             bottom:20,
            //             boxShadow:5
            //             }}>
            //             <TableRowsOutlined htmlColor="white"/>
            //             <Typography variant="subtitle1" color="white">{translateText("Data")}</Typography>
            //         </IconButton>
            //     </Fade>
        // </Box>
        

    )
}

export default WebMapComponentBeta