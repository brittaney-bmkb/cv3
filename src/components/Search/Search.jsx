import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../../theme";
import widgetsSearch from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import { config } from "../../data/config";



const Search = () => {

    const { newSearch, setPanelPrimaryVisibility, renderSearchResults, mapView, searchSources, clearResults, panelPrimaryVisible, primaryResultFeature, searchFeatures } = UseAppContext()

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

    let [locationSearch, setLocationSearch] = useState(
        routeParams.get("location")
    )


    //create a reference to the search  DOM  element
    const searchDiv = useRef(null)
    //create a reference to the search widget DOM element
    const searchWidget = useRef(null)

    useEffect(() => {
        //When primary feature result changes update the search param
        //from mouse click
        if(primaryResultFeature?.length === 1 && newSearch === false){
            setSearchParams({"search" : null})
            setSearchParams({"location" : primaryResultFeature[0].attributes["PIN14"]})
        }
        if(primaryResultFeature?.length > 1 && newSearch === false){
            setSearchParams({"search" : null})
            setSearchParams({"location" : primaryResultFeature[0].attributes["PIN10"]})
        }

        if(searchWidget.current && primaryResultFeature && searchFeatures){
            if(!searchWidget.current.searchTerm){
                console.log("Updating search term: ", primaryResultFeature)
                searchWidget.current.searchTerm = primaryResultFeature?.length > 1 ? primaryResultFeature[0].attributes['PIN10'] : primaryResultFeature[0].attributes['PIN14']
            }
        }

        if(searchWidget.current && newSearch === false && primaryResultFeature && locationSearch){
            let attributes = Array.isArray(primaryResultFeature) ? primaryResultFeature[0].attributes : primaryResultFeature.attributes
            let isMultiFeatures =  Array.isArray(primaryResultFeature) && primaryResultFeature.length > 1 ? true : false
            searchWidget.current.searchTerm = isMultiFeatures > 1 ? attributes['PIN10'] : attributes['PIN14']
        }


    }, [routeParams, newSearch, primaryResultFeature, searchFeatures, searchWidget])


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


                if(genericSearch && !locationSearch){
                    searchWidget.current.search(genericSearch)
                }

                if(pinSearch){
                    searchWidget.current.search(pinSearch)
                }

                if(addressSearch){
                    searchWidget.current.search(addressSearch)
                }

                if(locationSearch && locationSearch !== null){


                    console.log("Location search = ", locationSearch)
                    if(newSearch === true ){              
                        searchWidget.current.search(locationSearch)
                    }
  
                }
                
                searchWidget.current.on("select-result", function(event){
                    console.log("The selected search result: ", searchWidget.current.selectedResult)
                    //setSearchResults(searchWidget.current.selectedResult)

                    renderSearchResults(searchWidget.current.selectedResult)

                    if(!panelPrimaryVisible || panelPrimaryVisible === false){
                        setPanelPrimaryVisibility(true)
                    }
                    
                    if(searchWidget.current.searchTerm !== locationSearch){
                        setSearchParams({'search': searchWidget.current.searchTerm})
                    }
                    
                    
                })

                // searchWidget.current.on("suggest-start", function(event){
                //     console.log("suggest-start", searchWidget.current.suggestions);
                //   });
                
                //to do enable clear results to empty searchFeatures array
                searchWidget.current.on("search-clear", function(event){
                    // The results are stored in the event Object[]
                    console.log("Search input textbox was cleared.");
                    clearResults();
                  });
            }

        
        }
        //execute function search function with url param
        createSearch()

    },[searchDiv, mapView, searchSources, newSearch, routeParams])

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