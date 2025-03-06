import { Box } from "@mui/material";
import { theme } from "../../theme";
import Search from "@arcgis/core/widgets/Search.js";
import UseAppContext from "../../contexts/AppContext";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import { config } from "../../data/config";

import "@arcgis/map-components/components/arcgis-search"

const SearchBarComponent = () => {

    const {
        x, 
        y, 
        returnFeaturesByPin10Pin14,  
        language, 
        translateText,  
        newSearch, 
        setPanelPrimaryVisibility,
        setPanelDisplay, 
        searchSources, 
        clearResults, 
        panelPrimaryVisible, 
        primaryResultFeature, 
        setPrimaryResultFeature,
        initalizeSearchSources,
        returnSearchResultFeatures,
        searchFeatures,
        anyAttributesIncluded,
        setIsQuerying,
        panelDisplay,
        setSearchResultsPanel,
        setInfoPanel
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
    const searchComponent = useRef(null)


    const updateAppWithSearchResult = () => {

        setPin10Search(null)
        setPin14Search(null)
        setGenericSearch(null)

        if(!panelPrimaryVisible || panelPrimaryVisible === false){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsList")
        } 

        setSearchParams({'search': searchComponent.current.searchTerm})
    }

    
    //Create Search AND watch for search events
    //update this to only handle url parameters
    useEffect(() => {

        const createSearch = async () => {

            if(searchDiv.current && searchSources){
                // && mapView
                if(searchComponent.current){
                    if(newSearch === true){
                        if(genericSearch){
                            console.log("DETECTED GENERIC SEARCH PARAM: ", genericSearch)
                            searchComponent.current.search(genericSearch)
                            //searchComponent.current.searchTerm = genericSearch
                        }
    
                        if(pin10Search || pin14Search){
                            //if pin10 or pin14 search params return values
                            //bypass the seach and query the parcels directly from the service
                            let features = await returnFeaturesByPin10Pin14(pin10Search, pin14Search)
                            //mapView.goTo(features)
                        }
                    }
                }

            }
        }

        createSearch()

    },[searchDiv, searchSources])
    
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

    //Primary Search Feature Changes
    //Clear url search term and update url parameters
    useEffect(() => {

        if(!primaryResultFeature && searchComponent.current){
            searchComponent.current.searchTerm = null
        }
        
        if(primaryResultFeature){
            let searchParamValue = routeParams.get("search")
            let pin10ParamValue = routeParams.get("pin10")
            let pin14ParamValue = routeParams.get("pin14")

            if(!searchParamValue && (pin10ParamValue || pin14ParamValue)){
                searchComponent.current.searchTerm = null
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


    // useEffect(() => {
        
    //     const updateSearchText = async () => {
    //     if(searchComponent.current){
    //         searchComponent.current.allPlaceholder = translateText('Search by address, pin, or intersection')
    //         let updatedSearchSources = await initalizeSearchSources()
    //         searchComponent.current.sources = updatedSearchSources
            
    //     }
    // }
        

    //     updateSearchText()
        

    // },[searchComponent, language])

    return(
        <>
        { searchSources ?
            <arcgis-search
                ref={searchComponent}
                sources={searchSources}
                includeDefaultSourcesDisabled
                locationDisabled
                resultGraphicDisabled
                autoSelectDisabled
                //allPlaceholder={translateText('Search by address, pin, or intersection')}

                //HANDLE SEARCH EVENTS
                //COMPLETE SEARCH
                onarcgisComplete = {async (event) => {
                    console.log("Search complete event:", event)
                    
                    const results = event.detail.results
                    const searchTerm = event.detail.searchTerm
                    
                    await returnSearchResultFeatures(results, searchTerm)

                    updateAppWithSearchResult()

                    setSearchResultsPanel(false)
                    setInfoPanel(true)
                }}

                //CLEAR RESULTS
                onarcgisClear = {async (event) => {
                    console.log("Search was cleared")

                    setGenericSearch(null)
                    setPin14Search(null)
                    setPin10Search(null)

                    clearResults()

                }}
            />
            :null
        }
        </>
        
        
    )
}

export default SearchBarComponent