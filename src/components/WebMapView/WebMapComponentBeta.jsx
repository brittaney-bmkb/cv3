import { ArcgisMap, ArcgisZoom } from "@arcgis/map-components-react"
import { useEffect, useRef, useState } from "react";
import UseAppContext from "../../contexts/AppContext";
import { createFeatureLayerFromGraphics, createFeatureLayerFromFeatures, removeLayer } from "../../arcgis/layers/layers";
import { theme } from "../../theme";
import MapButtonGroup from "../MapButtonGroup";
import { Box, Fade, Typography, IconButton } from "@mui/material";
import { TableRowsOutlined } from "@mui/icons-material";
import { config } from "../../data/config";


const selectedParcelTitle = "Selected Parcel"
const webmapParcelLayerTitle = config.target_layer_name

const WebMapComponentBeta = () => {

    const { 
        primaryResultFeature, 
        setMapView, 
        queryMapPoint, 
        comparableParcels, 
        secondaryResultFeature,
        screenWidth,
        panelWidgetVisible,
        translateText,
        setShowMapMoblie,
        searchSources,
        setMapViewScale
        } = UseAppContext()

    const arcgisMapRef = useRef(null)
    const [ mapLoading, setMapLoading ] = useState(true)
    const [ targetLayer, setTargetLayer ] = useState(null)
    const [ selectedParcelsPrimary, setSelectedParcelsPrimary ] = useState(null)
    const [ hitTestLayers, setHitTestLayers ] = useState([])
    const [ selectedGraphicObjectIds, setSelectedGraphicObjectIds ] = useState([])

    const zoomToExtent = async (features) => {

        console.log("zoom to extent: ", features)
        let extent
        console.log("quering extent ")
        extent = await features.queryExtent()

        console.log("queried extent: ", extent)
        arcgisMapRef.current.goTo(extent)
    }

    const addLayerToMap = async (source, title, theme, type) => {

        console.log("adding layer to map")

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
                    zoomToExtent(featLayer)
                }
                
            }

        }
    }

    const handleViewClick = async (mapPoint) => {

        await queryMapPoint(mapPoint)

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

    const deleteArrayItemByValue = (array, value) => {
        return array.filter(item => item !== value)
    }

    const handleHitTest = async (event) => {
        
        console.log("onArcgisViewClick: ", event)

        //const view = event.target.view
        const view = arcgisMapRef.current.view

        console.log("Hit Test Layers: ", hitTestLayers)

        const options = {
            include: hitTestLayers
        }

        const response = await view.hitTest(event.detail.screenPoint, options)

        if(!response) return;

        if(response.results.length > 0){
            console.log("onArcgisViewClick: hittest results ", response.results)

            let addGraphics = []
            let removeGraphics = []
            let removeIds = []

            // if(selectedParcelsPrimary){
            //     response.results.map((result) => {
            //         console.log("Result: ", result)
            //         console.log("Result graphic OBJECTID: ", result.graphic.attributes['OBJECTID'])

            //         if(selectedGraphicObjectIds.includes(result.graphic.attributes['OBJECTID'])){
            //             console.log("Adding graphic to remove graphics: ", result.graphic)
            //             removeGraphics.push(result.graphic)
            //             removeIds.push(result.graphic.attributes['OBJECTID'])
            //         }
            //     })

            //     setSelectedGraphicObjectIds([...selectedGraphicObjectIds, ...removeIds ])
            // }

            console.log("selectedGraphicObjectIds OBJECTIDs to remove: ", selectedGraphicObjectIds)
            response.results.map((result) => {

                console.log("Result graphic: ", result.graphic.attributes['OBJECTID'])
                if(!selectedGraphicObjectIds.includes(result.graphic.attributes['OBJECTID'])){
                    console.log("Adding graphic: ", result.graphic.attributes['OBJECTID'])
                    addGraphics.push(result.graphic)
                    setSelectedGraphicObjectIds([...selectedGraphicObjectIds, ...[result.graphic.attributes['OBJECTID']] ])
                }
                else{
                    console.log("Removing graphic: ", result.graphic.attributes['OBJECTID'])
                    removeGraphics.push(result.graphic)

                    let updatedObjectIds = deleteArrayItemByValue(selectedGraphicObjectIds, result.graphic.attributes['OBJECTID'])
                    setSelectedGraphicObjectIds(updatedObjectIds)

                }
            })
  

            

            

    
            // response.results.filter((result) => {
            //     console.log("Result: ", result)
            //     if(selectedParcelsPrimary){
            //         if(result.layer.id === selectedParcelsPrimary.id){
            //             console.log("selectedParcelsPrimary exists - removing graphic")
            //             removeGraphics.push(result.graphic)
            //         }
            //         else{
            //             if(!removeGraphics.includes(result.graphic)){
            //                 console.log("selectedParcelsPrimary exists - adding graphic")
            //                 addGraphics.push(result.graphic)
            //             }
                        
            //         }
            //     }
            //     else{
            //         console.log("selectedParcelsPrimary does NOT exist - adding graphic")
            //         addGraphics.push(result.graphic)
            //     }
                 
            // })
    
            
            console.log("remove graphics: ", removeGraphics)

            const addEdits = {
                addFeatures: addGraphics,
                deleteFeatures: removeGraphics
            }

            if(!selectedParcelsPrimary){
                await addLayerToMap(addGraphics, selectedParcelTitle, theme.layers.primary, "graphics")
                let layer = findLayerByTitle(arcgisMapRef.current.map, selectedParcelTitle)
                console.log("selectedParcelsPrimary created layerid: ", layer.id)
                setSelectedParcelsPrimary(layer)
                let newHitTestLayers = [...hitTestLayers, ...[layer]]
                //let newHitTestLayers = [layer]
                setHitTestLayers(newHitTestLayers)
            }
            else{
                console.log(`Adding ${addGraphics.length} graphic${addGraphics.length > 1 ? 's' : ''} to feature layer`)
                console.log(`Removing ${removeGraphics.length} graphic${removeGraphics.length > 1 ? 's' : ''} to feature layer`)
                await selectedParcelsPrimary.applyEdits(addEdits)
                //targetLayer.applyEdits(addEdits)
            }
            
        }
        
    }

    const handleClick = () => {
        console.log("Setting secondary panel display")
        setShowMapMoblie( false)
    }

    useEffect(() => {

        const configureWebMap = async () => {
            if(arcgisMapRef && mapLoading === false && searchSources){
                console.log("loading new map: ", arcgisMapRef.current.view)
    
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
                console.log("Target Layer Found: ", layer)
                setTargetLayer(layer)

                setHitTestLayers([layer])
                
                //create feature layer for primary selected parcels 
                // let selectedFeatLayer = await createFeatureLayer("Selected Parcel", theme.layers.primary)
                // console.log("Selected Parcel Feature Layer Created: ", selectedFeatLayer)
                // setSelectedParcelsPrimary(selectedFeatLayer)
            }
        }

        configureWebMap()
        

    }, [arcgisMapRef, mapLoading, screenWidth, searchSources])

    useEffect(() => {

        if(!selectedParcelsPrimary && arcgisMapRef.current?.map){
            addLayerToMap(primaryResultFeature, selectedParcelTitle, theme.layers.primary, "features")

            let layer = findLayerByTitle(arcgisMapRef.current.map, selectedParcelTitle)

            setSelectedParcelsPrimary(layer)
        }
        

    }, [ primaryResultFeature, arcgisMapRef, mapLoading ])

    useEffect(() => {

        addLayerToMap(comparableParcels, "Comparable Parcels", theme.layers.secondary, "features")

    }, [ comparableParcels, arcgisMapRef, mapLoading ])

    useEffect(() => {

        addLayerToMap(secondaryResultFeature, "Selected Comparable Parcel", theme.layers.secondarySelected, "features")

    }, [ secondaryResultFeature, arcgisMapRef, mapLoading ])

   
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
            setMapViewScale(event.target.view)
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