# Cookviewer Technical Documentation

## Methods for searching for parcels
last updated: 2024-08-13

- [Complete PIN14 Search](#complete-pin14-search)
- [PIN10 Search](#pin10-search)
- [Partial PIN Search](#partial-pin-search)
- [URL Parameter Search - PIN14](#url-parameter-search---pin14)
- [URL Parameter Search - PIN10](#url-parameter-search---pin10)
- [URL Parameter Search - Partial PIN](#url-parameter-search---partial-pin)
- [URL Parameter Search - Multiple PINs](#url-parameter-search---multiple-pins)
- [Street Address Search - Address Locator Result Selected](#street-address-search---address-locator-result-selected)
- [Street Address Search - Parcel Address Locator Result Selected](#street-address-search---parcel-address-locator-result-selected)
- [Street Address with Unit Search - Address Locator Suggestion selected](#street-address-with-unit-search---address-locator-suggestion-selected)
- [Street Address with Unit Search - Parcel Address Locator Suggestion Selected](#street-address-with-unit-search---parcel-locator-suggestion-selected)
- [Partial Street Address Search -  Users Presses Enter](#partial-street-address-search---users-presses-enter)
-[Intersection Search - Address Locator Suggestion Selected](#intersection-search---address-locator-suggestion-selected)
-[URL Parameter Search - Partial or Full Address](#url-parameter-search---partial-or-full-address)
-[URL Parameter Search - Intersection](#url-parameter-search---intersection)

## User uses PIN14, PIN10, or Partial PIN

### Complete PIN14 Search
User types in a complete PIN14 in the search bar and presses enter or clicks a result from the parcel PIN search suggestions.

### Expected Behavior
| Action | URL Parameters | Property Results | Map | Search Term |
|---|---|---|---|---|
| User types or selects Full PIN 14 | search = User Provided PIN  | one result of PIN 14 | Displays one parcel and zooms  | Shows - formatted PIN 14 dash if user selects a result or User Provided PIN if user presses enter |

### Process

<table>
<th>Code Snippet - SearchBar.jsx</th>
<th>Description</th>
<tr>
<td>

```
useEffect(() => {

    const createSearch = async () => {

        ...

        if(searchWidget.current){

            searchWidget.current.on("search-complete", async (event) => {
  
                console.log("search complete event:", event)

                let results;
                
                results = event.results
 
                setIsQuerying(true)

                //get search result features
                await returnSearchResultFeatures(results, searchWidget.current.searchTerm)
        
                updateAppWithSearchResult()

                setIsQuerying(false)
            })

            ...
        }

    }

    createSearch()

},[searchDiv, mapView, searchSources])

```
</td>
<td>
1) **search-complete** event handler is triggered once the user presses enter or clicks a result and returns a search event containing search candidates inside the [search result object](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#events-summary)<br><br> 2) The results property is set to the results variable<br><br> 3) **IsQuerying** state is set to true to trigger loading animation inside the results panel while result features and attributes are queried<br><br> 4) **returnSearchResultFeatures()** is executed with search results and the user provided PIN14 is referenced from the searchWidget searchTerm. This function updates the state of the primaryFeatureResult that is displayed as results in the result list and graphically as a layer in the webmap. See details in `/data/AppContext.md` <br><br> 5) **updateAppWithSearchResult()** executed to open left panel and display results list if the panel is closed and URL Parameter is updated with the **search** parameter and the searchWidget search term as the parameter value using the setSearchParams() function <br><br> 6) Once result features are returned **IsQuerying** state is set to false to remove loading animation
</td>
</tr>
</table>

---
### PIN10 Search
User types in PIN10 and presses search or hits enter 

### Expected Behavior
| Action | URL Parameters | Property Results | Map | Search Term |
|---|---|---|---|---|
| User types in PIN10 and presses search or hits enter ( does not select a suggestion) | search=Users search term | return all of parcel records that start with the PIN10 string provided by the user | Displays all parcels that start with the PIN10 string provided by the user | User search term |

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

### User includes a search query as a url parameter

### URL Parameter Search - PIN14
User includes a search query `search= {a PIN14 value}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action | URL Parameters | Property Results | Map | Search Term |
|---|---|---|---|---|
| User types in url with "search=PIN14" | search=User Provided Pin | one result of PIN 14 | Displays one parcel and zooms  | Shows - formatted PIN 14 dash |

### Process

<table>
<th>Code Snippet - SearchBar.jsx</th>
<th>Description</th>
<tr>
<td>

```
useEffect(() => {
    initalizeSearchSources()
    if(!primaryResultFeature){

        ...
        
        setGenericSearch(routeParams.get("search"))
    }
}, [])

useEffect(() => {

    const createSearch = async () => {

        if(searchDiv.current && searchSources){

            if(!searchWidget.current && mapView){

                ...

                if(newSearch === true){
                    if(genericSearch){
                        console.log("DETECTED GENERIC SEARCH PARAM: ", genericSearch)
                        searchWidget.current.search(genericSearch)
                        //searchWidget.current.searchTerm = genericSearch
                    }

                    ...
                }
            }

        }

        ...

    }

    createSearch()

},[searchDiv, mapView, searchSources])

```
</td>
<td>
1) On initial load the on app load use effect hook is triggered to initialize search sources used by the search widget and update the state of the **genericSearch** variable by retrieving the **search** parameter value<br><br>2) Once **search sources, mapView, and the search div element** is present in the DOM, the **createSearch** useEffect function is triggered to create a new instance of the **searchWidget** and execute searches using the search strings derived from url parameters<br><br> 3) When a string is detected in the genericSearch variable then the string is passed as an argument to the **searchWidget** search method to trigger a new search<br><br>4) The search term is updated in the searchWidget to the genericSearch value that was passed to the search method<br><br> 5) Search results are then handled the same way described in the [Complete PIN14 Search](#complete-pin14-search) 
</td>
</tr>
</table>

---

### URL Parameter Search - PIN10
User includes a search query `search= {a PIN10 value}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                                | URL Parameters           | Property Results                                                 | Map                             | Search Term      |
|---------------------------------------|--------------------------|------------------------------------------------------------------|---------------------------------|------------------|
| User types in url with "search=PIN10" | search=Users search term | return all of parcel records that start with PIN10 search string provided by user | Displays all parcels that start with PIN10 search string provided by user | User search term |

### Process 

This process accesses the search vaules from the url parameter then follows the steps from [URL Parameter Search - PIN14](#url-parameter-search---pin14)

---

### URL Parameter Search - Partial PIN
User includes a search query `search= {a Partial PIN value}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                      | URL Parameters          | Property Results                                                                                                                                                                                             | Map                                                                                                                                                                                              | Search Term      |
|-----------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| url search with partial PIN | search=user search term | Return all of the search result features where partial PIN is beginning of PIN14 | Return all of the parcels using the geometry from the search results | User search term |

### Process

This process accesses the search vaules from the url parameter then follows the steps from [URL Parameter Search - PIN14](#url-parameter-search---pin14)

---

### URL Parameter Search - Multiple PINs
User includes a search query `pin14= {a list of PIN14s}' and/or 'pin10={a list of PIN10s}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                       | URL Parameters                                     | Property Results                                                                                                         | Map                                                            | Search Term |
|------------------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|-------------|
| url search for multiple pins | pin14={list of PIN14} and/or pin10={list of PIN10} | Return all parcels from sql parcel query where PIN14 in {list of PIN14} or PIN10 in {list of PIN10} | Display the parcel geometry from the parcel layer source query | Null        |

### Process

<table>
<th>Code Snippet - SearchBar.jsx</th>
<th>Description</th>
<tr>
<td>

```
useEffect(() => {
    initalizeSearchSources()
    if(!primaryResultFeature){

        ...

        let pin10 = routeParams.get("pin10")
        if(pin10){
            let pin10Array = pin10.replace(/-/g,'').split(',')
            let formattedPin10 = pin10Array?.length > 1 ? `${pin10Array.join(",")}` : `'${pin10Array}'`
            setPin10Search(formattedPin10)
        }
        
        let pin14 = routeParams.get("pin14")
        if(pin14){
            let pin14Array = pin14.replace(/-/g,'').split(',')
            let formattedPin14 = pin14Array?.length > 1 ? `${pin14Array.join(',')}` : `'${pin14Array}'`
            setPin14Search(formattedPin14)
        }
        
        ...
    }
}, [])


useEffect(() => {

    const createSearch = async () => {

        if(searchDiv.current && searchSources){

            if(!searchWidget.current && mapView){

                ...

                if(newSearch === true){

                    ...

                    if(pin10Search || pin14Search){
                        let features = await returnFeaturesByPin10Pin14(pin10Search, pin14Search)
                        mapView.goTo(features)
                    }
                }
            }

        }

        ...

    }

    createSearch()

},[searchDiv, mapView, searchSources])

```

</td>
<td>
 1) On initial load the on app load use effect hook is triggered to initialize search sources used by the search widget and retrieves values from routeParams: pin10 and pin14.<br><br>2) If values are not null then the values are formatted to remove hyphens and split the string into an array.<br><br>3) if pin14 and/or pin10 values are not null then the searchWidget is bypassed and the formatted pin14 and/or pin10 are passed to the returnFeaturesByPin10Pin14() function to return parcel features by querying the PIN14 and PIN10 fields<br><br>  4) Once features are returned the map zooms the features extent|
</td>
</tr>
</table>

---

## User uses Street Address, Partial Street Address, or Intersection

### Street Address Search - Address Locator Result Selected
User types in a complete address in the search bar and selects a result from the address locator suggestions.

### Expected Behavior

| Action                                                                                                                      | URL Parameters                    | Property Results                                                             | Map                                                                                           | Search Term                |
|-----------------------------------------------------------------------------------------------------------------------------|-----------------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|----------------------------|
| User types in an address and locator address suggestions are returned, user selects  one of the  address locator suggestion | search="StAddr"+ "City"+ "Postal" | Returns a buffers for each geocoded address point and parcels that intersect | zoom in, display marker, display buffer ring, display parcels that intersect with buffer ring | "StAddr"+ "City"+ "Postal" |

### Process

<table>
<th>Code Snippet - AppContext.jsx and queryTargetLayer.js</th>
<th>Description</th>
<tr>
<td>

```

//AppContext.jsx
const returnSearchResultFeatures = async (results, newSearchTerm) => {

    const { handleMultipleResults } = await import('../arcgis/search/queryTargetLayer')
    const { returnBufferGeometry } = await import('../arcgis/geoprocessing/geoprocessing')

    //console.log("Performing new target layer query")
    setSearchBufferGeometry(null, null)
    
    const{ targetFeatures } = await handleMultipleResults(results)

    //console.log("target features returned: ", targetFeatures)
    //console.log("results returned: ", results)

    setPrimaryResultFeature(targetFeatures, true)

    //console.log("seting previous feature: ", targetFeatures)
    setSearchResults(results, targetFeatures, newSearchTerm, targetFeatures)
    //}

    //created buffer graphic here
    //if results include Address Locator source
    //update state of searchBuffer and pass point geometries
    
    const addressLocatorResultGeometry = results.filter(result => result.source.name === "Address Locator")
                                            .flatMap(filteredResults => filteredResults.results)
                                            .map(flattenedResults => flattenedResults.feature.geometry)
    
    
    const bufferGeometries = await Promise.all(addressLocatorResultGeometry.map(async(geometry) => {

        console.log("buffer geometry: ", geometry)
        return await returnBufferGeometry(geometry, config.buffer_distance, config.buffer_unit)

    }))

    console.log("address locator buffer geometries calculated: ", bufferGeometries)
    setSearchBufferGeometry(addressLocatorResultGeometry, bufferGeometries)

}

//queryTargetLayer.js

export const handleMultipleResults = async (results) => {

    let filteredResults = results.filter(results => results.results.length > 0)

    // Create arrays to store features
    let targetFeatures = [];
    let searchFeatures = [];
    
    filteredResults.forEach(results => {

        if (results && results.source) {
            if (results.source.layer) {
                ...
            } else {
                results.results.map(result => {
                    searchFeatures.push([result.feature, results.source.name])
                })
            }
        }
    });

    if(searchFeatures.length > 0){
        let features = []
        console.log("search features: ", searchFeatures)

        let parcelLocatorResults = searchFeatures.filter(feature => feature[1] !== "Address Locator")
        let addressLocatorResults = searchFeatures.filter(feature => feature[1] === "Address Locator")

        ...
        
        if(addressLocatorResults?.length > 0){
            console.log("performing point in polygon for results for address locator results")
            let addressLocatorFeatures = await queryTargetLayerWithPointFeatures(addressLocatorResults)
            features = [...features, ...addressLocatorFeatures]
            console.log("features from queryTargetLayerWithPointFeatures: ", addressLocatorFeatures)
        }

        features.map(feature => {
            let featureExists = addObjectToArrayIfNotExists(targetFeatures, feature)
            
            if(!featureExists){
                targetFeatures.push(feature)
            }
            
        })
    }

    return {targetFeatures, searchFeatures}
}

export const queryTargetLayerWithPointFeatures = async (searchFeatures) => {

    let targetFeatures = [] 

    await Promise.all(searchFeatures.map(async (searchFeature) => {

        let includeBuffer = searchFeature[1] === "Address Locator" ? true : false
        let point = searchFeature[0]

        const query = new Query();
        query.spatialRelationship = "intersects";
        query.returnGeometry = true
        query.outFields = ["*"]
        query.geometry = point.geometry;

        const { features } = await targetLayer.queryFeatures(query)

        targetFeatures = [...targetFeatures, ...features]

        //now do buffer after point to polygon intersection 
        //is performed to get nearby features
        if(includeBuffer){
            query.distance = config.buffer_distance,
            query.units = config.buffer_unit
        }

        const bufferedFeatures = await targetLayer.queryFeatures(query)

        targetFeatures = [...targetFeatures, ...bufferedFeatures.features]
    }))

    return targetFeatures

}

```

</td>
<td>
1) This process follows the same steps as Complete PIN14 Search with an additional step to create the buffer geometry. The additional step happens in the returnSearchResultFeatures() function that is executed inside the SearchBar.jsx component, described in the Complete PIN14 Search Process table.<br><br>2) returnSearchResultFeatures() sets the state of the searchBufferGeometry to null for both the address point and address buffer geometry.<br><br>3) Search results are passed to the handleMultipleResults() function to return parcel features. For Address Locator results and the buffer_distance and buffer_unit variables are accessed from config.js are included in the parcel layer spatial query executed in the queryTargetLayerWithPointFeatures() function.<br><br>4) Parcel features are passed to setPrimaryResultFeature() and setSearchResults() to update the state of the selected parcels in the webmap and search results displayed in the results panel.<br><br>5) The search results are then filtered to detect results where the search source is equal to "Address Locator", and the geometry of those geocoded results are returned in the addressLocatorResultGeometry array.<br><br>6) Each geometry is then passed to the returnBufferGeometry function to create the buffered polygon geometries for the map display.<br><br>7) The geometry of the geocoded results and buffered polygon geometries are passed to the setSearchBufferGeometry() function to update the states of the searchResultPoint and searchBufferGeometry to trigger the WebMapComponentBeta.jsx component to create buffer graphics and display them in the webmap.
</td>
</tr>
</table>

---

### Street Address Search - Parcel Address Locator Result Selected
User types in an address and selects a Parcel Address search result from the dropdown.

### Expected Behavior

| Action                                                                                                                   | URL Parameters                    | Property Results                                                                                                                           | Map                                          | Search Term                                 |
|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|---------------------------------------------|
| User types in an address and parcel address suggestions are returned, user selects  one of the parcel address suggestions | search=street_addr+city_state_zip | Returns all of parcels from parcel layer query where= street_address LIKE search result street_address% and city_state_zip = search result city_state_zip   | Displays all of parcels from parcel layer query where= street_address LIKE search result street_address% and city_state_zip = search result city_state_zip  | Result.street_address+result.city_state_zip |

### Process

<table>
<th>Code Snippet - QueryTargetLayer.js</th>
<th>Description</th>
<tr>
<td>

```
export const handleMultipleResults = async (results) => {

    let filteredResults = results.filter(results => results.results.length > 0)

    let targetFeatures = [];
    let searchFeatures = [];
    
    filteredResults.forEach(results => {

        if (results && results.source) {
            if (results.source.layer) {

                ...

            } else {
                results.results.map(result => {
                    searchFeatures.push([result.feature, results.source.name])
                })
            }
        }
    });

    //If there are no matching features from the target (parcel layer)
    //then perform spatial intersection using points for Address Locator source
    // OR SQL query for Parcel Address Locator source
    if(searchFeatures.length > 0){
        let features = []
        console.log("search features: ", searchFeatures)

        let parceLocatorResults = searchFeatures.filter(feature => feature[1] !== "Address Locator")
        let addressLocatorResults = searchFeatures.filter(feature => feature[1] === "Address Locator")

        if(parceLocatorResults?.length > 0){
            let parcelLocatorFeaturesOnly = await queryTargetLayerByAddress(parceLocatorResults)
            features = [...features, ...parcelLocatorFeaturesOnly]
        }
        
        ...

        features.map(feature => {
            let featureExists = addObjectToArrayIfNotExists(targetFeatures, feature)
            
            if(!featureExists){
                targetFeatures.push(feature)
            }
        })
    }

    return {targetFeatures, searchFeatures}
}

const queryTargetLayerByAddress = async (searchFeatures) => {

    let targetFeatures = [] 
    let where = ""

    await Promise.all(searchFeatures.map(async (searchFeature, index) => {

        let street_address = searchFeature[0].attributes['street_address']
        let city_state_zip = searchFeature[0].attributes['city_state_zip']

        where += `(street_address LIKE '${street_address}%' AND city_state_zip = '${city_state_zip}')`
        if(index < searchFeatures.length -1){
            where += ' OR '
        }
        
    }))

    let query = new Query()
    query.where = where
    query.returnGeometry = true
    query.outFields = ["*"]

    const { features } = await targetLayer.queryFeatures(query)

    targetFeatures = [...targetFeatures, ...features]

    return targetFeatures
    
}


```

</td>
<td>
1) Follows the same steps as the Street Address Search - Address Locator Result Selected, with the EXCLUSION of a spatial query used to select parcel features. A SQL query is used because locator geocoded results remove duplicates that can exclude points for parcel records that share the same address<br><br>2) When the handleMultipleResults() function is executed with the search results,  all search results that do not share the same sources as the parcel layer is appended to the searchFeatures array.<br><br>3) The searchFeatures array is filtered to parse out Parcel Address locator results and Address locator results.<br><br>4) If there are Parcel Address locator results the results are passed to the queryTargetLayerByAddress() function<br><br>5) The queryTargetLayerByAddress function performs a SQL query to return parcel features by querying the street_address and city_state_zip fields against the locator results street_address and city_state_zip attributes.
</td>
</tr>
</table>

