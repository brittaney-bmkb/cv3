import { config } from "../data/config"

const hideWelcome = localStorage.getItem("hideWelcomeDialog") === "true";

export const initialState = {

    //MAP
    mapView:null, //global state variable for mapView object: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html.
    primaryResultFeature: null, //a global state variable that stores an array of feature objects. These objects represent the primary features returned from a query (locator search results or spatial query) and are used throughout the app to manage and display parcel selection results.
    secondaryResultFeature:null,
    searchTerm: null,
    searchSources: null, //a global variable that stores the [searchSource](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search-SearchSource.html) object returned from the `createSearchSources` function. Required for the `SearchBar` component.
    searchFeatures: null,
    searchBufferGeometry:null,
    searchResultPoint:null,
    prevSearchFeatures: null,
    panelDisplay:null,
    panelDisplaySecondary:null,
    panelDisplayWidget:null,
    panelPrimaryVisible:true,
    panelSecondaryVisible:null,
    panelWidgetVisible:null,
    dataDictionary:null,
    parcelQueryFields: null,
    screenWidth: null,
    newSearch:null,
    comparableParcels: null,
    nearbyParcels:null,
    measureWidgetState:null,
    language: config.defaultLanguage,
    translateDialogOpen: false,
    textTranslationDictionary: null,
    showMapMobile: false,
    measureWidget: null,
    isQuerying: null,
    mapLayout: null,
    mapFormat: null,
    mapTitle: null,
    x: null,
    y: null, 
    openHelpDialog: false,
    selectMultiple: null,
    comparableType: null,
    //PANEL STATES
    infoPanelClosed: false,
    searchResultsPanelClosed: true,
    propertyDetailPanelClosed: true,
    comparablePanelClosed: true,
    nearbyPanelClosed: true,
    comparisonResultsClosed: true,
    comparisonDetailPanelClosed: true,
    layersPanelClosed: true,
    imageryPanelClosed: true,
    printPanelClosed:true,
    selectPanelClosed:true,
    helpPanelClosed:true,
    measurePanelClosed:true,
    //DIALOG STATES
    exportOpen: false,
    exportDataSource: null,
    feedbackOpen: false,
    feedbackSource:null,
    tourDialogOpen: !hideWelcome,
    suppressTourDialog:hideWelcome,
    //DEVICE STATE
    isMobile: null,
    //HISTORICAL PARCELS
    visibleParcelYears: []
}

