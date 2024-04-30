# Cookviewer Technical Documentation

## Methods for selecting parcels
last updated: 2024-25-04

### Action
User clicks within the map to select a parcel.

### Process

#### Step 1: WebMapComponentBeta.jsx - Receives the click from the user and triggers functions to query features based on click point 
- The `onArcgisViewClick` event handler in the `ArcgisMap` component fires when the user clicks within the map view.
- `onArcgisViewClick` triggers the execution of the `handleViewClick(mapPoint)` function and passes the `event detail mapPoint`.
- The `mapClickEventHandler()` function is executed from `AppContext.jsx`.

#### Step 2: Query features based on point generated from clicking in the map
- The `queryMapPoint()` function does the following:
  - Accesses the `x and y properties` and sets the `global x and y variables` using the `setCoordinates(x, y)`
  - Imports the `queryTargetLayerWithPointFeatures` function from `'../arcgis/search/queryTargetLayer'`.
  - the `mapPoint` is passed to the `queryTargetLayerWithPointFeatures(mapPoint, includeBuffer)` function to return target features. 
  - the `queryTargetLayerWithPointFeatures` function accepts two arguments a a single point feature or array of points and a boolean to include a buffer distance in the Query. 
    - The function checks if the point features are a single point or array.
    - for a single point, the point is used as a the query geometry to create a `Query` object
    - for an array of points, the point geometries are collected into an array and used to create a multipoint feature. the multipoint feature is used as the query geometry a `Query` object
    - the target layer is queried using the `queryFeatures` and the `Query` object to query all target features that intersect with the point or multipoint. the features that are returned are the parcel features
  - Checks if the parcel features are the same as comparable parcels to prevent a new primary parcel from being selected from the comparable parcel list.
    - If the parcel features are in the comparable parcels array then the `secondaryFeatures` are set to the selected parcel features using the `setSecondaryResultFeature`
    - **sets the `panelDisplay` to `propertyDetailNearby` (`propertyDetailNearby` ui is the same as the `propertyDetailComparable` should update this later)**
  - If the parcel features are not the same as the comparable parcels the `PrimaryResultFeature`  is set to the parcel features and the `newSearch` value is set to false to prevent the search widget from triggering a new search once the URL parameter is updated using the `setPrimaryResultFeature` function
  - Sets `panelDisplay` to `resultsList`
 
#### Step 3: Display selected parcel in the map
 - useEffect hooks within the `WebMapComponentBeta` component watches for changes to the `primaryResultFeature`, `comparableParcels`, and `secondaryResultFeature` 
 - When any of selected parcels change, the `addLayerToMap` function is executed and passed the selected parcel features, a title for the new layer that will be created by the features, and a `theme (themes are referenced from theme.js)` for the symbology of the layer
    - `primaryResultFeature` - title is `Selected Parcel` and theme is set to `theme.layers.primary` 
    - `comparableParcels` - title is `Comparable Parcels` and theme is set to `theme.layers.secondary` 
    - `secondaryResultFeature` - title is `Selected Comparable Parcel` and theme is set to `theme.layers.secondarySelected` 
- The `addLayerToMap` function accesses the state of the `ArcgisMap` component using the `arcgisMapRef` useRef
- The map property is accessed from the `arcgisMapRef` useRef
- `removeLayer` - Any existing layers with the same title as the one being added is removed to prevent duplicates selected parcel layers from showing up in the map
  - This function also removes layers for each of the different parcel selection types when parcels are cleared and set to null
- if parcel features are not null, then the `createFeatureLayerFromFeatures` function is used to create a new feature layer, added to the map, and the new features are zoomed to using the `zoomToExtent` function
  - for more info on the `createFeatureLayerFromFeatures` function see the `queryTargetLayer.md`

#### Step 4: URL Parameter Update in Search.jsx
-	When the `primaryResultFeature` property is updated based on the user’s parcel(s) selection, the `useEffect hook sets the url parameter and the search term` depending on the parcel features that are returned from the selection:
  - If the features returned only include 1 parcel then the `pin` parameter is set to `PIN14`
  - If the features returned include more than one parcel AND the pin10s of all the parcels match then the `pin` parameter is set to `PIN10`
  - If the features returned include more than one parcel AND the pin10s do not match BUT the parcel addresses DO match then the `address` parameter is set to the parcel `street_address`
  - If the features returned include more than one parcel AND the pin10s AND the street addresses DO NOT match then the `location` parameter is set to the `x/y` of the mouse click/tap (will generate `x/y` in upcoming issue)
- If the search term in the search bar is not referencing the selected parcel then the search term will be updated to show the PIN or Address
