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
        returnFeaturesByPin10Pin14,  
        language, 
        translateText,  
        newSearch, 
        searchSources, 
        clearResults, 
        primaryResultFeature, 
        setPrimaryResultFeature,
        initalizeSearchSources,
        returnSearchResultFeatures,
        setLanguage,
        togglePanel,
        refSearch
     } = UseAppContext()

    //get url parameters
    const [routeParams, setSearchParams] = useSearchParams();

    let [genericSearch, setGenericSearch] = useState(null)
    //replacing location search with pin10 and pin14 search
    let [pin10Search, setPin10Search] = useState(null)
    let [pin14Search, setPin14Search] = useState(null)

    //create a reference to the search  DOM  element
    const searchDiv = useRef(null)



    const updateAppWithSearchResult = () => {

        setPin10Search(null)
        setPin14Search(null)
        setGenericSearch(null)

        let lang = routeParams.get('lang')

        setSearchParams({
            'search': refSearch.current?.searchTerm,
            'lang': lang ? lang : config.defaultLanguage
        })
    }

    
    //Create Search AND watch for search events
    //update this to only handle url parameters
    useEffect(() => {

        const createSearch = async () => {

            if(searchSources){

                // && mapView
                if(refSearch.current){
                    if(newSearch === true){
                        if(genericSearch){
                            console.log("DETECTED GENERIC SEARCH PARAM: ", genericSearch)
                            refSearch.current.search(genericSearch)
                            refSearch.current.searchTerm = genericSearch
                        }
    
                        if(pin10Search || pin14Search){
                            //if pin10 or pin14 search params return values
                            //bypass the seach and query the parcels directly from the service
                            let features = await returnFeaturesByPin10Pin14(pin10Search, pin14Search)
                        }

                        if(primaryResultFeature && primaryResultFeature.length > 0){
                            togglePanel('search')
                        }
                        
                    }
                }

            }
        }

        createSearch()

    },[searchSources])
    
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
            
            console.log("generic search: ", routeParams.get("search"))
            setGenericSearch(routeParams.get("search"))


            //check language 'lang'  and update language global state
            let lang = routeParams.get("lang")
            if(lang){
                setLanguage(lang)
            }
        }
    }, [])

    //Primary Search Feature Changes
    //Clear url search term and update url parameters
    useEffect(() => {

        if(!primaryResultFeature && refSearch.current){
            refSearch.current.searchTerm = null
        }
        
        if(primaryResultFeature){
            let searchParamValue = routeParams.get("search")
            let pin10ParamValue = routeParams.get("pin10")
            let pin14ParamValue = routeParams.get("pin14")

            if(!searchParamValue && (pin10ParamValue || pin14ParamValue)){
                refSearch.current.searchTerm = null
            }

            
        }
    },[primaryResultFeature])
    

    useEffect(() => {
        
        const updateSearchText = async () => {
        if(refSearch.current){
            refSearch.current.allPlaceholder = translateText('Search by address, pin, or intersection')
            let updatedSearchSources = await initalizeSearchSources()
            refSearch.current.sources = updatedSearchSources
            
        }
    }
        

        updateSearchText()
        

    },[refSearch, language])

    return(
        <>
        { searchSources ?
            <arcgis-search
                id={"search-bar"}
                ref={refSearch}
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

                    if(primaryResultFeature && primaryResultFeature.length > 0){
                        togglePanel('search')
                    }
                    
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