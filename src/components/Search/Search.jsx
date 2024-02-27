import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../../theme";
import widgetsSearch from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import { config } from "../../data/config";



const Search = () => {

    const {setPrimaryResultFeature,  newSearch, setPanelPrimaryVisibility, renderSearchResults, mapView, searchSources, clearResults, panelPrimaryVisible, primaryResultFeature, searchFeatures } = UseAppContext()

    //get url parameters
    const [routeParams, setSearchParams] = useSearchParams();

    let [genericSearch, setGenericSearch] = useState(
        routeParams.get("search")
    )
    let [pinSearch, setPinSearch] = useState(
        routeParams.get("pin")
    )

    let [addressSearch, setAddressSearch] = useState(
        routeParams.get("address")
    )

    let [locationSearch, setLocationSearch] = useState()

    const { location, search } = useParams()

    //create a reference to the search  DOM  element
    const searchDiv = useRef(null)
    //create a reference to the search widget DOM element
    const searchWidget = useRef(null)

    const arrayAllSame = (array) => {
        
          // Use the every method to check if all elements are strictly equal to the previous element
          return array.every((value, index, arr) => index === 0 || value === arr[index - 1]);

    }

    useEffect(()=>{
        const updateLocationParam = () => {
            setLocationSearch(routeParams.get("location"))

            setPinSearch(routeParams.get("pin"))
        }
        updateLocationParam()
    },[routeParams])

    useEffect(() => {
        //When primary feature result changes update the search param
        //from mouse click

        if(primaryResultFeature && newSearch === false){
            console.log("FEATURES ", primaryResultFeature)
            
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
                        paramValue = "lat/long"
                        param = {"location": paramValue}
                    }
                }
                else if(isMultiFeatures === true && pin10Match === true){
                    paramValue = attributes["PIN10"]
                    param = {"pin": paramValue}
                }
    
                //not a search event result
                //map click result or result card result
                console.log("New Search", newSearch)
                if(newSearch === false){
                    setSearchParams()
                    console.log("PARAM : ", param)
                    setSearchParams(param)
    
                    console.log("UPDATING url parameter", paramValue)
    
                    if(searchWidget.current && ![attributes["PIN10"], attributes["PIN14"], attributes["street_address"]].includes(searchWidget.current.searchTerm)){
                        searchWidget.current.searchTerm = paramValue
                    }
                    
                }
            }
            
    }


    }, [primaryResultFeature, searchWidget])


    useEffect(() => {
        const createSearch = async () => {

            if(searchDiv.current && searchSources){

                if(!searchWidget.current){

                    searchWidget.current = new widgetsSearch({

                        includeDefaultSources: false,
                        view: mapView,
                        container: searchDiv.current,
                        sources: searchSources,
                        resultGraphicEnabled:false,
                        autoSelect: true
                    })
                }

                await searchWidget.current.when();

                if(newSearch === true){
                    if(genericSearch && !locationSearch){
                        searchWidget.current.search(genericSearch)
                    }

                    if(pinSearch){
                       console.log("Performing New Search for pin=", pinSearch)           
                        searchWidget.current.search(pinSearch)
                    }

                    if(addressSearch){
                        searchWidget.current.search(addressSearch)
                    }

                    if(locationSearch){
                        console.log("Location search = ", locationSearch)             
                        searchWidget.current.search(locationSearch)
                    }
                }

                
                
                searchWidget.current.on("select-result", function(){
                    console.log("The selected search result: ", searchWidget.current.selectedResult)
                    //setSearchResults(searchWidget.current.selectedResult)
                    // setPrimaryResultFeature(null, true)
                    renderSearchResults(searchWidget.current.selectedResult)

                    if(!panelPrimaryVisible || panelPrimaryVisible === false){
                        setPanelPrimaryVisibility(true)
                    }
                    
                    if(searchWidget.current.searchTerm !== locationSearch){
                        setSearchParams({'search': searchWidget.current.searchTerm})
                    }
                    
                    
                })

                searchWidget.current.on("suggest-start", async function(event){
                    console.log("suggest-start", searchWidget.current.suggestions);

                    await searchWidget.current.when();
                    let suggestions = searchWidget.current.suggestions
                    console.log(" Suggestions ", suggestions)
                    const filteredSuggestions = suggestions?.filter(item => {
                        console.log("has results ", item.results)
                        const hasResults = item.results.length > 0;
                        const hasAddressLocator = Object.keys(item.source).includes("url") && item.source.url.includes('addresslocator');

                        const isAddressLocatorNoOtherResults = hasAddressLocator && suggestions.every((otherItem) => otherItem.results.length === 0)
                      
                        // Include the item in the filtered array if both conditions are false
                        return (!hasAddressLocator && suggestions.every((otherItem) => otherItem.results.length > 0));
  
                      });

                    console.log("filtered Suggestions ", filteredSuggestions)

                  });
                  
                
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

    },[searchDiv, mapView, searchSources, newSearch, locationSearch])

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