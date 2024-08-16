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
    //replacing location search with pin10 and pin14 search
    let [pin10Search, setPin10Search] = useState(null)
    let [pin14Search, setPin14Search] = useState(null)

    //create a reference to the search  DOM  element
    const searchDiv = useRef(null)
    //create a reference to the search widget DOM element
    const searchWidget = useRef(null)


    const updateAppWithSearchResult = () => {

        setPin10Search(null)
        setPin14Search(null)
        setGenericSearch(null)

        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsList")
        } 

        setSearchParams({'search': searchWidget.current.searchTerm})
    }

    
    //Create Search AND watch for search events
    useEffect(() => {

        const createSearch = async () => {

            if(searchDiv.current && searchSources){

                if(!searchWidget.current && mapView){

                    searchWidget.current = new Search({
                        locationEnabled:false,
                        includeDefaultSources: false,
                        container: searchDiv.current,
                        sources: searchSources,
                        resultGraphicEnabled:false,
                        autoSelect: false,
                        allPlaceholder: translateText('Search by address, pin, or intersection'),
                    })

                    if(newSearch === true){
                        if(genericSearch){
                            console.log("DETECTED GENERIC SEARCH PARAM: ", genericSearch)
                            searchWidget.current.search(genericSearch)
                            //searchWidget.current.searchTerm = genericSearch
                        }
    
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

                searchWidget.current.on("search-complete", async (event) => {
                    //searchWidget.current.on("search-complete", (event) => {
                    console.log("search complete event:", event)

                    let results;
                    
                    results = event.results
                    //console.log("results for multiple results: ", event)
                    setIsQuerying(true)
                    //get search result features
                    await returnSearchResultFeatures(results, searchWidget.current.searchTerm)
         
                    updateAppWithSearchResult()

                    setIsQuerying(false)
                })

                //to do enable clear results to empty searchFeatures array
                searchWidget.current.on("search-clear", function(event){
                    // The results are stored in the event Object[]
                    //console.log("Search input textbox was cleared.");
                    setGenericSearch(null)
                    setPin14Search(null)
                    setPin10Search(null)

                    clearResults();
                  });
            }

        }

        createSearch()

    },[searchDiv, mapView, searchSources])
    
    //on app load
    useEffect(() => {
        initalizeSearchSources()
        if(!primaryResultFeature){

            setPrimaryResultFeature(null, true)

            let pin10 = routeParams.get("pin10")
            if(pin10){
                console.log("pin10: ", pin10)
                let pin10Array = pin10.replace(/-/g,'').split(',').map(pin => pin.includes("'") ? pin :`'${pin}'`)
                let formattedPin10 = pin10Array?.length > 1 ? `${pin10Array.join(",")}` : `${pin10Array}`
                setPin10Search(formattedPin10)
            }
            
            let pin14 = routeParams.get("pin14")
            if(pin14){
                console.log("pin14: ", pin14)
                let pin14Array = pin14.replace(/-/g,'').split(',').map(pin => pin.includes("'") ? pin :`'${pin}'`)
                console.log("pin14Array: ", pin14Array)
                let formattedPin14 = pin14Array?.length > 1 ? `${pin14Array.join(',')}` : `${pin14Array}`
                console.log("formattedPin14: ", formattedPin14)
                setPin14Search(formattedPin14)
            }
            
            setGenericSearch(routeParams.get("search"))
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