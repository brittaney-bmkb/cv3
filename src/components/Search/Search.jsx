import { Box, InputBase, Paper } from "@mui/material";
import { theme } from "../../theme";
import widgetsSearch from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef } from "react";



const Search = () => {

    const { setSearchResults, mapView, searchSources } = UseAppContext()

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
                searchWidget.current.on("select-result", function(event){
                    console.log("The selected search result: ", searchWidget.current.selectedResult)
                    setSearchResults(searchWidget.current.selectedResult)
                })

                // searchWidget.current.on("search-complete", function(event){
                //     // The results are stored in the event Object[]
                //     console.log("Results of the search: ", event);
                //   });
            }

           

        }

        createSearch(null)
    },[searchDiv, mapView, searchSources])


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