--- 

### Street Address with Unit Search - Address Locator Suggestion selected
User types in a complete address in the search bar and selects a result from the address locator suggestions.

### Expected Behavior

| Action                                                                                                                                                                                     | URL Parameters          | Property Results                                             | Map                                                            | Search Term      |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|--------------------------------------------------------------|----------------------------------------------------------------|------------------|
| User types in search for address with unit and selects an address locator suggestion (Search: 2555 W LELAND AVE, #301, CHICAGO, IL, 60625 Selects: 2555 W LELAND AVE, CHICAGO, IL, 60625 ) | search=user search term | point in polygon search with buffer distance with result for units in search area | Display the parcel geometry from the parcel layer source query | User search term |

### Process - Follows the same steps as the Street Address Search - Address Locator Result Selected

---

### Street Address with Unit Search - Parcel Address Locator Suggestion Selected
User types in an address with unit and selects a parcel address search result from the dropdown.

### Expected Behavior

| Action                                                                                                                           | URL Parameters          | Property Results                                                                                                   | Map                                                            | Search Term      |
|----------------------------------------------------------------------------------------------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|------------------|
| User types in search for address with unit and selects a parcel locator suggestion (2555 W LELAND AVE, #301, CHICAGO, IL, 60625) | search=user search term | Parcel Address locator soruce: return parcels from sql query using full address (all address fields). | DIsplay the parcel geometry from the parcel layer source query | User search term |

### Process: Follows steps from Street Address Search - Parcel Address Locator Result Selected

---

### Partial Street Address Search -  Users Presses Enter
User types in a partial address in the search bar and presses enter. 

#### Examples
- An apartment with multiple addresses: 4621 N Rockwell, 69 W Washington
- A single address: 913 East Olive

### Expected Behavior

| Action                                                                                                                                                                          | URL Parameters          | Property Results                                                                                                                                                                                                                                                                                                          | Map                                                                                                                                                                                                                                                                                             | Search Term      |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| User types in a partial street address and presses enter (A Ex: Apt Building w/ multiple addresses: 4621 N Rockwell vs 4621 S Rockwell | B Ex: 913 East Olive; 69 W Washington) | search=user search term | Search term is submitted to the Address and Parcel Address locator sources - if search term is contained in any of the fields - attributes of the match and an address point is returned - that is then used to find a buffer spatial intersect with parcel layer and those are returned and displayed in the Property Results pane. For Parcel Address locator results parcels are returned from sql query using full address (all address fields) | Parcel Locator source: SQL query for each result using full address (all address fields)//Address Locator: buffer from address point; display; display buffer ring | User search term |

### Process - this process follows the a combination of Street Address Search - Address Locator Result Selected and Street Address Search - Parcel Address Locator Result Selected steps

---

### Intersection Search - Address Locator Suggestion Selected
User types an intersection in the search bar and selects a result from the address locator suggestions.

### Expected Behavior

| Action                                                                  | URL Parameters                                                         | Property Results                            | Map                                                                                                                      | Search Term          |
|-------------------------------------------------------------------------|------------------------------------------------------------------------|---------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------------|
| User types in an intersection and selects suggested result from locator | search= user search term with string replace to replace '&' with 'and' (note the string replace is not implemented, '&' is automatically replaced in the url paramter with "++") | Show parcels that intersect with the buffer | zoom in, display marker, display buffer ring, display parcels that intersect with buffer ring. Only With Address Locator | User selected result |

### Process - Follows steps from Street Address Search - Address Locator Result Selected

---

### URL Parameter Search - Partial or Full Address
User includes a search query `search= {user search term}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                                  | URL Parameters          | Property Results                                                                                                                                                                                                                                                                      | Map                                                                                                                                                                                                                                                                                             | Search Term      |
|-----------------------------------------|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| url search with partial or full address | search=user search term | A. Address Locator: returns all candidates and buffered parcels | B. Parcel Locator: Returns all candidates, NO buffer. Depends on source - If parcel results no Address locator Show parcel that intersects w/address point first & if parcel true do we prioritize? YES? we can try | ParcelLayer source: Return all of the parcels using the geometry from the search results.//Parcel Locator source:  sql query where using all address fields//Address Locator: buffer from address point; display; display buffer ring | User search term |

### Process - this process follows the a combination of Street Address Search - Address Locator Result Selected and Street Address Search - Parcel Address Locator Result Selected steps

---

### URL Parameter Search - Intersection
User includes a search query `search= {user search term}` as a url parameter after the cookViewer url.

### Expected Behavior

| Action                      | URL Parameters                      | Property Results                            | Map                                                                      | Search Term      |
|-----------------------------|-------------------------------------|---------------------------------------------|--------------------------------------------------------------------------|------------------|
| url search for intersection | search= user search term with 'and' | Returns all candidates and buffered parcels | Address Locator: buffer from address point; display; display buffer ring | User search term |

### Process -  this process follows Street Address Search - Address Locator Result Selected

---