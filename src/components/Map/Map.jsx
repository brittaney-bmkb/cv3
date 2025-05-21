
import UseAppContext from "../../contexts/AppContext";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";

import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";

import FeatureEffect from "@arcgis/core/layers/support/FeatureEffect.js";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter.js";


import Field from "@arcgis/core/layers/support/Field";
import Collection from "@arcgis/core/core/Collection";
import * as intersectsOperator from "@arcgis/core/geometry/operators/intersectsOperator.js";

import { config } from "../../data/config";
import { useEffect, useRef, useState } from "react";
import ActionBarMap from "../ActionBar/ActionBarMap";
import { createGraphic } from "../../arcgis/layers/layers";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { CalciteNotice } from "@esri/calcite-components-react";


export const SELECTED_PARCEL = "Selected Parcels"
//Names of selected parcel types
const SOURCE_PARCEL = "Source Parcel"
const COMPARABLE_PARCEL = "Comparable Parcel"
const NEARBY_PARCEL = "Nearby Parcel"

//set view highlight options
//https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#highlights
const highlights = [
    {
    name: "default", //this is the highlight config for the primary selected parcel
    color:  "#FFD700",
    haloOpacity: 1,
    haloColor: "#FFD700",
    fillOpacity: .1,
    },
    {
      name: SOURCE_PARCEL, //this is the highlight config for the primary selected parcel
      color:  "#FFD700",
      haloOpacity: 1,
      haloColor: "#FFD700",
      fillOpacity: .1,
      },
    {
    name: COMPARABLE_PARCEL, //this is the highlight for comparable parcel that is selected
    color:  "#FF00FF",
    haloOpacity: 1,
    haloColor: "#FF00FF",
    fillOpacity: .1,
    },
    {
    name: NEARBY_PARCEL, //this is the highlight for nearby parcel that is selected
    color:  "#FF00FF",
    haloOpacity: 1,
    haloColor: "#FF00FF",
    fillOpacity: .1,
    }
]

const typeColors = {
  "Source Parcel": "#FFD700",
  "Comparable Parcel": "#FF00FF",
  "Nearby Parcel": "#FF00FF"
};


export const findTargetLayer = (map) => {

  let layer = map.allLayers.find((layer) => {
      //consolelog("Layer details: ", layer)
      return `${layer.url}/${layer.layerId}` === config.target_layer_url
  })

  return layer
}

