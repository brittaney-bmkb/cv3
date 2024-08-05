import { Box } from "@mui/material";
import { theme } from "../../theme";
import Search from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"

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

const SearchBar = () => {

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

    //Create Search 
    useEffect(() => {

        const createSearch = async () => {

            if(searchDiv.current && searchSources){

                if(!searchWidget.current && mapView){

                    searchWidget.current = new Search({
                        locationEnabled:false,
                        includeDefaultSources: false,
                        //view: mapView,
                        container: searchDiv.current,
                        sources: searchSources,
                        resultGraphicEnabled:false,
                        allPlaceholder: translateText('Search by address, pin, or intersection'),
                        // goToOverride: function(view, goToParams){
                        //     console.log("search target: ", goToParams)
                        //     const target = goToParams.target
                        //     const isIntersection = target.attributes.StAddr.includes("&") 
                        //     if(isIntersection){
                        //         view.goTo(target)
                        //     }
                        // }
                    })

                    if(newSearch === true){
                        if(genericSearch && !locationSearch){
                            console.log("DETECTED GENERIC SEARCH PARAM: ", genericSearch)
                            setInitialSearchTerm(genericSearch)
                            searchWidget.current.search(genericSearch)
                            searchWidget.current.suggest(genericSearch)
                            searchWidget.current.searchTerm = genericSearch
                        }
    
                        // if(pinSearch && pinSearch !== 'null'){
                        //    console.log("Performing New Search for pin=", pinSearch)           
                        //     searchWidget.current.search(pinSearch)
                        //     searchWidget.current.searchTerm = pinSearch
                        // }
    
                        // if(addressSearch && addressSearch !== 'null'){
                        //     console.log("DETECTED Address SEARCH PARAM: ", addressSearch)
                        //     searchWidget.current.search(addressSearch)
                        //     searchWidget.current.searchTerm = addressSearch
                        // }
    
                        if(pin10Search || pin14Search){
                            //if pin10 or pin14 search params return values
                            //bypass the seach and query the parcels directly from the service
                            let features = await returnFeaturesByPin10Pin14(pin10Search, pin14Search)
                            mapView.goTo(features)
                        }
                    }
                }

            }

            if(searchWidget.current){

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

        createSearch()

    },[searchDiv, mapView, searchSources])
    

    // useEffect(() => {

    //     console.log("checking search results and suggestions")

    //     //console.log("search compete results: ", searchCompleteResults)
    //     let emptyResults = searchCompleteResults?.filter(result => result.results.length > 0)
    //     console.log("search complete results: ", emptyResults)
    //     if(emptyResults?.length === 0 && searchSuggestions?.length > 0){
            
    //         console.log("new search suggestions: ", searchSuggestions)

    //         let returnedSuggestions = searchSuggestions.filter(result => result.results.length > 0)
    //         console.log("returned suggestions: ", returnedSuggestions)
    //         let firstSuggestion = returnedSuggestions[0]?.results[0]?.text
    //         if(searchWidget.current){
    //             console.log("passing first suggestion to search:", firstSuggestion)
    //             setPrimaryResultFeature(null, false)
    //             searchWidget.current.search(firstSuggestion)
    //             searchWidget.current.searchTerm = initalSearchTerm
                
    //         }
    //     }
        
        
    // },[searchCompleteResults, searchSuggestions])

    useEffect(() => {
        initalizeSearchSources()
        if(!primaryResultFeature){

            setPrimaryResultFeature(null, true)

            let pin10 = routeParams.get("pin10")
            if(pin10){
                console.log("pin10: ", pin10)
                let pin10Array = pin10.split(',')
                let formattedPin10 = `'${pin10Array.join("','")}'`
                setPin10Search(formattedPin10)
            }
            
            let pin14 = routeParams.get("pin14")
            if(pin14){
                let pin14Array = pin14.split(',')
                let formattedPin14 = `'${pin14Array.join("','")}'`
                setPin14Search(formattedPin14)
            }
            
            // setPinSearch(routeParams.get("pin"))

            setGenericSearch(routeParams.get("search"))

            // setAddressSearch(routeParams.get("address"))
        }
    }, [])

    //primaryResultFeature use effect
    useEffect(() => {

        if(!primaryResultFeature && searchWidget.current){
            searchWidget.current.searchTerm = null
        }
        
        if(primaryResultFeature){
            let searchParamValue = routeParams.get("search")
            let pin10ParamValue = routeParams.get("pin10")
            let pin14ParamValue = routeParams.get("pin14")

            if(!searchParamValue && (pin10ParamValue || pin14ParamValue)){
                searchWidget.current.searchTerm = null
            }

            
        }
    },[primaryResultFeature])
    

    useEffect(() => {
        //when primaryResultFeature changes update the panel display
        if(searchFeatures && primaryResultFeature){

            const primaryInSearchFeature = anyAttributesIncluded(primaryResultFeature, searchFeatures)

            if(!primaryInSearchFeature){
                console.log("Setting primary panel to display results list: ", panelDisplay)
                
                setPanelDisplay("resultsList")
            }
            else if(primaryInSearchFeature && panelDisplay === "info"){
                setPanelDisplay("resultsList")
            }
            if(primaryResultFeature && !panelPrimaryVisible){
                    setPanelPrimaryVisibility(true)
                    setPanelDisplay("resultsList")
                }
    
           
        }
    }, [searchFeatures, primaryResultFeature])


    useEffect(() => {

        if(searchWidget.current){
            searchWidget.current.allPlaceholder = translateText('Search by address, pin, or intersection')
        }

    },[searchWidget, language])


    // useEffect(() => {
    //     const searchEventHandler = async () => {

    //         if(searchWidget.current){

    //             console.log("search event handler use effect")    

                
    //             searchWidget.current.on("suggest-complete", (event) => {
    //                 console.log("suggest complete event: ", event)
    //                 setSearchSuggestions(event.results)

    //             })

    //             searchWidget.current.on("search-complete", (event) => {
    //             //searchWidget.current.on("search-complete", (event) => {
    //                 console.log("search complete event:", event)

    //                 let results;
                    
    //                 results = event.results
    //                 setSearchCompleteResults(results)
    //                 //console.log("results for multiple results: ", event)
    //                 setIsQuerying(true)
    //                 returnSearchResultFeatures(results, searchWidget.current.searchTerm)
    //                 setSearchParams({'search': searchWidget.current.searchTerm})

    //                 updateAppWithSearchResult()
    //                 setIsQuerying(false)
    //             })

    //             //to do enable clear results to empty searchFeatures array
    //             searchWidget.current.on("search-clear", function(event){
    //                 // The results are stored in the event Object[]
    //                 //console.log("Search input textbox was cleared.");

    //                 setLocationSearch(null)
    //                 setPinSearch(null)
    //                 setAddressSearch(null)
    //                 setGenericSearch(null)

    //                 clearResults();
    //               });
    //         }

        
    //     }
    //     //execute function search function with url param
    //     searchEventHandler()

    // },[searchWidget])

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

export default SearchBar