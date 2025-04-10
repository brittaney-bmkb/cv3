
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


const SELECTED_PARCEL = "Selected Parcels"
//Names of selected parcel types
const SOURCE_PARCEL = "Source Parcel"
const COMPARABLE_PARCEL = "Comparable Parcel"
const NEARBY_PARCEL = "Nearby Parcel"

//set view highlight options
//https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#highlights
const highlights = [
    {
    name: "default", //this is the highlight config for the primary selected parcel
    color:  "#0D4D96",
    haloOpacity: 1,
    haloColor: "#0D4D96",
    fillOpacity: .1,
    },
    {
      name: SOURCE_PARCEL, //this is the highlight config for the primary selected parcel
      color:  "#0D4D96",
      haloOpacity: 1,
      haloColor: "#0D4D96",
      fillOpacity: .1,
      },
    {
    name: COMPARABLE_PARCEL, //this is the highlight for comparable parcel that is selected
    color:  "#FFA500",
    haloOpacity: 1,
    haloColor: "#FFA500",
    fillOpacity: .1,
    },
    {
    name: NEARBY_PARCEL, //this is the highlight for nearby parcel that is selected
    color:  "#FFA500",
    haloOpacity: 1,
    haloColor: "#FFA500",
    fillOpacity: .1,
    }
]

const typeColors = {
  "Source Parcel": "#0D4D96",
  "Comparable Parcel": "#FFA500",
  "Nearby Parcel": "#90EE90"
};