const Map = () => {

    const { 
        setMapView, 
        arcgisMapRef,
        primaryResultFeature,
        secondaryResultFeature,
        queryPolygon,
        selectPanelClosed,
        measurePanelClosed,
        togglePanel,
        searchFeatures,
        isMobile,
        comparableParcels,
        setSearchResults,
        searchTerm,
        newSearch,
        clearResultsComparables,
        searchBufferGeometry,
        searchResultPoint,
        translateText,
        setSearchBufferGeometry
        } = UseAppContext()
    
    const actionRef = useRef(null)
    const [parcelLayer, setParcelLayer] = useState(null)
    const [ removeParcel, setRemoveParcel] = useState([])
    const [ bufferGraphicsLayer, setBufferGraphicsLayer ] = useState(null)

    const highlightHandlesRef = useRef({});
    


    const zoomToExtent = async (features) => {

        //consolelog("features selected: ", features)

        if(!arcgisMapRef.current) return;

        const view = arcgisMapRef.current.view

        if(!view) return;

        if(!features) return;

        let extent

        if(Array.isArray(features)){
            const geometries = features.map((feature) => feature.geometry);
            //consolelog("geometries: ", geometries)
            if(geometries?.length > 0){
                extent = unionOperator.executeMany(geometries);
            }
        }
        else{
               extent = features?.geometry
        }
        
        if(extent){
          await view.when()
          view.goTo(extent)
        }
        
    }

    const isSelected = async (mapPoint) => {

      if(!arcgisMapRef.current){
        return
      }

      const map = arcgisMapRef.current.map

      if(!map) return;

      const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL)

      if(!layer) return;

      const { features } = await layer.queryFeatures()

      const selected = features
      .filter((feature) => intersectsOperator.execute(mapPoint, feature.geometry))
      .map((feature) => feature)

      return selected
    }

    const deselectParcel = async (feature) => {

      //consolelog("Deselecting Parcel", feature)

      const deselectPins = feature.map((f) => f.attributes[config.target_layer_id_field])

      //consolelog("existing search features: ", searchFeatures)
      const filterSearchFeatures = searchFeatures.filter((searchFeature) => {
        return !deselectPins.includes(searchFeature.attributes[config.target_layer_id_field])
      })

      //consolelog("New search features: ", filterSearchFeatures)
      setSearchResults(null, filterSearchFeatures, searchTerm, filterSearchFeatures)
    }

    const handleViewClick = async (event) => {

        //consolelog("Map Clicked")
        
        if(!arcgisMapRef.current){
            return
        }

        const view = arcgisMapRef.current.view
        if(!view) return; 

        //prevent selection using right mouse click
        if(event.detail.native.button === 2){
            return
        }
        //select parcel using screen point
        let mapPoint = event.detail.mapPoint;

        //check if reselecting polygon
        const reselected = await isSelected(mapPoint)

        if(reselected?.length > 0){
          //consolelog("Clicked feature that is already selected")
          //highlightReselectedParcels(view, reselected)
          //update primary result feature with selected parcel

          if(selectPanelClosed){
            const features = await queryPolygon(mapPoint, false) 
            
          }
          //if select multiple panel is open and a parcel is reselected
          //remove the parcel from search results and the map
          else{
            setRemoveParcel(reselected)
            await deselectParcel(reselected)
          }

        } 
        // else if (!measurePanelClosed){
        //   // //consolelog("ELSE IF measurePanelClosed: ", measurePanelClosed)
        //   // if(reselected?.length > 0){

        //   // }
        // }
        else{
          //if selecting new polygon
          const features = await queryPolygon(mapPoint, selectPanelClosed) 
          //consolelog("Clicked Features: ", features)
        }

        
        

    }
    
    const getGraphicsFromFeatureOrEvent = async (featureOrEvent, view, map) => {

        if (featureOrEvent?.detail?.screenPoint) {
          const hit = await view.hitTest(featureOrEvent.detail.screenPoint);

          const selectedLayer = map.allLayers.find((l) => l.title === SELECTED_PARCEL);
          if (!selectedLayer) return [];

          return hit.results.filter(r => r.graphic.layer === selectedLayer).map(r => r.graphic);
        }
        return Array.isArray(featureOrEvent) ? featureOrEvent : [featureOrEvent];
      };

      const createGraphics = (graphics, type) =>
        graphics.map((g, i) => {
          const newAttrs = {
            ...g.attributes,
            OBJECTID: g.attributes.OBJECTID || crypto.randomUUID?.() || `${Date.now()}${i}`,
            parcelSelectionType: type
          };
      
          //consolelog("Creating graphic with attributes:", newAttrs);
      
          return new Graphic({
            geometry: g.geometry,
            attributes: newAttrs
          });
        });
      
    
      const createSelectedParcelsLayer = (view, graphics) => {

        // const fields = Object.entries(graphics[0].attributes).map(([field, attribute]) =>
        //   new Field({
        //     name: field,
        //     type: attribute
        //       ? typeof attribute === "string"
        //         ? "string"
        //         : "double"
        //       : "string"
        //   })
        // );
        
        // fields.push(new Field({ name: "parcelSelectionType", type: "string" }));
        

        //consolelog("create selected parcel graphics: ", graphics)
        return new FeatureLayer({
          title: SELECTED_PARCEL,
          source: graphics,
          objectIdField: "OBJECTID",
          fields: [
            new Field({ name: "OBJECTID", type: "oid" }),
            new Field({ name: config.target_layer_id_field, type: "string" }),
            new Field({ name: "parcelSelectionType", type: "string" })
          ],
          // fields: fields,
          
          renderer: {
            type: "unique-value",
            field: "parcelSelectionType",
            uniqueValueInfos: Object.entries(typeColors).map(([value, color]) => {
              return {
                label: value,
                value: value,
                symbol: {
                  type: "simple-fill",
                  color: [51, 204, 51, 0],
                  outline:{
                    color: color,
                    width: 2,
                    style: value === SOURCE_PARCEL ? "solid": "dash"
                  }
                }
              }
            }),
          },
          spatialReference: view.spatialReference
        });
      };
    
      const updateSelectedParcelsLayer = async (map, existing, graphics, type) => {
        
        //consolelog("updating selected parcels: ",  graphics)
        if(!arcgisMapRef.current){
          return
        }

        const layer = map.allLayers.find(layer => layer.title === SELECTED_PARCEL);
        //consolelog("found selected parcel layer ",  layer)
        if (!layer) return;

        // const existing = layer.source.toArray();
        //consolelog("existing features on selected parcels layer: ", existing)

        const incomingIds = new Set(graphics.map(g => {
          g.attributes.OBJECTID
          g.attributes[config.target_layer_id_field]
        }));
        
        let toRemove =[]
 

        if(selectPanelClosed || newSearch ){
          toRemove = existing?.filter(g => {
  
            const isSameType = g.attributes.parcelSelectionType === type;
            const isOverlapping = incomingIds.has(g.attributes.OBJECTID);
            if (type === SOURCE_PARCEL) return true;
            if (
              (type === NEARBY_PARCEL && g.attributes.parcelSelectionType === COMPARABLE_PARCEL) ||
              (type === COMPARABLE_PARCEL && g.attributes.parcelSelectionType === NEARBY_PARCEL)
            ) return true;
            return isOverlapping || isSameType;
          })
        }
        else{
          toRemove = removeParcel
          setRemoveParcel([])
        }


        //consolelog("removing: ", toRemove)
        //consolelog("adding: ", graphics)

        await layer.applyEdits({ deleteFeatures: toRemove, addFeatures: graphics });
        return existing;
      };

      const hideOtherSearchFeatures = async (hide, features) => {

        if(!arcgisMapRef.current) return;
        const map = arcgisMapRef.current.map
        if(!map) return;

        const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL)
        if(!layer) return;
        

        if(hide){
          //get PIN10 from target layer to filter out other search features
          let sourceParcelPin = primaryResultFeature.map((feature) => feature.attributes[config.target_layer_id_field])

          if(features){
            const featurePins = features.map((feature) => feature.attributes[config.target_layer_id_field])
            sourceParcelPin = [...sourceParcelPin, ...featurePins]
          }

          
          const effectQuery = `${config.target_layer_id_field} IN ('${sourceParcelPin.join("','")}')`
          
          //consolelog("effect query: ", effectQuery)

          
          layer.featureEffect = new FeatureEffect({
            filter: new FeatureFilter({
              where: effectQuery
            }),
            excludedEffect: "opacity(40%)"
          })
        }
        else{
          layer.featureEffect = null
        }


      }
    
      const highlightReselectedParcels = async (view, features, parcelType) => {

        if(!features) return;

          const map = arcgisMapRef.current.map
          if(!view && !map) return;

          const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL)

          if(!layer) return;
          const parcelSelectionType = features.map((feature) => feature.attributes["parcelSelectionType"])
          const type =  parcelType ? parcelType : SOURCE_PARCEL
  
          
          if(highlightHandlesRef.current[type]){
            //consolelog("remove existing highlightHandlesRef.current: ", highlightHandlesRef.current)
            highlightHandlesRef.current[type]?.remove()
          }
          

          //consolelog("highlighting: ", type, features)
          const layerView = await view.whenLayerView(layer);

          const highlight = layerView.highlight(
            features.map(g => g.attributes.OBJECTID),
            {name: type}
          );

          if(highlight){
            highlightHandlesRef.current[type] = highlight
          }
          

      };
    
      const handleParcelSelection = async (featureOrEvent, name) => {

        //consolelog("handling new parcel selection: ", name, featureOrEvent)
        if (!arcgisMapRef.current || !featureOrEvent) return;

        const view = arcgisMapRef.current.view;
        const map = arcgisMapRef.current.map;
        if (!view || !map) return;
    
        // const parcelSelectionType = getParcelSelectionType(name);
        const parcelSelectionType = name;
        if (!parcelSelectionType) return;
        

        //if feature event is point
        let rawGraphics
        //consolelog("featureOrEvent: ", featureOrEvent)
        if(featureOrEvent[0]?.geometry.type === "point"){
          rawGraphics = await getGraphicsFromFeatureOrEvent(featureOrEvent, view, map);
        }
        else{
          rawGraphics = featureOrEvent
        }
        
        if (!rawGraphics.length || !rawGraphics[0]?.geometry) return;
    
        const newGraphics = createGraphics(rawGraphics, parcelSelectionType);

        
        
        let layer = map.allLayers.find(layer => layer.title === SELECTED_PARCEL);
    
        if (!layer) {
          //consolelog("Source parcel layer not found")
          const newLayer = createSelectedParcelsLayer(view, newGraphics);
          map.add(newLayer);
          map.reorder(newLayer, map.allLayers.length -1)
        } else {

          //consolelog("Source parcel layer found")
          const { features } = await layer.queryFeatures()

          const existing = await updateSelectedParcelsLayer(map, features, newGraphics, parcelSelectionType);
          map.reorder(layer, map.allLayers.length -1)
        }
        zoomToExtent(rawGraphics);
      };
    
      const clearSelectedParcelsByType = async (parcelSelectionType) => {

        if (!arcgisMapRef.current) return;
        const map = arcgisMapRef.current.map;
        if(!map) return;

        const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL);
        if (!layer) return;

        const { features } = await layer.queryFeatures();
        //consolelog(`Clearing ${parcelSelectionType} from map`)
        //consolelog("clearSelectedParcelsByType removing: ", features)

        const toDelete = features.filter(
          (f) => f.attributes.parcelSelectionType === parcelSelectionType
        );

        //consolelog("clearSelectedParcelsByType removing: ", toDelete)

        if (!toDelete.length) return;
        await layer.applyEdits({ deleteFeatures: toDelete });
      };
    

    const handleViewReady = async (event) => {

        if(!arcgisMapRef.current){
            return
        }

        const map = arcgisMapRef.current.map
        const view = arcgisMapRef.current.view

        //prevent map rotation
        view.constraints = {
            rotationEnabled: false
        }

        view.highlights = highlights

        //consolelog("view highlights: ", view.highlights)

        setMapView(view)

        //find parcel layer
        const targetLayer = await findTargetLayer(map)
        setParcelLayer(targetLayer)
    }

    //Clear all highlights when parcels are cleared
    useEffect(() => {

        const sourceFeatureSelection = async () => {

  
            if (!arcgisMapRef.current) return;
    
            const map = arcgisMapRef.current.map;
            
            if (!map) return;
    

            const targetLayer  = map.allLayers.find((layer) => layer.title === config.target_layer_name)
            //if targetlayer is not visible turn it on
            if(!targetLayer) return;

            if(!targetLayer.visible || !targetLayer.parent.visible){
                //consolelog("Updating labels")
                targetLayer.visible = true
                targetLayer.parent.visible = true
            }

            if(!searchFeatures || !searchFeatures[0]){
                //highlightSelect?.remove()
                clearSelectedParcelsByType('Source Parcel')
            }
    
            if(parcelLayer && (searchFeatures)){
               await parcelLayer.load()
                //consolelog("primary feature selection updated: ", searchFeatures)
                await handleParcelSelection(searchFeatures, SOURCE_PARCEL)

                //if( searchFeatures?.length === 1){
                //    togglePanel('property')
                //}
                //else{
                    togglePanel('search')
                //}
            }
        }
        
        sourceFeatureSelection()

    }, [parcelLayer, searchFeatures])

    useEffect(() => {

      const highlightSelected = async () => {

        if(comparableParcels && comparableParcels.length > 0){
          //hideOtherSearchFeatures(false)
          clearSelectedParcelsByType(COMPARABLE_PARCEL) 
          clearResultsComparables()
        }

        if(!primaryResultFeature || primaryResultFeature?.length === 0 && !arcgisMapRef.current) return; 

        const view = arcgisMapRef.current.view

        const map = arcgisMapRef.current.map;
        if(!map || !view) return;

        const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL);

        //consolelog("found selected parcel layer: ", layer)
        if(!layer){
          await handleParcelSelection(primaryResultFeature, SOURCE_PARCEL)
        }
        
        else{
          let query = layer.createQuery();
          const pins = primaryResultFeature.map((feature) => feature.attributes[config.target_layer_id_field])
          query.where = `${config.target_layer_id_field} IN ('${pins.join(',')}')`
          query.outFields = "*"
          const { features } = await layer.queryFeatures(query)
          await highlightReselectedParcels(view, features)
        }


      }

      highlightSelected()

    }, [primaryResultFeature])


    useEffect(() => {

        const showComparables = async () => {
            

          if(comparableParcels && comparableParcels.length > 0){
            //hideOtherSearchFeatures(false)
            clearSelectedParcelsByType(COMPARABLE_PARCEL)
            //hideOtherSearchFeatures(true, comparableParcels)
            handleParcelSelection(comparableParcels, COMPARABLE_PARCEL)
          }
          else{
            //hideOtherSearchFeatures(false)
            clearSelectedParcelsByType(COMPARABLE_PARCEL)
          }

        } 

        showComparables()


    }, [comparableParcels])

    useEffect(() => {

        const highlightSelectedComparable = async () => {
          if(!secondaryResultFeature || secondaryResultFeature?.length === 0 && !arcgisMapRef.current) return; 

          const view = arcgisMapRef.current.view
  
          const map = arcgisMapRef.current.map;
          if(!map && !view) return;
  
          const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL);
          if(!layer) return;
          
          
          let query = layer.createQuery();
          const pins = secondaryResultFeature.map((feature) => feature.attributes[config.target_layer_id_field])
          query.where = `${config.target_layer_id_field} IN ('${pins.join(',')}')`
          query.outFields = "*"
          const { features } = await layer.queryFeatures(query)
          //consolelog("secondaryResultFeature: ", secondaryResultFeature)
          await highlightReselectedParcels(view, features, COMPARABLE_PARCEL)
        
        }

        highlightSelectedComparable()

        
    }, [secondaryResultFeature])

    useEffect(() => {

        if(!arcgisMapRef.current){
            return
        }

        const view = arcgisMapRef.current.view

        // Append ActionBarMap using ref
        if (actionRef.current && isMobile) {
            view.ui.add(actionRef.current, "top-right");
        }
        if(actionRef.current & !isMobile){
            view.ui.remove(actionRef.current);
    }

    }, [isMobile, actionRef, arcgisMapRef])


    //add search buffer to map
 //add search buffer graphic to map when searchBufferGeometry changes
    useEffect(() => {

        const createSearchBufferGraphics = async () => {
            let view; 
            let map;

            if(arcgisMapRef.current){
                view = arcgisMapRef.current.view
                map = arcgisMapRef.current.map
            }

            if(!map) return;
    
            
            if(searchResultPoint?.length > 0 && searchBufferGeometry?.length > 0 && view){

                //check to make sure primaryResultFeature is new and not in searchFeatures
                //const primaryInSearchFeature = anyAttributesIncluded(primaryResultFeature, searchFeatures)

                //consolelog("adding buffer graphics to map: ", searchResultPoint)
    
                let pointGraphics = await Promise.all(searchResultPoint.map(async(point) => {
    
                    //consolelog("point geometry: ", point)
    
                    let graphic = await createGraphic(point, "point")
    
                    //consolelog("point graphic created: ", graphic)
                    
                    return graphic
                    //view.graphics.add(graphic)
                }))
    
                let bufferGraphics = await Promise.all(searchBufferGeometry.map(async(polygon) => {
    
                    //consolelog("polygon geometry: ", polygon)
    
                    let graphic = await createGraphic(polygon, "polygon")
    
                    //consolelog("polygon graphic created: ", graphic)
    
                    //view.graphics.add(graphic)
    
                    return graphic
                }))

                let allGraphics = [...pointGraphics, ...bufferGraphics]

                //check to see if graphics layer already exists
                let foundBufferGraphic = map.allLayers.find((layer) => layer.title === "bufferGraphics")
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
    
                //consolelog("features selected: ", primaryResultFeature)

                if(primaryResultFeature?.length === 0){
                    //consolelog("no features detected zooming to buffered area:", bufferGraphics[0])
                    view.goTo(bufferGraphics[0])
                }
            }
    
            
        }


        createSearchBufferGraphics()

    },[searchResultPoint, searchBufferGeometry])


        //remove search buffer graphics
      useEffect(() => {

          let map;
          const removeSearchBufferGraphics = async () => {

              //consolelog("Removing buffer graphic")
              if(arcgisMapRef.current){
                  map = arcgisMapRef.current.map
              }
  
              if(!bufferGraphicsLayer){
                  return
              }
  
              if(searchBufferGeometry || searchResultPoint){

                  let foundBufferGraphic = map.allLayers.find((layer) => layer.title === "bufferGraphics")
                  
                  if(foundBufferGraphic){
                      //consolelog("found graphic to remove: ", foundBufferGraphic)
                      foundBufferGraphic.removeAll()
                      map.remove(foundBufferGraphic)
                      setSearchBufferGeometry(null, null)
                  }
              }
          }
          removeSearchBufferGraphics()
  
      }, [searchResultPoint, searchBufferGeometry, primaryResultFeature])
  

    return(
        <>
        {
            isMobile ?
            <div ref={actionRef} className="esri-widget">
                <ActionBarMap />
            </div> : null
        }
        

        {/* ArcGIS Map Component */}
        <arcgis-map
            ref={arcgisMapRef}
            item-id={config.webmap_id}
            zoom={8}
            onarcgisViewReadyChange={handleViewReady}
            onarcgisViewClick={(event) => {
              if(!measurePanelClosed) return;
                // if (selectPanelClosed) {
                    handleViewClick(event);
                //}
            }}
        >
            <arcgis-zoom position="top-right" />

            {/* <arcgis-legend position="bottom-right" legend-style="card"></arcgis-legend> */}

        </arcgis-map>

        <CalciteNotice open={searchBufferGeometry ? true : false} icon='cluster-radius' closable>
        <div slot="title">{`${translateText("Showing properties near")} ${searchTerm}`}</div>
        <div slot="message">{translateText("You’re seeing multiple properties because the search used an address to find a nearby location, not a specific property. This means properties within about 60 feet of that address may appear in the results.")}</div>
        </CalciteNotice>
    </>
    )
}

export default Map
