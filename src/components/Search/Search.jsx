import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../../theme";
import widgetsSearch from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom"
import { config } from "../../data/config";



const Search = () => {

    const { newSearch, setPanelPrimaryVisibility, renderSearchResults, mapView, searchSources, clearResults, panelPrimaryVisible, primaryResultFeature } = UseAppContext()

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

                //if url parameter is passed perform search method on search widget
                // if(searchString){
                //     //performing search method automatically selects the first
                //     //result. triggering the setSearchResults function
                //     if(searchString !== 'null' && newSearch){
                //         console.log("Searching for ", searchString)
                //         console.log("new search ", newSearch)
                //         searchWidget.current.search(searchString)
                //     }

                //     //update search term when user selects a parcel by clicking
                //     if(newSearch === false && searchWidget.current.searchTerm !== searchString){
                        
                //         console.log("SEARCH TERM: ", searchWidget.current.searchTerm)
                //         searchWidget.current.searchTerm = searchString 
                    
                //     }


                //     if(searchString === null || searchString === "" || searchString === 'null'){
                //         searchWidget.current.clear();
                //     }
                    
                // }

                if(genericSearch){
                    searchWidget.current.search(genericSearch)
                }

                if(pinSearch){
                    searchWidget.current.search(pinSearch)
                }

                if(addressSearch){
                    searchWidget.current.search(addressSearch)
                }

                if(locationSearch && locationSearch !== null){
                    if(newSearch === true ){              
                        searchWidget.current.search(locationSearch)
                    }
                    if(newSearch === false){
                        console.log("NEW SEARCH = FALSE ", searchWidget.current.searchTerm, primaryResultFeature.attributes['PIN10'])
                        if(searchWidget.current.searchTerm !== primaryResultFeature.attributes['PIN10']){
                            searchWidget.current.searchTerm = primaryResultFeature.attributes['PIN10']
                        }
                    }
                    
                }
                
                searchWidget.current.on("select-result", function(event){
                    console.log("The selected search result: ", searchWidget.current.selectedResult)
                    //setSearchResults(searchWidget.current.selectedResult)

                    renderSearchResults(searchWidget.current.selectedResult)

                    if(!panelPrimaryVisible || panelPrimaryVisible === false){
                        setPanelPrimaryVisibility(true)
                    }
                    
                    setSearchParams({'search': searchWidget.current.searchTerm})
                    
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