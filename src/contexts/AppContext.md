# App Context Documentation

## Overview
The `AppContext` and `AppProvider` provide a global state management solution for handling application-wide data in a React application. The context allows components to update and access state without requiring direct prop drilling.

## AppContext
`AppContext` is created using React's `createContext`, initialized with `initialState`. It serves as a centralized store for the application's state.

```javascript
export const AppContext = createContext(initialState);
```

## AppProvider
`AppProvider` is a context provider that wraps the application, providing state management using `useReducer` with `AppReducer` and `initialState`.

```javascript
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
```

### State Management Functions
Each function below dispatches an action to update a specific part of the application state.

#### 1. `setComparableType(comparableType)`
Sets the type of comparison being performed.

#### 2. `setMapContainer(ref)`
Stores a reference to the map container.

#### 3. `setMapViewScale(view)`
Updates the scale of the map view.

#### 4. `setMapView(view)`
Sets the current map view.

#### 5. `setPrimaryResultFeature(feature, newSearch=true)`
Updates the primary search result feature.

#### 6. `setSecondaryResultFeature(feature)`
Sets a secondary result feature.

#### 7. `setCoordinates(x, y)`
Stores coordinate values.

#### 8. `setSearchResults(results, features, searchTerm, prevSearchFeatures)`
Updates search results along with associated metadata.

#### 9. `setSearchSources(searchSources)`
Sets available search sources.

#### 10. `setSearchBufferGeometry(searchResultPoint, searchBufferGeometry)`
Stores geometry for buffer-based searches.

#### 11. `setPanelDisplay(state)`
Controls the visibility state of the primary panel.

#### 12. `setPanelSecondaryVisibility(visible)`
Controls the visibility of the secondary panel.

#### 13. `setPanelPrimaryVisibility(visible)`
Sets visibility for the primary panel.

#### 14. `setPanelDisplaySecondary(state)`
Controls secondary panel display state.

#### 15. `setPanelWidgetVisibility(visible)`
Manages widget visibility within the panel.

#### 16. `setPanelDisplayWidget(state)`
Controls the widget display state.

#### 17. `setDataDictionary(features)`
Updates the data dictionary used within the application.

#### 18. `setParcelQueryFields(fields)`
Stores query fields for parcel searches.

#### 19. `setScreenWidth(width)`
Tracks the screen width for responsive design adjustments.

#### 20. `setComparableParcels(features)`
Updates the list of comparable parcels.

#### 21. `setNearbyParcels(features)`
Updates the list of nearby parcels.

#### 22. `setMeasureWidgetState(state)`
Manages the state of the measure widget.

#### 23. `setLanguage(language)`
Sets the application's language.

#### 24. `setTranslateDialogOpen(open)`
Controls whether the translation dialog is open.

#### 25. `setTranslationDictionary(dictionary)`
Stores translations for the application.

#### 26. `setShowMapMobile(show)`
Controls the visibility of the map on mobile devices.

#### 27. `setMeasureWidget(widget)`
Updates the measure widget reference.

#### 28. `setIsQuerying(querying)`
Tracks whether a query is in progress.

#### 29. `setMapPrintProps(mapLayout, mapFormat, mapTitle)`
Stores properties for map printing.

#### 30. `setOpenHelpDialog(open)`
Controls the state of the help dialog.

#### 31. `setSelectMultiple(select)`
Allows multiple selection mode.

### Usage
To access or modify the state, use the `AppContext` within a component:

```javascript
import { useContext } from 'react';
import { AppContext } from './AppContext';

const MyComponent = () => {
    const { setMapView } = useContext(AppContext);
    
    return (
        <button onClick={() => setMapView('newView')}>Change View</button>
    );
};
```

