
import UseAppContext from "../../contexts/AppContext";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";

import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
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
    name: "compare", //this is the highlight for comparables - will eventually be used for nearby
    color:  "#FFA500",
    haloOpacity: 1,
    haloColor: "#FFA500",
    fillOpacity: 0,
    },
    {
    name: "compare-select", //this is the highlight for comparable parcel that is selected - will eventually be used for nearby
    color:  "#FFA500",
    haloOpacity: 1,
    haloColor: "#FFA500",
    fillOpacity: .1,
    }
]

const typeColors = {
  "Source Parcel": "#0D4D96",
  "Comparable Parcels": "#FFA500",
  "Nearby Parcels": "#90EE90"
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
        comparableParcels
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
               extent = features.geometry
        }
        
        if(extent){
            arcgisMapRef.current.goTo(extent)
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
          highlightReselectedParcels(view, reselected)

        }
        else{
          //if selecting new polygon
          const features = await queryPolygon(mapPoint, true) 
          console.log("Clicked Features: ", features)
          setClickedFeature(features) 
        }

    }

    const getParcelSelectionType = (name) => {
        switch (name) {
          case "default": return "Source Parcel";
          case "compare": return "Comparable Parcels";
          case "nearby": return "Nearby Parcels";
          default: return null;
        }
      };
    
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

        const layer = map.allLayers.find(layer => layer.title === SELECTED_PARCEL);
        if (!layer) return [];

        // const existing = layer.source.toArray();
        console.log("existing features on selected parcels layer: ", existing)

        const incomingIds = new Set(graphics.map(g => g.attributes.OBJECTID));

        const toRemove = existing?.filter(g => {
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
    
      const highlightReselectedParcels = async (view, features) => {

          const map = arcgisMapRef.current.map
          const layer = map.allLayers.find((layer) => layer.title === SELECTED_PARCEL)
          const parcelSelectionType = features.map((feature) => feature.attributes["parcelSelectionType"])

          console.log("highlighting: ", parcelSelectionType)
          const layerView = await view.whenLayerView(layer);

          //highlightHandlesRef.current[type] = 
          
          layerView.highlight(
            features.map(g => g.attributes.OBJECTID),
            parcelSelectionType[0]
          );
      
      };
    
      const handleParcelSelection = async (featureOrEvent, name) => {
        if (!arcgisMapRef.current || !featureOrEvent) return;

        const view = arcgisMapRef.current.view;
        const map = arcgisMapRef.current.map;
        if (!view || !map) return;
    
        const parcelSelectionType = getParcelSelectionType(name);
        if (!parcelSelectionType) return;
    
        const rawGraphics = await getGraphicsFromFeatureOrEvent(featureOrEvent, view, map);
        if (!rawGraphics.length || !rawGraphics[0]?.geometry) return;
    
        const newGraphics = createGraphics(rawGraphics, parcelSelectionType);
        let layer = map.allLayers.find(layer => layer.title === SELECTED_PARCEL);
    
        if (!layer) {
          const newLayer = createSelectedParcelsLayer(view, newGraphics);
          map.add(newLayer);
        } else {

          const { features } = await layer.queryFeatures()

          const existing = await updateSelectedParcelsLayer(map, features, newGraphics, parcelSelectionType);
          // await highlightReselectedParcels(map, view, newGraphics, features, parcelSelectionType);
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

        // if (highlightHandlesRef.current?.[parcelSelectionType]) {
        //   highlightHandlesRef.current[parcelSelectionType].remove();
        //   delete highlightHandlesRef.current[parcelSelectionType];
        // }
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

        //view.highlights = highlights

        setMapView(view)

        //find parcel layer
        const targetLayer = await findTargetLayer(map)
        setParcelLayer(targetLayer)
    }

    //Clear all highlights when parcels are cleared
    useEffect(() => {

        const primarySelection = async () => {

  
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

            //highlightSelect?.remove()
            
            
    
            if(!searchFeatures || !searchFeatures[0]){
                //highlightSelect?.remove()
                clearSelectedParcelsByType('Source Parcel')
            }
    
            if(parcelLayer && (primaryResultFeature)){
                console.log("primary feature selection updated: ", primaryResultFeature)
                let highlight = await handleParcelSelection(primaryResultFeature, 'default')
                //highlight selection
                //setHighlightSelect(highlight)
                if( primaryResultFeature?.length === 1){
                    togglePanel('property')
                }
                else{
                    togglePanel('search')
                }
            }
        }
        
        primarySelection()

    }, [primaryResultFeature, parcelLayer, searchFeatures, clickedFeature])


    useEffect(() => {

        const highlightComparables = async () => {
            highlightComparable?.remove()

            if(!comparableParcels || comparableParcels.length === 0){
                highlightComparable?.remove()
                clearSelectedParcelsByType('compare')
            }
            
            let highlight = await handleParcelSelection(comparableParcels, 'compare')
            setHighlightComparable(highlight)
        } 

        highlightComparables()


    }, [comparableParcels])

    useEffect(() => {

        const highlightSelectedComparable = async () => {
            highlightSelectComparable?.remove()
        
            if(!secondaryResultFeature){
                highlightSelectComparable?.remove()
            }
    
            let highlight = await handleParcelSelection(secondaryResultFeature, 'compare-select')
            setHighlightSelectComparable(highlight)
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
                if (selectPanelClosed) {
                    handleViewClick(event);
                }
            }}
        >
            <arcgis-zoom position="top-right" />
            <arcgis-legend position="bottom-right" legend-style="card"></arcgis-legend>
        </arcgis-map>
    </>
    )
}

export default Map