const AppReducer = (state, action) => {

    const {type, payload} = action

    switch(type){

        case "SET_INFO_PANEL":
        return {
            ...state, 
            infoPanelClosed: payload.infoPanelClosed
        }  
        
        
        case "SET_SEARCH_RESULTS_PANEL":
            console.log("SEARCH RESULTS OPEN")
        return {
            ...state, 
            searchResultsPanelClosed: payload.searchResultsPanelClosed
        } 

        case "SET_PROPERTY_DETAIL_PANEL":
        return {
            ...state, 
            propertyDetailPanelClosed: payload.propertyDetailPanelClosed
        } 

        case "SET_HELP_PANEL":
        return {
            ...state, 
            helpPanelClosed: payload.helpPanelClosed
        }

        case "SET_COMPARABLE_PANEL":
        return {
            ...state, 
            comparablePanelClosed: payload.comparablePanelClosed
        } 

        case "SET_NEARBY_PANEL":
        return {
            ...state, 
            nearbyPanelClosed: payload.nearbyPanelClosed
        } 

        case "SET_COMPARISON_RESULTS_PANEL":
        return {
            ...state, 
            comparisonResultsClosed: payload.comparisonResultsClosed
        } 

        case "SET_COMPARISON_DETAIL_PANEL":
        return {
            ...state, 
            comparisonDetailPanelClosed: payload.comparisonDetailPanelClosed
        } 

        case "SET_LAYERS_PANEL":
        return {
            ...state, 
            layersPanelClosed: payload.layersPanelClosed
        } 

        case "SET_IMAGERY_PANEL":
        return {
            ...state, 
            imageryPanelClosed: payload.imageryPanelClosed
        } 

        case "SET_PRINT_PANEL":
        return {
            ...state, 
            printPanelClosed: payload.printPanelClosed
        }

        case "SET_MEASURE_PANEL":
        return {
            ...state, 
            measurePanelClosed: payload.measurePanelClosed
        }        

        case "SET_SELECT_PANEL":
        return {
            ...state, 
            selectPanelClosed: payload.selectPanelClosed
        }

        case "SET_EXPORT_DIALOG":
        return {
            ...state, 
            exportOpen: payload.exportOpen,
            exportDataSource: payload.exportDataSource
        }

        case "SET_FEEDBACK_DIALOG":
        return {
            ...state, 
            feedbackOpen: payload.feedbackOpen,
            feedbackSource: payload.feedbackSource
        }

        case "SET_TOUR_OPEN":
        return {
            ...state, 
            tourDialogOpen: payload.tourDialogOpen,
        }

        case "SET_SUPPRESS_TOUR_DIALOG":
        return {
            ...state,
            suppressTourDialog: action.payload,
        };

        case "SET_MOBILE":
        return {
            ...state, 
            isMobile: payload.isMobile,
        }
    
    
        case "SET_COMPARABLE_TYPE":
        //console.log("SET_COMPARABLE_TYPE")
        return {
            ...state, 
            comparableType: payload.comparableType
        }        
        
        case "SET_VISIBLE_PARCEL_YEARS":
        //console.log("SET_COMPARABLE_TYPE")
        return {
            ...state, 
            visibleParcelYears: payload.visibleParcelYears
        }  
        
        case "SET_MAP":
        console.log("SET_MAP: ", payload.map)
        return {
            ...state, 
            map: payload.map
        }  

        case "SET_MAP_VIEW":
            //console.log("SET_MAP_VIEW")
            return{
                ...state,
                mapView:payload.mapView
            }

        case "SET_MAP_VIEW_SCALE":
            //console.log("SET_MAP_VIEW_SCALE")
            return{
                ...state,
                mapViewScale:payload.mapViewScale
            }

        case "SET_PRIMARY_RESULT_FEATURE":
            console.log("SET_PRIMARY_RESULT_FEATURE: ", payload.primaryResultFeature)
            return{
                ...state,
                primaryResultFeature:payload.primaryResultFeature,
                newSearch:payload.newSearch
            }

        case "SET_SECONDARY_RESULT_FEATURE":
            //console.log("SET_SECONDARY_RESULT_FEATURE")
            return{
                ...state,
                secondaryResultFeature:payload.secondaryResultFeature,
            }
        
        case "SET_SEARCH_RESULT":
            //console.log("SET_SEARCH_RESULT")
            return {
                ...state,
                searchTerm: payload.searchTerm,
                searchResults: payload.searchResults,
                searchFeatures: payload.searchFeatures,
                prevSearchFeatures: payload.prevSearchFeatures
            }

        case "SET_SEARCH_SOURCES":
            //console.log("SET_SEARCH_SOURCES")
            return {
                ...state,
                searchSources: payload.searchSources,
            }
        case "SET_SEARCH_BUFFER_GEOMETRY":
            //console.log("SET_SEARCH_SOURCES")
            return {
                ...state,
                searchResultPoint: payload.searchResultPoint,
                searchBufferGeometry: payload.searchBufferGeometry,
            }

        case "SET_PANEL_DISPLAY":
            //console.log("SET_PANEL_DISPLAY")
            return {
                ...state,
                panelDisplay: payload.panelDisplay,
            }

        case "SET_PANEL_SECONDARY_DISPLAY":
            //console.log("SET_PANEL_SECONDARY_DISPLAY")
            return {
                ...state,
                panelDisplaySecondary: payload.panelDisplaySecondary,
            }

        case "SET_PANEL_PRIMARY_VISIBILTIY":
            //console.log("SET_PANEL_PRIMARY_VISIBILTIY")
            return {
                ...state,
                panelPrimaryVisible: payload.panelPrimaryVisible,
            }

        case "SET_PANEL_SECONDARY_VISIBILTIY":
            //console.log("SET_PANEL_SECONDARY_VISIBILTIY")
            return {
                ...state,
                panelSecondaryVisible: payload.panelSecondaryVisible,
            }

        case "SET_PANEL_WIDGET_VISIBILTIY":
            //console.log("SET_PANEL_WIDGET_VISIBILTIY")
            return {
                ...state,
                panelWidgetVisible: payload.panelWidgetVisible,
            }

        case "SET_PANEL_WIDGET_DISPLAY":
            //console.log("SET_PANEL_WIDGET_DISPLAY")
            return {
                ...state,
                panelDisplayWidget: payload.panelDisplayWidget,
            }

        case "SET_DATA_DICTIONARY":
            //console.log("SET_DATA_DICTIONARY")
            return {
                ...state,
                dataDictionary: payload.dataDictionary,
            }

        case "SET_PARCEL_QUERY_FIELDS":
            //console.log("SET_PARCEL_QUERY_FIELDS")
            return {
                ...state,
                parcelQueryFields: payload.parcelQueryFields,
            }

        case "SET_SCREEN_WIDTH":
            //console.log("SET_SCREEN_WIDTH")
            return {
                ...state,
                screenWidth: payload.screenWidth,
            }

        case "SET_COMPARABLE_PARCELS":
            //console.log("SET_COMPARABLE_PARCELS")
            return {
                ...state,
                comparableParcels: payload.comparableParcels,
            }
        case "SET_NEARBY_PARCELS":
            //console.log("SET_NEARBY_PARCELS")
            return {
                ...state,
                nearbyParcels: payload.nearbyParcels,
            }

        case "SET_MEASURE_WIDGET_STATE":
            //console.log("SET_MEASURE_WIDGET_STATE: ", payload.measureWidgetState)
            return {
                ...state,
                measureWidgetState: payload.measureWidgetState,
            }

        case "SET_LANGUAGE":
            //console.log("SET_LANGUAGE")
            return {
                ...state,
                language: payload.language,
            }
        case "SET_TRANSLATE_DIALOG_OPEN":
            //console.log("SET_TRANSLATE_DIALOG_OPEN")
            return {
                ...state,
                translateDialogOpen: payload.translateDialogOpen,
            }
        case "SET_TRANSLATE_DICTIONARY":
            //console.log("SET_TRANSLATE_DICTIONARY")
            return {
                ...state,
                textTranslationDictionary: payload.textTranslationDictionary,
            }
        case "SET_SHOW_MAP_MOBILE":
            //console.log("SET_SHOW_MAP_MOBILE")
            return {
                ...state,
                showMapMobile: payload.showMapMobile,
            }
        case "SET_MEASURE_WIDGET":
            //console.log("SET_MEASURE_WIDGET")
            return {
                ...state,
                measureWidget: payload.measureWidget,
            }
        case "SET_IS_QUERYING":
            //console.log("SET_IS_QUERYING")
            return {
                ...state,
                isQuerying: payload.isQuerying,
            }
        case "SET_MAP_PRINT_PROPS":
            //console.log("SET_MAP_PRINT_PROPS")
            return {
                ...state,
                mapLayout: payload.mapLayout,
                mapFormat: payload.mapFormat,
                mapTitle: payload.mapTitle
            }
        case "SET_COORDINATES":
            //console.log("SET_COORDINATES")
            return {
                ...state,
                x: payload.x,
                y: payload.y,
            }
        case "SET_OPEN_HELP_DIALOG":
            //console.log("SET_OPEN_HELP_DIALOG")
            return {
                ...state, 
                openHelpDialog: payload.openHelpDialog
            }
        case "SET_SELECT_MULTIPLE":
            //console.log("SET_SELECT_MULTIPLE")
            return {
                ...state, 
                selectMultiple: payload.selectMultiple
            }
            
        default:
            throw new Error(`No valid selection made`)
    }
}

export default AppReducer