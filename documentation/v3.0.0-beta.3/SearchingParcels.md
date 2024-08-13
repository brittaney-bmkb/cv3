# Cookviewer Technical Documentation

## Methods for searching for parcels
last updated: 2024-08-13

- [Complete PIN14 Search](#complete-pin14-search)
- [PIN10 Search](#pin10-search)
- [Partial PIN Search](#partial-pin-search)

## User uses PIN14, PIN10, or Partial PIN

### Complete PIN14 Search
User types in a complete PIN14 in the search bar and presses enter or clicks a result from the parcel PIN search suggestions.

### Expected Behavior
| Action | URL Parameters | Property Results | Map | Search Term |
|---|---|---|---|---|
| User types or selects Full PIN 14 | search = User Provided PIN  | one result of PIN 14 | Displays one parcel and zooms  | Shows - formatted PIN 14 dash if user selects a result or User Provided PIN if user presses enter |

### Process

| Code | Description |
| --- | --- | 
| searchWidget.current.on("search-complete", (event) => {<br><br>&nbsp;console.log("search complete event:", event)<br><br>&nbsp;let results;<br>&nbsp;results = event.results<br>&nbsp;console.log("results for multiple results: ", event)<br><br>&nbsp;setIsQuerying(true)<br><br>&nbsp;returnSearchResultFeatures(results,searchWidget.current.searchTerm)<br><br>&nbsp;setSearchParams({<br>&nbsp;&nbsp;&nbsp;&nbsp;'search': searchWidget.current.searchTerm<br>&nbsp;&nbsp;&nbsp;&nbsp;})<br><br>&nbsp;updateAppWithSearchResult()<br><br>&nbsp;setIsQuerying(false)<br>})| 1) **search-complete** event handler is triggered once the user presses enter or clicks a result and returns a search event containing search candidates inside the [search result object](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#events-summary)<br><br> 2) The results property is set to the results variable<br><br> 3) **IsQuerying** state is set to true to trigger loading animation inside the results panel while result features and attributes are queried<br><br> 4) **returnSearchResultFeatures()** is executed with search results and the user provided PIN14 is referenced from the searchWidget searchTerm. This function updates the state of the primaryFeatureResult that is displayed as results in the result list and graphically as a layer in the webmap. See details in `/data/AppContext.md` <br><br> 5) **updateAppWithSearchResult()** executed to open left panel and display results list if the panel is closed and URL Parameter is updated with the **search** parameter and the searchWidget search term as the parameter value using the setSearchParams() function <br><br> 6) Once result features are returned **IsQuerying** state is set to false to remove loading animation|
---
### PIN10 Search
User types in PIN10 and presses search or hits enter 

### Expected Behavior
| Action | URL Parameters | Property Results | Map | Search Term |
|---|---|---|---|---|
| User types in PIN10 and presses search or hits enter ( does not select a suggestion) | search=Users search term | return all of parcel records where PIN10 is equal to search term | Displays all parcels with PIN10 | User search term |

### Process - this process is the same as Complete PIN14 Search
- In the v3.0.0-beta.1 version the `autoSelect` property of the search widget was set to true, which prevented all the search results from being returned when a partial search string is entered
- In the v3.0.0 version the [autoSelect property](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#autoSelect) is set to false to prevent the app from selecting the first result and zooming to the geocoded point on the map. Instead the search results are managed using the `search-complete` event handler. see `Change Log` for the `Search.jsx` component for more details
---
### Partial PIN Search
User types in a partial pin number in the search bar and presses enter.

### Expected Behavior
| Action | URL Parameters | Property Results | Map | Search Term|
|---|---|---|---|---|
| User types in partial PIN and presses enter | search=Users search term | Returns all of the search result features where partial PIN is beginning of PIN14 | Returns all of the parcels using the geometry from the search results | User search term |

### Process - this process is the same as a complete PIN14 search
- In the v3.0.0-beta.1 version the `autoSelect` property of the search widget was set to true, which prevented all the search results from being returned when a partial search string is entered
- In the v3.0.0 version the [autoSelect property](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#autoSelect) is set to false to prevent the app from selecting the first result and zooming to the geocoded point on the map. Instead the search results are managed using the `search-complete` event handler. see `Change Log` for the `Search.jsx` component for more details
- In the v3.0.0 version the [Parcel Layer](https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0) is used as a [LayerSearchSource](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-LayerSearchSource.html) in the Search Widget to return results for Parcel PIN (PIN10 & PIN14) searches. 
    - **Note**: PIN searches use PIN10, PIN14, PIN14_dash as searchFields which are all string fields. For LayerSearchSources there is no leading wildcard to return results that include or contain a portion of the PIN search string. The returned results are either exact matches or start with the user provided PIN search string, which allows partial string searches to be performed.   

--- 

### User includes a search query as a url parameter - PIN14
User includes a search query `search= {a PIN14 value}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action | URL Parameters | Property Results | Map | Search Term |
|---|---|---|---|---|
| User types in url with "search=PIN14" | search=User Provided Pin | one result of PIN 14 | Displays one parcel and zooms  | Shows - formatted PIN 14 dash |

### Process - this process accesses the search vaules from the url parameter then follows the steps from Complete PIN14 Search

#### Step 1: `Search.jsx` - Search widget useEffect hook accesses url parameters and executes search method
- url paramter values are queried for each type:
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
- Once the search is performed on the `genericSearch`, the `search-complete` event handler is triggered and the steps from `Complete PIN14 Search` are performed 

### User includes a search query as a url parameter - PIN10
User includes a search query `search= {a PIN10 value}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                                | URL Parameters           | Property Results                                                 | Map                             | Search Term      |
|---------------------------------------|--------------------------|------------------------------------------------------------------|---------------------------------|------------------|
| User types in url with "search=PIN10" | search=Users search term | return all of parcel records where PIN10 is equal to search term | Displays all parcels with PIN10 | User search term |

### Process - this process accesses the search vaules from the url parameter then follows the steps from Complete PIN14 Search

#### Step 1: `Search.jsx` - Search widget useEffect hook accesses url parameters and executes search method
- url paramter values are queried for each type:
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
- Once the search is performed on the `genericSearch`, the `search-complete` event handler is triggered and the steps from `Complete PIN14 Search` are performed 

### User includes a search query as a url parameter - Partial PIN
User includes a search query `search= {a Partial PIN value}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                      | URL Parameters          | Property Results                                                                                                                                                                                             | Map                                                                                                                                                                                              | Search Term      |
|-----------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| url search with partial PIN | search=user search term | If parcel layer source: Return all of the search result features where partial PIN is beginning of PIN14/If parcel locator source: Returns al of the results where the partial pin is contained in PIN14 | Layer source: Return all of the parcels using the geometry from the search results.//Locator source: Point in polygon query for each result or sql query where PIN14 is like partial pin | User search term |

### Process - this process accesses the search vaules from the url parameter then follows the steps from Complete PIN14 Search

#### Step 1: `Search.jsx` - Search widget useEffect hook accesses url parameters and executes search method
- url paramter values are queried for each type:
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
- Once the search is performed on the `genericSearch`, the `search-complete` event handler is triggered and the steps from `Complete PIN14 Search` are performed 

### User includes a search query as a url parameter - Multiple PINs
User includes a search query `PIN14= {a list of PIN14s}' and/or 'PIN10={a list of PIN10s}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                       | URL Parameters                                     | Property Results                                                                                                         | Map                                                            | Search Term |
|------------------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|-------------|
| url search for multiple pins | PIN14={list of PIN14} and/or PIN10={list of PIN10} | Parcel layer source: Return all parcels from sql parcel query where PIN14 in {list of PIN14} or PIN10 in {list of PIN10} | DIsplay the parcel geometry from the parcel layer source query | Null        |

### Process - this process accesses the search vaules from the url parameter then follows the steps from Complete PIN14 Search

#### Step 1: `Search.jsx` - Search widget useEffect hook accesses url parameters and executes search method
- url paramter values are queried for each type:
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
- Once the search is performed on the `genericSearch`, the `search-complete` event handler is triggered and the steps from `Complete PIN14 Search` are performed 

## User uses Street Address, Partial Street Address, or Intersection
### Street Address entered and address locator suggestion selected
User types in a complete address in the search bar and selects a result from the address locator suggestions.

### Expected Behavior

| Action                                                                                                                      | URL Parameters                    | Property Results                                                             | Map                                                                                           | Search Term                |
|-----------------------------------------------------------------------------------------------------------------------------|-----------------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|----------------------------|
| User types in an address and locator address suggestions are returned, user selects  one of the  address locator suggestion | search="StAddr"+ "City"+ "Postal" | Returns the intersecting parcels and buffered parcels from the address point | zoom in, display marker, display buffer ring, display parcels that intersect with buffer ring | "StAddr"+ "City"+ "Postal" |

### Process - this process follows the same steps as Complete PIN14 Search with one change
- When a search result from the address locator suggestions is selected, it triggers a spatial query between the search result point feature and the target layer (parcel layers)
- When the `queryTargetLayerWithPointFeatures` accepts the search result features and a boolean to determine if a buffer distance should be includeed in the query
- For address locator search results the boolean is set to true and the `buffer_distance` & `buffer_unit` variables accessed from `config.js` are included in the `Query` object to perform a spatial intersection query with a buffer distance 

### Street Address entered and parcel address suggestion selected
User types in an address and selects a parcel address search result from the dropdown.

### Expected Behavior

| Action                                                                                                                   | URL Parameters                    | Property Results                                                                                                                           | Map                                          | Search Term                                 |
|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|---------------------------------------------|
| User types in an address and parcel address suggestions are returned, user selects  one of the parcel address suggestion | search=street_addr+city_state_zip | Return all of parcels from parcel layer query: where=street_address LIKE 'Result.street_address% AND city_state_zip= Result.city_state_zip | Displays all parcels from parcel layer query | Result.street_address+result.city_state_zip |

### Process checks if the search result source fields includes 'street_address' to indicate that the results were selected from the parcel address search source, then performs a query on the target layer using the street_address and city_state_zip values

#### Step 1: Follows steps from Complete PIN14 Search with an additional condition to check if search result source fields includes `street_address`. 
- After determining that the search result was selected from the parcel address search source the street_address and city_state_zip values are extracted from each search result
- The extracted values are pushed into the address array
- If the address array is populated then a query is perfromed on the target layer using the `queryTargetLayerByAddress` function
- The addresses are passed to the `queryTargetLayerByAddress` function and parsed into a query string `(street_address = '${street_address}' AND city_state_zip = '${city_state_zip}')`
- the query string is passed to the query.where property 
- the target layer features are queried using the new query with the query string
- features are returned and added to the targetFeatures array

### Street Address with Unit entered and address locator suggestion selected
User types in a complete address in the search bar and selects a result from the address locator suggestions.

### Expected Behavior

| Action                                                                                                                                                                                     | URL Parameters          | Property Results                                             | Map                                                            | Search Term      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|--------------------------------------------------------------|----------------------------------------------------------------|------------------|
| User types in search for address with unit and selects an address locator suggestion (Search: 2555 W LELAND AVE, #301, CHICAGO, IL, 60625 Selects: 2555 W LELAND AVE, CHICAGO, IL, 60625 ) | search=user search term | point in polygon search with result for units in search area | DIsplay the parcel geometry from the parcel layer source query | User search term |

### Process - this process follows the same steps as Complete PIN14 Search with one change
- When a search result from the address locator suggestions is selected, it triggers a spatial query between the search result point feature and the target layer (parcel layers)
- When the `queryTargetLayerWithPointFeatures` accepts the search result features and a boolean to determine if a buffer distance should be includeed in the query
- For address locator search results the boolean is set to true and the `buffer_distance` & `buffer_unit` variables accessed from `config.js` are included in the `Query` object to perform a spatial intersection query with a buffer distance 


### Street Address with Unit entered and parcel address suggestion selected
User types in an address with unit and selects a parcel address search result from the dropdown.

### Expected Behavior

| Action                                                                                                                           | URL Parameters          | Property Results                                                                                                   | Map                                                            | Search Term      |
|----------------------------------------------------------------------------------------------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|------------------|
| User types in search for address with unit and selects a parcel locator suggestion (2555 W LELAND AVE, #301, CHICAGO, IL, 60625) | search=user search term | Parcel layer source:  If unit is populated, return parcels from sql query using full address (all address fields). | DIsplay the parcel geometry from the parcel layer source query | User search term |

### Process checks if the search result source fields includes 'street_address' to indicate that the results were selected from the parcel address search source, then performs a query on the target layer using the street_address and city_state_zip values

#### Step 1: Follows steps from Complete PIN14 Search with an additional condition to check if search result source fields includes `street_address`. 
- After determining that the search result was selected from the parcel address search source the street_address and city_state_zip values are extracted from each search result
- The extracted values are pushed into the address array
- If the address array is populated then a query is perfromed on the target layer using the `queryTargetLayerByAddress` function
- The addresses are passed to the `queryTargetLayerByAddress` function and parsed into a query string `(street_address = '${street_address}' AND city_state_zip = '${city_state_zip}')`
- the query string is passed to the query.where property 
- the target layer features are queried using the new query with the query string
- features are returned and added to the targetFeatures array

### User types partial Street Address and presses enter
User types in a partial address in the search bar and presses enter. 

#### Examples
- An apartment with multiple addresses: 4621 N Rockwell, 69 W Washington
- A single address: 913 East Olive

### Expected Behavior

| Action                                                                                                                                                                          | URL Parameters          | Property Results                                                                                                                                                                                                                                                                                                          | Map                                                                                                                                                                                                                                                                                             | Search Term      |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| User types in a partial street address and presses enter (A Ex: Apt Building w/ multiple addresses: 4621 N Rockwell vs 4621 S Rockwell | B Ex: 913 East Olive; 69 W Washington) | search=user search term | Search term is submitted to the address locator service - if search term is contained in any of the fields - attributes of the match and an address point is returned - that is then used to find a buffer spatial intersect with parcel layer and those are returned and displayed in the Property Results pane | ParcelLayer source: Return all of the parcels using the geometry from the search results.//Parcel Locator source: Point in polygon query for each result or sql query where PIN14 is like partial pin//Address Locator: buffer from address point; display; display buffer ring | User search term |

### Process - this process follows the same steps as Complete PIN14 Search with one change
- When a search result from the address locator suggestions is selected, it triggers a spatial query between the search result point feature and the target layer (parcel layers)
- When the `queryTargetLayerWithPointFeatures` accepts the search result features and a boolean to determine if a buffer distance should be includeed in the query
- For address locator search results the boolean is set to true and the `buffer_distance` & `buffer_unit` variables accessed from `config.js` are included in the `Query` object to perform a spatial intersection query with a buffer distance 

### Intersection entered and address locator suggestion selected
User types an intersection in the search bar and selects a result from the address locator suggestions.

### Expected Behavior

| Action                                                                  | URL Parameters                                                         | Property Results                            | Map                                                                                                                      | Search Term          |
|-------------------------------------------------------------------------|------------------------------------------------------------------------|---------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------------|
| User types in an intersection and selects suggested result from locator | search= user search term with string replace to replace '&' with 'and' | Show parcels that intersect with the buffer | zoom in, display marker, display buffer ring, display parcels that intersect with buffer ring. Only With Address Locator | User selected result |

### Process - this process follows the same steps as Complete PIN14 Search with one change
- When a search result from the address locator suggestions is selected, it triggers a spatial query between the search result point feature and the target layer (parcel layers)
- When the `queryTargetLayerWithPointFeatures` accepts the search result features and a boolean to determine if a buffer distance should be includeed in the query
- For address locator search results the boolean is set to true and the `buffer_distance` & `buffer_unit` variables accessed from `config.js` are included in the `Query` object to perform a spatial intersection query with a buffer distance 


### User includes a search query as a url parameter - partial or full address
User includes a search query `search= {user search term}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                                  | URL Parameters          | Property Results                                                                                                                                                                                                                                                                      | Map                                                                                                                                                                                                                                                                                             | Search Term      |
|-----------------------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| url search with partial or full address | search=user search term | A. Address Locator: returns all candidates and buffered parcels | B. Parcel Locator: Returns all candidates, NO buffer. Depends on source - If parcel results no Address locator Show parcel that intersects w/address point first & if parcel true do we prioritize? YES? we can try | ParcelLayer source: Return all of the parcels using the geometry from the search results.//Parcel Locator source: Point in polygon query for each result or sql query where PIN14 is like partial pin//Address Locator: buffer from address point; display; display buffer ring | User search term |

### Process - this process accesses the search vaules from the url parameter then follows the steps from Complete PIN14 Search

#### Step 1: `Search.jsx` - Search widget useEffect hook accesses url parameters and executes search method
- url paramter values are queried for each type:
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
- Once the search is performed on the `genericSearch`, the `search-complete` event handler is triggered and the steps from `Complete PIN14 Search` are performed 

### User includes a search query as a url parameter - intersection
User includes a search query `search= {user search term}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                      | URL Parameters                      | Property Results                            | Map                                                                      | Search Term      |
|-----------------------------|-------------------------------------|---------------------------------------------|--------------------------------------------------------------------------|------------------|
| url search for intersection | search= user search term with 'and' | Returns all candidates and buffered parcels | Address Locator: buffer from address point; display; display buffer ring | User search term |

### Process - this process accesses the search vaules from the url parameter then follows the steps from Complete PIN14 Search

#### Step 1: `Search.jsx` - Search widget useEffect hook accesses url parameters and executes search method
- url paramter values are queried for each type:
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
- Once the search is performed on the `genericSearch`, the `search-complete` event handler is triggered and the steps from `Complete PIN14 Search` are performed 