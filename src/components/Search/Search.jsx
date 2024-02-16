import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../../theme";
import widgetsSearch from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom"
import { config } from "../../data/config";



const Search = () => {

    const { newSearch, setPanelPrimaryVisibility, renderSearchResults, mapView, searchSources, clearResults, panelPrimaryVisible, primaryResultFeature } = UseAppContext()

    //get url parameters
    const [routeParams, setSearchParams] = useSearchParams();


    //create a reference to the search  DOM  element
    const searchDiv = useRef(null)
    //create a reference to the search widget DOM element
    const searchWidget = useRef(null)

    useEffect(() => {
        const createSearch = async (searchString) => {

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
                if(searchString){
                    
                    //performing search method automatically selects the first
                    //result. triggering the setSearchResults function
                    if(searchString !== 'null' && newSearch){
                        console.log("Searching for ", searchString)
                        console.log("new search ", newSearch)
                        searchWidget.current.search(searchString)
                    }
                    if(newSearch === false && searchWidget.current.searchTerm !== primaryResultFeature.attributes["PIN14"]){
                        console.log("SEARCH TERM: ", searchWidget.current.searchTerm)
                        searchWidget.current.searchTerm = primaryResultFeature.attributes["PIN14"] 
                    }
                    if(searchString === null || searchString === "" || searchString === 'null'){
                        searchWidget.current.clear();
                    }
                    
                }
                
                searchWidget.current.on("select-result", function(event){
                    console.log("The selected search result: ", searchWidget.current.selectedResult)
                    //setSearchResults(searchWidget.current.selectedResult)

                    renderSearchResults(searchWidget.current.selectedResult)

                    if(!panelPrimaryVisible || panelPrimaryVisible === false){
                        setPanelPrimaryVisibility(true)
                    }
                    
                    //setSearchParams({'location': event.result.name})
                    
                })
                
                //to do enable clear results to empty searchFeatures array
                searchWidget.current.on("search-clear", function(event){
                    // The results are stored in the event Object[]
                    console.log("Search input textbox was cleared.");
                    clearResults();

                    
                  });
            }

        
        }

        //get url paramters by loccation param
        const searchString = routeParams.get('location')
        //execute function search function with url param
        createSearch(searchString)

    },[searchDiv, mapView, searchSources, routeParams, newSearch])


    return(
        <Box 
        ref={searchDiv}
        flex={5} 
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