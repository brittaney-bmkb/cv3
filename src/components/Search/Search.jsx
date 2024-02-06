import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../../theme";
import widgetsSearch from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom"



const Search = () => {

    const { setPanelPrimaryVisibility, setSearchResults, mapView, searchSources, clearResults } = UseAppContext()

    //get url parameters
    const [routeParams] = useSearchParams();


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
                    console.log("Searching for ", searchString)
                    //performing search method automatically selects the first
                    //result. triggering the setSearchResults function
                    searchWidget.current.search(searchString)
                }
                
                searchWidget.current.on("select-result", function(event){
                    console.log("The selected search result: ", searchWidget.current.selectedResult)
                    setSearchResults(searchWidget.current.selectedResult)

                    setPanelPrimaryVisibility(true)

                    routeParams.set('location', event.result.name)
                    // Get the updated URL with the new parameter value
                    const updatedUrl = `${window.location.pathname}?${routeParams.toString()}`;

                    // Use history.pushState to update the URL without refreshing the page
                    window.history.pushState({ path: updatedUrl }, '', updatedUrl);
                })
                
                //to do enable clear results to empty searchFeatures array
                searchWidget.current.on("search-clear", function(event){
                    // The results are stored in the event Object[]
                    console.log("Search input textbox was cleared.");
                    setSearchResults(null, null)

                    routeParams.set('location', '')
                    // Get the updated URL with the new parameter value
                    const updatedUrl = `${window.location.pathname}`;

                    // Use history.pushState to update the URL without refreshing the page
                    window.history.pushState({ path: updatedUrl }, '', updatedUrl);
                  });


            }

        
        }

        //get url paramters by loccation param
        const searchString = routeParams.get('location')
        //execute function search function with url param
        createSearch(searchString)

    },[searchDiv, mapView, searchSources, routeParams])


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