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
        returnLocationFeatures,  
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
        returnSearchResultFeatures
     } = UseAppContext()

    //get url parameters
    const [routeParams, setSearchParams] = useSearchParams();

    let [genericSearch, setGenericSearch] = useState(null)
    let [pinSearch, setPinSearch] = useState(null)
    let [addressSearch, setAddressSearch] = useState(null)
    let [locationSearch, setLocationSearch] = useState(null)

    //create a reference to the search  DOM  element
    const searchDiv = useRef(null)
    //create a reference to the search widget DOM element
    const searchWidget = useRef(null)

    const arrayAllSame = (array) => {
        
          // Use the every method to check if all elements are strictly equal to the previous element
          return array.every((value, index, arr) => index === 0 || value === arr[index - 1]);

    }

    const updateAppWithSearchResult = () => {

        
        setLocationSearch(null)
        setPinSearch(null)
        setAddressSearch(null)
        setGenericSearch(null)

        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsList")
        }
        
        if(searchWidget.current.searchTerm !== locationSearch){
            console.log("setting search term: ", searchTerm)
            setSearchParams({'search': searchWidget.current.searchTerm})
        } 
    }

    useEffect(() => {
        initalizeSearchSources()
        if(!primaryResultFeature){
            setPrimaryResultFeature(null, true)
        }
    }, [])

    useEffect(() => {

        //When primary feature result changes update the search param
        //from mouse click
        console.log("USE EFFECT: checking for primary result feature and new search")
        if(primaryResultFeature && newSearch === false){
            console.log("USE EFFECT FEATURES found: ", primaryResultFeature)
            
            //let attributes = Array.isArray(primaryResultFeature) ? primaryResultFeature[0].attributes : primaryResultFeature.attributes
            let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]
            let attributes = features.length > 0 ? features[0].attributes : null
            let isMultiFeatures =  features.length > 1 ? true : false

            if(attributes){
                let pin10s = features?.map((feature) => feature.attributes["PIN10"])
                let addresses = features?.map((feature) => feature.attributes["street_address"])
                let pin10Match =  isMultiFeatures === true ? arrayAllSame(pin10s) : true
                let addressMatch =  isMultiFeatures === true ? arrayAllSame(addresses) : true
    
                let paramValue = null
                let param = {}
    
                if(isMultiFeatures === false){
                    paramValue = attributes["PIN14"]
                    param = {"pin": paramValue}
                }
                else if(isMultiFeatures === true && pin10Match === false){

                    if(addressMatch === true){
                        paramValue = attributes["street_address"]
                        param = {"address": paramValue}
                    }
                    else{
                        paramValue = `${x},${y}`
                        param = {"location": paramValue}
                    }
                }
                else if(isMultiFeatures === true && pin10Match === true){
                    paramValue = attributes["PIN10"]
                    param = {"pin": paramValue}
                }
    
                
                setSearchParams(param)
                console.log("USE EFFECT PARAM : ", routeParams.get("search"), routeParams.get("pin"))
                
                if(searchWidget.current && ![attributes["PIN10"], attributes["PIN14"], `${attributes["street_address"]}, ${attributes["city_state_zip"]}`].includes(searchWidget.current.searchTerm)){
                    searchWidget.current.searchTerm = paramValue
                }
                //}
            }
            
        }
        if(!primaryResultFeature){
            console.log("No Primary Result Selected. Querying url parameters")

            setLocationSearch(routeParams.get("location"))

            setPinSearch(routeParams.get("pin"))

            setGenericSearch(routeParams.get("search"))

            setAddressSearch(routeParams.get("address"))

            console.log("USE EFFECT No feature Found")
            console.log("USE EFFECT GENERIC SEARCH: ", routeParams.get("search"))
            console.log("USE EFFECT PIN SEARCH: ", routeParams.get("pin"))
            console.log("USE EFFECT Address SEARCH: ", routeParams.get("address"))

            if(searchWidget.current){
                searchWidget.current.searchTerm = null
            }}  


    }, [primaryResultFeature, searchWidget])


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
                        searchWidget.current.search(genericSearch)
                    }

                    if(pinSearch && pinSearch !== 'null'){
                       console.log("Performing New Search for pin=", pinSearch)           
                        searchWidget.current.search(pinSearch)
                    }

                    if(addressSearch && addressSearch !== 'null'){
                        console.log("DETECTED Address SEARCH PARAM: ", addressSearch)
                        searchWidget.current.search(addressSearch)
                    }

                    if(locationSearch && locationSearch !== 'null'){
                        console.log("Location search = ", locationSearch)             
                        //searchWidget.current.search(locationSearch)
                        returnLocationFeatures(locationSearch)

                    }
                }

                searchWidget.current.on("search-complete", (event) => {
                    console.log("search complete event:", event)

                    let results;

                    results = event.results
                    console.log("results for multiple results: ", event)

                    returnSearchResultFeatures(results)
                    setSearchParams({'search': searchWidget.current.searchTerm})

                    updateAppWithSearchResult()
                    
                })

                //to do enable clear results to empty searchFeatures array
                searchWidget.current.on("search-clear", function(event){
                    // The results are stored in the event Object[]
                    console.log("Search input textbox was cleared.");

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