const Map = () => {

    const { 
        setMapView, 
        arcgisMapRef,
        primaryResultFeature,
        secondaryResultFeature,
        queryPolygon,
        selectPanelClosed,
        togglePanel,
        searchFeatures,
        isMobile,
        comparableParcels,
        setPrimaryResultFeature
        } = UseAppContext()
    
    const actionRef = useRef(null)
    const [parcelLayer, setParcelLayer] = useState(null)
    const [highlightSelect, setHighlightSelect] = useState(null)
    const [highlightSelectComparable, setHighlightSelectComparable] = useState(null)
    const [highlightComparable, setHighlightComparable] = useState(null)
    const [clickedFeature, setClickedFeature] = useState(null)

    const selectedParcelsLayerRef = useRef(null);
    const highlightHandlesRef = useRef({});
    
    const findTargetLayer = (map) => {

        let layer = map.allLayers.find((layer) => {
            ////////console.log("Layer details: ", layer)
            return `${layer.url}/${layer.layerId}` === config.target_layer_url
        })

        return layer
    }

    const zoomToExtent = async (features) => {

        console.log("features selected: ", features)

        if(!arcgisMapRef.current) return;

        const view = arcgisMapRef.current.view

        if(!view) return;

        if(!features) return;

        let extent

        if(Array.isArray(features)){
            const geometries = features.map((feature) => feature.geometry);
            console.log("geometries: ", geometries)
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

    const handleViewClick = async (event) => {

        console.log("Map Clicked")
        
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
          console.log("Clicked feature that is already selected")
          //highlightReselectedParcels(view, reselected)
          //update primary result feature with selected parcel
          const features = await queryPolygon(mapPoint, false) 
         

        }
        else{
          //if selecting new polygon
          const features = await queryPolygon(mapPoint, selectPanelClosed) 
          console.log("Clicked Features: ", features)
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
        graphics.map((g, i) => new Graphic({
          geometry: g.geometry,
          attributes: {
            OBJECTID: g.attributes.OBJECTID || crypto.randomUUID?.() || `${Date.now()}${i}`,
            ...g.attributes,
            parcelSelectionType: type
          }
        }));
    
      const createSelectedParcelsLayer = (view, graphics) => {
      
        return new FeatureLayer({
          title: SELECTED_PARCEL,
          source: new Collection(graphics),
          objectIdField: "OBJECTID",
          fields: [
            new Field({ name: "OBJECTID", type: "oid" }),
            new Field({ name: config.target_layer_id_field, type: "string" }),
            new Field({ name: "parcelSelectionType", type: "string" })
          ],
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
                    width: 2
                  }
                }
              }
            }),
          },
          spatialReference: view.spatialReference
        });
      };
    
      const updateSelectedParcelsLayer = async (map, existing, graphics, type) => {
        
        console.log("updating selected parcels: ",  graphics)
        if(!arcgisMapRef.current){
          return
        }

        const layer = map.allLayers.find(layer => layer.title === SELECTED_PARCEL);
        console.log("found selected parcel layer ",  layer)
        if (!layer) return;

        // const existing = layer.source.toArray();
        console.log("existing features on selected parcels layer: ", existing)

        const incomingIds = new Set(graphics.map(g => {
          g.attributes.OBJECTID
          g.attributes[config.target_layer_id_field]
        }));
        
        const toRemove = existing?.filter(g => {

          if(!selectPanelClosed) return false;

          const isSameType = g.attributes.parcelSelectionType === type;
          const isOverlapping = incomingIds.has(g.attributes.OBJECTID);
          if (type === SOURCE_PARCEL) return true;
          if (
            (type === NEARBY_PARCEL && g.attributes.parcelSelectionType === COMPARABLE_PARCEL) ||
            (type === COMPARABLE_PARCEL && g.attributes.parcelSelectionType === NEARBY_PARCEL)
          ) return true;
          return isOverlapping || isSameType;
        });


        console.log("removing: ", toRemove)
        console.log("adding: ", graphics)

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
          
          console.log("effect query: ", effectQuery)

          
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
    
      const highlightReselectedParcels = async (view, features) => {

        if(!features) return;

          const map = arcgisMapRef.current.map
          if(!view && !map) return;

          const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL)

          if(!layer) return;
          const parcelSelectionType = features.map((feature) => feature.attributes["parcelSelectionType"])
          const type = parcelSelectionType[0] ? parcelSelectionType[0] : SOURCE_PARCEL
  
          console.log("remove existing highlightHandlesRef.current: ", highlightHandlesRef.current)
          if(highlightHandlesRef.current[type]){
            highlightHandlesRef.current[type]?.remove()
          }
          

          console.log("highlighting: ", type)
          const layerView = await view.whenLayerView(layer);

          const highlight = layerView.highlight(
            features.map(g => g.attributes.OBJECTID),
            type
          );

          if(highlight){
            highlightHandlesRef.current[type] = highlight
          }
          

      };
    
      const handleParcelSelection = async (featureOrEvent, name) => {

        console.log("handling new parcel selection: ", name, featureOrEvent)
        if (!arcgisMapRef.current || !featureOrEvent) return;

        const view = arcgisMapRef.current.view;
        const map = arcgisMapRef.current.map;
        if (!view || !map) return;
    
        // const parcelSelectionType = getParcelSelectionType(name);
        const parcelSelectionType = name;
        if (!parcelSelectionType) return;
        

        //if feature event is point
        let rawGraphics
        console.log("featureOrEvent: ", featureOrEvent)
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
          console.log("Source parcel layer not found")
          const newLayer = createSelectedParcelsLayer(view, newGraphics);
          map.add(newLayer);
          map.reorder(layer, map.allLayers.length -1)
        } else {

          console.log("Source parcel layer found")
          const { features } = await layer.queryFeatures()

          const existing = await updateSelectedParcelsLayer(map, features, newGraphics, parcelSelectionType);
          
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
        console.log(`Clearing ${parcelSelectionType} from map`)
        console.log("clearSelectedParcelsByType removing: ", features)

        const toDelete = features.filter(
          (f) => f.attributes.parcelSelectionType === parcelSelectionType
        );

        console.log("clearSelectedParcelsByTypee removing: ", toDelete)

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
                console.log("Updating labels")
                targetLayer.visible = true
                targetLayer.parent.visible = true
            }

            if(!searchFeatures || !searchFeatures[0]){
                //highlightSelect?.remove()
                clearSelectedParcelsByType('Source Parcel')
            }
    
            if(parcelLayer && (searchFeatures)){
               await parcelLayer.load()
                console.log("primary feature selection updated: ", searchFeatures)
                await handleParcelSelection(searchFeatures, SOURCE_PARCEL)

                if( searchFeatures?.length === 1){
                    togglePanel('property')
                }
                else{
                    togglePanel('search')
                }
            }
        }
        
        sourceFeatureSelection()

    }, [parcelLayer, searchFeatures])

    useEffect(() => {

      const highlightSelected = async () => {

        if(!primaryResultFeature || primaryResultFeature?.length === 0 && !arcgisMapRef.current) return; 

        const view = arcgisMapRef.current.view

        const map = arcgisMapRef.current.map;
        if(!map && !view) return;

        const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL);
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
            hideOtherSearchFeatures(true, comparableParcels)
            handleParcelSelection(comparableParcels, COMPARABLE_PARCEL)
          }
           else{
            hideOtherSearchFeatures(false)
            clearSelectedParcelsByType(COMPARABLE_PARCEL)
           }
        } 

        showComparables()


    }, [comparableParcels])

    // useEffect(() => {

    //     const highlightSelectedComparable = async () => {
    //         highlightSelectComparable?.remove()
        
    //         if(!secondaryResultFeature){
    //             highlightSelectComparable?.remove()
    //         }
    
    //         let highlight = await handleParcelSelection(secondaryResultFeature, 'compare-select')
    //         setHighlightSelectComparable(highlight)
    //     }

    //     highlightSelectedComparable()

        
    // }, [secondaryResultFeature])

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
                // if (selectPanelClosed) {
                    handleViewClick(event);
                //}
            }}
        >
            <arcgis-zoom position="top-right" />
            <arcgis-legend position="bottom-right" legend-style="card"></arcgis-legend>
        </arcgis-map>
    </>
    )
}

export default Map