**State Variables**
- [ ] ~~mapContainer~~ - variable for global mapContainer ref element for map DOM. deprecated and replaced with arcMapRef
- [ ] ~~mapViewScale~~ - deprecated in 3.1. duplicate of the mapView. Was used to keep the scale property from the mapView object current. Variable was a dependency in the LayerListCustomComponent which was deprecated 3.1. 
- [ ] **mapView** - a global state variable for mapView object: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html.
- [ ] **primaryResultFeature** - a global state variable that stores an array of [feature objects](https://developers.arcgis.com/rest/services-reference/enterprise/feature-object/). These objects represent the primary features selected from the map or the search results pane.
- [ ] **searchSources** - a global variable that stores the [searchSource](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchSource.html) object returned from the `createSearchSources` function. Required for the `SearchBar` component.
- [ ] ~~searchResults~~ - deprecated 3.0.2. a global variable that stores the state of the [searchResults](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-types.html#SearchResult) object returned from the `returnSearchResultFeatures` function and set using the `setSearchResults` function. 
- [ ] ~~prevSearchFeatures~~ - deprecated 3.1 with the implementation of the hittest to set the primaryResultFeature without overwriting the searchFeatures. 
- [ ] **searchTerm** - a global variable that stores the user input from the `SearchbarComponent`. This input is used as the value for the search url parameter value. set using the `setSearchResults` function. 
- [ ] **searchResultPoint** - a global variable used in combination with the searchBufferGeometery to display the search radius when an address locator result is returned. this stores the result geometry from the search result object in the `setSearchBufferGeometry` function and is set using the `setSearchBufferGeometry` function. This is consumed as the point geometry for the graphics layer in the `Map` component. 
- [ ] **searchBufferGeometry** - a global variable used in combination with the searchResultPoint to display the search radius when an address locator result is returned. this stores the result geometry from the search result object in the `setSearchBufferGeometry` function and is set using the `setSearchBufferGeometry` function. This is consumed as the polygon geometry for the graphics layer in the `Map` component.
- [ ] **searchFeatures** - a global state variable that stores an array of [feature objects](https://developers.arcgis.com/rest/services-reference/enterprise/feature-object/). These objects represent the result features returned from a query (locator search results or spatial query Select) and are used throughout the app to manage and display parcel selection results.
- [ ] ~~panelDisplay~~ - deprecated in 3.1. Previously stored a value representing the content in the left panel. Used in a switch statement to update the ui between search results and property details.
- [ ] ~~panelSecondaryVisible~~ - deprecated 3.1. Replaced with individual global states for each panel content type ie, results, comparables, nearby, etc
- [ ] ~~panelDisplaySecondary~~ - deprecated 3.1. Replaced with individual global states for each panel content type ie, results, comparables, nearby, etc
- [ ] ~~panelPrimaryVisible~~ - deprecated 3.1. Replaced with individual global states for each panel content type ie, results, comparables, nearby, etc
- [ ] **dataDictionary** - a global state variable that stores a feature table with all the fields, field types, and hyperlinks for all the data displayed in the property details panel. 
- [ ] ~~parcelQueryFields~~ - deprecated 3.1. Was previously used as a parameter in the `compareProperties` function to set the fields returned from a feature query. Replaced with "*" to return all fields.
- [ ] **screenWidth** - a global state variable that stores the screenWidth by watching for changes using an 'resize' even listener in AppContext.
- [ ] newSearch
- [ ] comparableParcels
- [ ] secondaryResultFeature
- [ ] measureWidgetState
- [ ] language
- [ ] translateDialogOpen
- [ ] textTranslationDictionary
- [ ] showMapMobile
- [ ] measureWidget
- [ ] isQuerying
- [ ] mapTitle
- [ ] mapLayout
- [ ] mapFormat
- [ ] x
- [ ] y
- [ ] openHelpDialog
- [ ] panelWidgetVisible
- [ ] panelDisplayWidget
- [ ] selectMultiple
- [ ] comparableType
- [ ] infoPanelClosed
- [ ] searchResultsPanelClosed
- [ ] propertyDetailPanelClosed
- [ ] comparablePanelClosed
- [ ] nearbyPanelClosed
- [ ] comparisonResultsClosed
- [ ] comparisonDetailPanelClosed
- [ ] layersPanelClosed
- [ ] imageryPanelClosed
- [ ] printPanelClosed
- [ ] measurePanelClosed
- [ ] selectPanelClosed
- [ ] helpPanelClosed

**Functions**
- [ ]  ~~loadMap~~ - Function that initializes the map by setting up the map container, search sources, and zooming to extent of selected features. Deprecated in 3.1 and replaced with argis-map component. 
    - ~~initializeMap~~ - Called from webmap.js is also deprectated in 3.1 and replaced with the the arcgis-map component
- [ ]  ~~setMapContainer~~ - A global state setter used to update the mapContainer variable. Deprecated in 3.1
- [ ]  **setMapView** - function to set the global state of the mapView variable.
- [ ] ~~setMapViewScale~~ - deprecated in 3.1
- [ ] **setPrimaryResultFeature** - A global state setter function used to update the value of `primaryResultFeature`. It accepts an array of [feature objects](https://developers.arcgis.com/rest/services-reference/enterprise/feature-object/) and replaces the current state with the new set of primary query results.
- [ ] **setSearchResults** - A global state setter used to update the searchFeatures and searchTerm variables.
- [ ] **setSearchBufferGeometry** - A global state setter used to update the searchResultPoint and searchBufferGeometry variables.
- [ ] **setSearchSources** - A global state setter used to update the searchSources variable. Used in the `createSearchSources` function and updated in the `translateSearchSources` function to update state when the language variable changes. 
- [ ] ~~renderSearchResults~~ - deprecated 3.1. function that previously accepted the search result geometry and rendered them in the map widget. Replaced with `createSelectedParcelsLayer` and `updateSelectedParcelsLayer`functions in `Map` component
- [ ] clearResults
- [ ] ~~setPanelDisplay~~ - deprecated 3.1. Replaced with individual global state setters for each panel content type ie, results, comparables, nearby, etc,
- [ ] ~~setPanelSecondaryVisibility~~-  - deprecated 3.1. Replaced with individual global state setters for each panel content type ie, results, comparables, nearby, etc,
- [ ] ~~setPanelDisplaySecondary~~ - deprecated 3.1. Replaced with individual global state setters for each panel content type ie, results, comparables, nearby, etc,
- [ ] selectResultFromList,
- [ ] searchComparableProperties,
- [ ] ~~setPanelPrimaryVisibility~~ - deprecated 3.1. Replaced with individual global states for each panel content type ie, results, comparables, nearby, etc
- [ ] **loadDataDictionary** - a global state setter used to updated the dataDictionary variable by querying the table data in the dataDictionary feature table service stored in AGO
- [ ] ~~setParcelQueryFields~~ - deprecated 3.1  with global state variable parcelQueryFields
- [ ] **setScreenWidth** - a global state setter to update the screenWidth variable by passing the window.innerWidth when it changes (AppContext)
- [ ] searchNearbyProperties
- [ ] setSecondaryResultFeature
- [ ] clearResultsComparables
- [ ] addSecondaryFeatureToMap
- [ ] setMeasureWidgetState
- [ ] toggleMapLayer
- [ ] setLanguage
- [ ] setTranslateDialogOpen
- [ ] setTranslationDictionary
- [ ] translateText
- [ ] setShowMapMoblie
- [ ] setMeasureWidget
- [ ] setIsQuerying
- [ ] setMapPrintProps
- [ ] setCoordinates
- [ ] ~~returnLocationFeatures~~ - deprecated in v3.0.0-beta-3. Global setter function to return parcel features usingx/y coordinates
- [ ] setOpenHelpDialog
- [ ] setPanelWidgetVisibility
- [ ] setPanelDisplayWidget
- [ ] queryMapPoint - deprecated 3.1 replaced with `hitTest` in the `Map` component
- [ ] setComparableParcels
- [ ] initalizeSearchSources
- [ ] returnSearchResultFeatures
- [ ] anyAttributesIncluded
- [ ] setSelectMultiple
- [ ] queryPolygon
- [ ] setComparableType
- [ ] **returnFeaturesByPin10Pin14** - function that queries the target layer using PIN10 and PIN14 values and returns features. Used to update the state of the `primaryResultFeatures` and `searchFeatures` from url param value.
- [ ] returnSearchParam
- [ ] setInfoPanel
- [ ] setSearchResultsPanel
- [ ] setPropertyDetailPanel
- [ ] setComparablePanel
- [ ] setNearbyPanel
- [ ] setComparisonResultsPanel
- [ ] setComparisonDetailPanel
- [ ] togglePanel
- [ ] setLayersPanel
- [ ] setImageryPanel
- [ ] setPrintPanel
- [ ] setMeasurePanel
- [ ] setSelectPanel
- [ ] setHelpPanel
- [ ] deselectParcel
- [ ] setExportOpen
- [ ] setFeedbackDialog
- [ ] setIsMobile
- [ ] setTourDialogOpen
- [ ] setSuppressTourDialog

**Refs**
arcgisMapRef
refSearch

**Hooks**



