import { Box } from "@mui/material";
import { theme } from "../../theme";
import widgetsSearch from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"


const Search = () => {

    const {
        x, 
        y, 
        returnFeaturesByPin10Pin14,  
        language, 
        translateText,  
        newSearch, 
        setPanelPrimaryVisibility,
        setPanelDisplay, 
        mapView, 
        searchSources, 
        clearResults, 
        panelPrimaryVisible, 
        primaryResultFeature, 
        setPrimaryResultFeature,
        initalizeSearchSources,
        returnSearchResultFeatures,
        setSearchResults,
        searchFeatures,
        searchTerm,
        anyAttributesIncluded,
        setIsQuerying,
        panelDisplay
     } = UseAppContext()

    //get url parameters
    const [routeParams, setSearchParams] = useSearchParams();

    let [genericSearch, setGenericSearch] = useState(null)
    let [pinSearch, setPinSearch] = useState(null)
    let [addressSearch, setAddressSearch] = useState(null)
    //replacing location search with pin10 and pin14 search
    let [locationSearch, setLocationSearch] = useState(null)
    let [pin10Search, setPin10Search] = useState(null)
    let [pin14Search, setPin14Search] = useState(null)

    let [searchSuggestions, setSearchSuggestions] = useState(null)
    let [searchCompleteResults, setSearchCompleteResults] = useState(null)
    let [initalSearchTerm, setInitialSearchTerm] = useState(null)


    //create a reference to the search  DOM  element
    const searchDiv = useRef(null)
    //create a reference to the search widget DOM element
    const searchWidget = useRef(null)

    const arrayAllSame = (array) => {
          // Use the every method to check if all elements are strictly equal to the previous element
          return array.every((value, index, arr) => index === 0 || value === arr[index - 1]);

    }

    const attributesStartWithString = (array, attributeName, prefix) => {
        // Use the every method to check if all attributes start with the specified string
        //console.log(`checking if features ${attributeName} startswith: ${prefix}` )
        return array.every(obj => obj.attributes[attributeName].startsWith(prefix));
    };

    const extractDuplicates = async (array, attributeName) => {
        // Step 1: Extract PIN10 values
        let values = array.map(feature => feature.attributes[attributeName]);

        //console.log("values: ", values)

        // Step 2: Use a frequency counter to count occurrences of each PIN10
        let valueCounts = values.reduce((acc, pin) => {
            acc[pin] = (acc[pin] || 0) + 1;
            return acc;
        }, {});

        // Step 3: Filter out the PIN10 values that appear more than once
        let dups = Object.keys(valueCounts).filter(value => valueCounts[value] > 1);

        return dups

        }



    const updateAppWithSearchResult = () => {

        setLocationSearch(null)
        setPin10Search(null)
        setPin14Search(null)
        setPinSearch(null)
        setAddressSearch(null)
        setGenericSearch(null)

        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsList")
        }
        
        if(searchWidget.current.searchTerm !== locationSearch){
            //console.log("setting search term: ", searchTerm)
            setSearchParams({'search': searchWidget.current.searchTerm})
        } 
    }

    const returnSearchParam = async (primaryResultFeature) => {
        let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
        let attributes = features.length > 0 ? features[0].attributes : null
        let isMultiFeatures =  features.length > 1 ? true : false

        let paramValue = null
        let param = {}

        if(attributes){
            let pin10s = features?.map((feature) => feature.attributes["PIN10"])
            let addresses = features?.map((feature) => feature.attributes["street_address"])
            let pin10Match =  isMultiFeatures === true ? arrayAllSame(pin10s) : true
            let addressMatch =  isMultiFeatures === true ? arrayAllSame(addresses) : true
            let pinsStringSimilar = isMultiFeatures === true ? attributesStartWithString(features, "PIN14_dash", searchTerm) : true
            
            //check if multiple parcels are selected
            if(isMultiFeatures === false){
                //single parcel selected so set pin to pin14
                paramValue = attributes["PIN14"]
                param = {"pin": paramValue}
            }
            else if(isMultiFeatures === true && pin10Match === false && pinsStringSimilar === false){
                //if there are multple features and pin10s do not match and pin14 dash are not the same
                if(addressMatch === true){
                    //if addresses are the same
                    //console.log("addresses match")
                    paramValue = attributes["street_address"]
                    param = {"address": paramValue}
                }
                else{
                    //if addresses and pin10 does not match
                    //placing location param with list of pins
                    //paramValue = `${x},${y}`
                    //param = {"location": paramValue}

                    //get list of all unique pins
                    //check if any pin10 are the same and filter out pin14s
                    //that start with pin10
                    let pin14s = features.map(feature => feature.attributes['PIN14'])
                    // let pin10Unique = [...new Set(pin10s)]
                    ////console.log("Location Param - Unique pin10s: ", pin10Unique)
                    let pin10Dups = await extractDuplicates(features, "PIN10")
                    ////console.log("Location Param - Duplicate pin14s: ", pin14s)
                    ////console.log("Location Param - Duplicate pin10s: ", pin10Dups)
                    
                    // Filter out PIN14 values that start with any values in pin10Dups
                    let filteredPin14s = pin14s.filter(pin14 => !pin10Dups.some(pin10Dup => pin14.startsWith(pin10Dup)));
                    ////console.log("Location Param - Filtered pin14s: ", filteredPin14s);
                    let paramPins = [...filteredPin14s, ...pin10Dups]
                    //console.log("Final list of url params = ", paramPins)

                    paramValue = paramPins
                    if(pin10Dups?.length > 0){
                        param["pin10"] = `'${pin10Dups.join("','")}'`
                    }
                    if(filteredPin14s?.length){
                        param["pin14"] = `'${filteredPin14s.join("','")}'`
                    }

                }
            }
            else if(isMultiFeatures === true && pin10Match === true){
                paramValue = attributes["PIN10"]
                param = {"pin": paramValue}
            }
            else if(isMultiFeatures ===  true && pinsStringSimilar === true){
                paramValue = searchTerm
                param = {"search" : searchTerm}
            }
        }

        //console.log("url param: ", param)

        return { paramValue, param }
    }
    

    useEffect(() => {

        console.log("checking search results and suggestions")

        //console.log("search compete results: ", searchCompleteResults)
        let emptyResults = searchCompleteResults?.filter(result => result.results.length > 0)
        console.log("search complete results: ", emptyResults)
        if(emptyResults?.length === 0 && searchSuggestions?.length > 0){
            
            console.log("new search suggestions: ", searchSuggestions)

            let returnedSuggestions = searchSuggestions.filter(result => result.results.length > 0)
            console.log("returned suggestions: ", returnedSuggestions)
            let firstSuggestion = returnedSuggestions[0]?.results[0]?.text
            if(searchWidget.current){
                console.log("passing first suggestion to search:", firstSuggestion)
                setPrimaryResultFeature(null, false)
                searchWidget.current.search(firstSuggestion)
                searchWidget.current.searchTerm = initalSearchTerm
                
            }
        }
        
        
    },[searchCompleteResults, searchSuggestions])

    useEffect(() => {
        initalizeSearchSources()
        if(!primaryResultFeature){
            setPrimaryResultFeature(null, true)
        }
    }, [])




    //primaryResultFeature use effect
    useEffect(() => {

        const updateURLParams = async () => {



            setIsQuerying(true)
            let searchString = routeParams.get("search")
            let primaryInSearchFeature
            //When primary feature result changes update the search param
            //from mouse click
            //console.log("USE EFFECT: checking for primary result feature and new search")
            if(primaryResultFeature){
                //&& newSearch === false){
                //console.log("USE EFFECT FEATURES found: ", primaryResultFeature)
                
                let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
                let attributes = features.length > 0 ? features[0].attributes : null
    
                let {paramValue, param} = await returnSearchParam(primaryResultFeature)
                
                //console.log("setting url params: ", param)
                setSearchParams(param)
                
                // //if primary features is in search results then don't update the searchTerm
                if(features && searchFeatures){
                    primaryInSearchFeature = anyAttributesIncluded(features, searchFeatures)
                }
                
                if(primaryInSearchFeature){
                    //let { paramValue, param} = returnSearchParam(searchFeatures)
                    //console.log("full search param: ", param)
                    //let newSearchTerm = paramValue ?? searchTerm
                    //let newParam = {'search' : newSearchTerm}
                    //setSearchParams(newParam)
                    //console.log("Primary Result Feature is in search features: ", searchFeatures)
                    //console.log("Setting search term from search features: ", searchTerm)
                    //console.log("setting search results - search feature = primary result features and previous search  = searchFeatures")
                    setSearchResults(null, features, searchTerm, searchFeatures)
                }
                else{
                    //console.log("Primary Result feature is a net new search")
                    //console.log("Setting search term from search features: ", paramValue)
                    //console.log("setting search results - search feature = primary result features and not updating previous features")
    
                    setSearchResults(null, features, paramValue)
                }
                ////console.log("USE EFFECT PARAM : ", routeParams.get("search"), routeParams.get("pin"))
                
                // if(searchWidget.current && ![attributes["PIN10"], attributes["PIN14"], `${attributes["street_address"]}, ${attributes["city_state_zip"]}`].includes(searchWidget.current.searchTerm)){
                //     let urlParamKey = Object.keys(param)
                //     let pin = urlParamKey.includes("pin")
                    
                //     let searchTermEntered = searchWidget.current.searchTerm
                //     searchTermEntered = searchTermEntered.toLowerCase()

                //     if(pin && attributes["street_address"].toLowerCase().startsWith(searchTermEntered)){
                //         return
                //     }
                //     else{
                //         searchWidget.current.searchTerm = null
                //     }
                //     //searchWidget.current.searchTerm.startwith(pin}

                    
                //     //searchWidget.current.searchTerm = paramValue
                // }

                if(primaryResultFeature && !newSearch ){
                    searchWidget.current.searchTerm = null
                }
   
                
            }
            else if(primaryResultFeature && newSearch === true && searchString){
    
                //console.log("Returning pervious search: ", searchString)
                searchWidget.current.searchTerm = searchString !== 'null' ? searchString : null
                //console.log("Setting previous search features: ", searchFeatures)
                setSearchResults(null, primaryResultFeature, searchString, searchFeatures)
                //setSearchResults(null, primaryResultFeature, searchString)
            }
    
            if(!primaryResultFeature){
                //console.log("No Primary Result Selected. Querying url parameters")
    
                //setLocationSearch(routeParams.get("location"))
                
                setPin10Search(routeParams.get("pin10"))

                setPin14Search(routeParams.get("pin14"))
    
                setPinSearch(routeParams.get("pin"))
    
                setGenericSearch(routeParams.get("search"))
    
                setAddressSearch(routeParams.get("address"))
    
                //console.log("USE EFFECT No feature Found")
                //console.log("USE EFFECT GENERIC SEARCH: ", routeParams.get("search"))
                //console.log("USE EFFECT PIN SEARCH: ", routeParams.get("pin"))
                //console.log("USE EFFECT Address SEARCH: ", routeParams.get("address"))
                //searchWidget.current.searchTerm = null
                if(searchWidget.current){
                    searchWidget.current.searchTerm = null
                }
            }  
    
            setIsQuerying(false)
        }

        updateURLParams()
        

    }, [primaryResultFeature, searchWidget])

    useEffect(() => {
        //when primaryResultFeature changes update the panel display
        if(searchFeatures && primaryResultFeature){

            const primaryInSearchFeature = anyAttributesIncluded(primaryResultFeature, searchFeatures)

            if(!primaryInSearchFeature){
                console.log("Setting primar panel to display results list: ", panelDisplay)
            
                setPanelDisplay("resultsList")
            }
            else if(primaryInSearchFeature && panelDisplay === "info"){
                setPanelDisplay("resultsList")
            }
           
        }
    }, [searchFeatures, primaryResultFeature])


    useEffect(() => {

        if(searchWidget.current){
            searchWidget.current.allPlaceholder = translateText('Search by address, pin, or intersection')
        }

    },[searchWidget, language])


    useEffect(() => {
        const createSearch = async () => {

            if(searchDiv.current && searchSources){

                if(!searchWidget.current){

                    searchWidget.current = new widgetsSearch({
                        locationEnabled:false,
                        includeDefaultSources: false,
                        //view: mapView,
                        container: searchDiv.current,
                        sources: searchSources,
                        resultGraphicEnabled:false,
                        autoSelect: false,
                        allPlaceholder: translateText('Search by address, pin, or intersection')
                    })
                }

                await searchWidget.current.when();

                if(newSearch === true){
                    if(genericSearch && !locationSearch){
                        console.log("DETECTED GENERIC SEARCH PARAM: ", genericSearch)
                        setInitialSearchTerm(genericSearch)
                        searchWidget.current.search(genericSearch)
                        searchWidget.current.suggest(genericSearch)
                        searchWidget.current.searchTerm = genericSearch
                    }

                    if(pinSearch && pinSearch !== 'null'){
                       console.log("Performing New Search for pin=", pinSearch)           
                        searchWidget.current.search(pinSearch)
                        searchWidget.current.searchTerm = pinSearch
                    }

                    if(addressSearch && addressSearch !== 'null'){
                        console.log("DETECTED Address SEARCH PARAM: ", addressSearch)
                        searchWidget.current.search(addressSearch)
                        searchWidget.current.searchTerm = addressSearch
                    }

                    //replaceing locatin search with pin10 and pin14 search
                    // if(locationSearch && locationSearch !== 'null'){
                    //     //console.log("Location search = ", locationSearch)             
                    //     //searchWidget.current.search(locationSearch)
                    //     returnLocationFeatures(locationSearch)

                    // }
                    if(pin10Search || pin14Search){
                        //if pin10 or pin14 search params return values
                        //bypass the seach and query the parcels directly from the service

                        returnFeaturesByPin10Pin14(pin10Search, pin14Search)
                    }
                }
                searchWidget.current.on("suggest-complete", (event) => {
                    console.log("suggest complete event: ", event)
                    setSearchSuggestions(event.results)

                })

                searchWidget.current.on("search-complete", (event) => {
                //searchWidget.current.on("search-complete", (event) => {
                    console.log("search complete event:", event)

                    let results;
                    
                    results = event.results
                    setSearchCompleteResults(results)
                    //console.log("results for multiple results: ", event)
                    setIsQuerying(true)
                    returnSearchResultFeatures(results, searchWidget.current.searchTerm)
                    setSearchParams({'search': searchWidget.current.searchTerm})

                    updateAppWithSearchResult()
                    setIsQuerying(false)
                })

                //to do enable clear results to empty searchFeatures array
                searchWidget.current.on("search-clear", function(event){
                    // The results are stored in the event Object[]
                    //console.log("Search input textbox was cleared.");

                    setLocationSearch(null)
                    setPinSearch(null)
                    setAddressSearch(null)
                    setGenericSearch(null)

                    clearResults();
                  });
            }

        
        }
        //execute function search function with url param
        createSearch()

    },[searchDiv, mapView, searchSources])

    return(
        <Box 
        ref={searchDiv}
        flex={1} 
        height={40} 
        bgcolor="white" 
        display="flex" 
        sx={{padding: "0 10px", borderRadius: theme.shape.borderRadius}}
        >
            {/* <InputBase placeholder="Search..."/> */}
        </Box>

    )
}

export default Search