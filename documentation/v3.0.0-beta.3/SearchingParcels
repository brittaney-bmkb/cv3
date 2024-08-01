# Cookviewer Technical Documentation

## Methods for searching for parcels
last updated: 2024-25-04

### Action 1
User types in a complete pin number in the search bar and presses enter or clicks a result from the parcel pin search suggestions.

### Process

#### Step 1: `Search.jsx` - Search widget search-complete event fires and triggers functions to return features from search result
- `search-complete` event handler is triggered and returns a search event containing the [search result object](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#events-summary)
- the search results are passed to the `returnSearchResultFeatures()` function which is referenced from `AppContext`
    - the `returnSearchResultFeatures()` wraps the `handleMultipleResults()` function referenced from `queryTargetLayer.js` 
    - the `handleMultipleResults()` returns features by accessing the features from the `search results object` 
        - this function checks if the search source is the same as the target layer source 
        - if the search and target source are the same then the all the features are return without any manipulation. **NOTE: number of features returned are controlled by the `maxResults` `searchSource` setting in the `config.js`**
        - if the search source is different (like a locator source) than the target layer then the geometry is used to query the target layer and the intersectiong target features are returned using the `queryTargetLayerWithPointFeatures` function
        - for more info see `queryTargetLayer.md`
    - Once the target features are returned, the `primaryResultFeature` and `searchResults` is set using the `setPrimaryResultFeature` and `setSearchResults`

### Action 2
User types in a partial pin number in the search bar and presses enter.

### Process - this process is the same as Action 1
- In the v3.0.0-beta.1 version the `autoSelect` property of the search widget was set to true, which prevented all the search results from being returned when a partial search string is entered
- In this current version the `autoSelect` property is set to false which allows the search results to be controlled and fully accessed for the `search-complete` event handler. see `Change Log` for the `Search.jsx` component for more details

### Action 3
User types in a complete address in the search bar and selects a result from the address locator suggestions.

### Process - this process follows the same steps as Action 1 within one change
- When a search result from the address locator suggestions is selected, it triggers a spatial query between the search result point feature and the target layer (parcel layers)
- When the `queryTargetLayerWithPointFeatures` accepts the search result features and a boolean to determine if a buffer distance should be includeed in the query
- For address locator search results the boolean is set to true and the `buffer_distance` & `buffer_unit` variables accessed from `config.js` are included in the `Query` object to perform a spatial intersection query with a buffer distance 

### Action 4
User includes a search query `search=123 happy street` as a url parameter after the cookViewer url.

### Process - this process accesses the search vaules from the url parameter then follows the steps from Action 1

#### Step 1: `Search.jsx` - Search widget useEffect hook accesses url parameters and executes search method
- url paramter values are queried for each type:
    - `location` - x,y coordinates
    - `pin` - parcel pin 10 or 14
    - `search` - generic search string, full or partial pin or address
    - `address` - address string
- for this action the `search` parameter is accessed and updates the `genericSearch` state.
    ``` 
    setGenericSearch(routeParams.get("search")) 
    ```
- On load the `newSearch` global variable is set to true, so when the searchWidget initally mounts it meets the condition to perform a new search using the values accessed from the `genericSearch` state
    ```
    searchWidget.current.search(genericSearch)
    ```
- Once the search is performed on the `genericSearch`, the `search-complete` event handler is triggered and the steps from `Action 1` are performed 

### Action 5
User includes a search query `location=1175293.981658909,1900287.819737036` as a url parameter after the cookViewer url.

### Process this process accesses the search values from the url parameter then queries the target (parcel) layer by creating a point using the coordinates in the url

#### Step 1: Follows the steps from Action 4 with one change
- After accessing the coordinates from the url parameter and setting the `locationSearch` state to the coordinate values
- When the `locationSearch` is populated the `returnLocationFeatures` function is called and passed the coordinates to return parcel features. 
    - the `returnLocationFeatures` is referenced from the `AppContext`
    - the `returnLocationFeatures` wraps the `queryTargetLayerWithCoordinates` from the `queryTargetLayer.js`
    - the `queryTargetLayerWithCoordinates` parses out the x and y coordinates from the coordinates string and converts the values to floats
    - a new point is created based on the x and y values and spatial reference of the targetLayer (**Note: the spatial reference for this app is the same for all our data source. this could break if a target layer with a different spatial reference is used**)
    - the new point is then passed to the `queryTargetLayerWithPointFeatures` and the `buffer distance boolean undefined` so a buffer distance is not applied to the query


### Action 6
User types in an address and selects a parcel address search result from the dropdown.

### Process checks if the search result source fields includes 'street_address' to indicate that the results were selected from the parcel address search source, then performs a query on the target layer using the street_address and city_state_zip values

#### Step 1: Follows steps from Action 1 with an additional condition to check if search result source fields includes `street_address`. 
- After determining that the search result was selected from the parcel address search source the street_address and city_state_zip values are extracted from each search result
- The extracted values are pushed into the address array
- If the address array is populated then a query is perfromed on the target layer using the `queryTargetLayerByAddress` function
- The addresses are passed to the `queryTargetLayerByAddress` function and parsed into a query string `(street_address = '${street_address}' AND city_state_zip = '${city_state_zip}')`
- the query string is passed to the query.where property 
- the target layer features are queried using the new query with the query string
- features are returned and added to the targetFeatures array
