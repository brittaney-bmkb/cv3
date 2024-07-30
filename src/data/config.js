export const config = {
    //show alert banner
    showBanner: true,
    bannerHeader:"Welcome to the CookViewer 3.0 BETA",
    bannerMessage:"This application and the data being presented are still undergoing development and refinement. For more consistent results open CookViewer Classic",
    bannerLinkText: "open CookViewer Classic",
    bannerLinkHtml:"https://maps.cookcountyil.gov/cookviewer/", 
    bannerColor:"#EDBE1C",
    //IMAGES ROOT DIRECTORY
    image_directory: "https://maps.cookcountyil.gov/files/apps/cookviewer/images",
    //NAVBAR
    //App Logo
    logo:"https://maps.cookcountyil.gov/cdn/cook/cook_logo.png",
    //App Pages
    // pages: ['Home','Data','Help'], // removed for now. 
    // PORTAL URL: Provide the URL to your ArcGIS Online organization or Portal for ArcGIS.
    portal:"https://cookcountyil.maps.arcgis.com/",
    //PRINT URL
    print_service_url: "https://gis.cookcountyil.gov/hosting/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    // BASEMAP ID: Provide the ID of the basemap you want to use in the application.
    basemap_item_id:"7d31919b0623451ea7e576c85c48f52a",
    // BASEMAP GROUP ID: Provide the ID of the group you want to use for basemaps
    basemap_group_id: '6ce214380e7144acb42d348cef7985d7',
    //MAP selection colors
    //Primary Color:
    primary_color:'',
    //Secondayr Color:
    secondary_color:'',
    //PRINT OPTIONS
    print_orientation_options : ['Landscape', 'Portrait'],
    //DATA DICTIONARY SERVICE
    data_dictionary: "https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_data_dictionary_view/FeatureServer/0",
    // TARGET LAYER CONFIGURATION: Specify the name of the target layer and the fields to display in results.
    // MAKE SURE THE NAME OF THIS LAYER IS EXACTLY THE SAME IN THE LAYERSOURCES ARRAY
    target_layer_name: "Parcels Current", // Name of the target layer in LayerSources
    target_layer_url: "https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0",
    target_layer_out_fields: ["PIN10","PIN14","PIN14_dash","street_address","city_state_zip","OBJECTID"],// Fields to display in the results pane (array of strings).
    //FIELD TO REFERENCE FOR CREATING URL PARAM WHEN CLICKING IN MAP
    target_layer_id_field: "PIN10",
    target_layer_unique_id: "PIN14",
    //MUNICIPALITY SERVICE- USED TO CALCULATE INCORPORATED VS UNINCORPORATED VALUES FOR MUNICIPALITY IN PROPERTY DETAIL
    municipality_url: "https://gis.cookcountyil.gov/traditional/rest/services/politicalBoundary/MapServer/2",
    // NEARBY SEARCH SETTINGS: Configure the buffer distance and unit for nearby searches.
    buffer_distance: 60,
    buffer_unit: "feet",
    //No results Message
    no_results_message: "Try a new search using the search bar or by clicking in the map",
    //LANGUAGES
    defaultLanguage: "english",
    languages:["english","spanish"],
    //APP TRANSLATION TEXT
    translation_text:"https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer/1",
    translation_text_help:"https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer/4",
    //WEB MAP ID
    webmap_id: "2d8ad931484c4f6dad75e1842470e19a",
    // LAYER SOURCES CONFIGURATION: Configure the layers for map and search sources for the search widget
    layer_sources: [
        // First Layer Source: Configure the parcelLayer
        // To add or remove a layer source copy or delete an object and modify
        // the object's properties
       {
           layerName: "Parcels Current", // Name of the layer source.
           description:"",
           url: "https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/", // URL to the layer service.
           type: 'mapImageLayer',
           index: 0,
           outFields: ["*"], // Fields to return in the search results (array of strings).
           popupEnabled:false, // Enable/disable popups for this layer source (boolean).
           popupTemplateTitle:"Parcel pin 14 {PIN14}", // Popup template title with field placeholders.
           maxScale:0,
           minScale: 20000,
           opacity: 1,
           visible:true,
           groupName:"Parcels",
           render: {
                type: "simple",
                symbol: {
                    type: "simple-fill",
                    style:"none",
                    outline: {
                        width:1,
                        color: "#0D4D96"
                    },
                },
                visualVariables: [{
                    type: "size",
                    valueExpression: "$view.scale",
                    target: "outline",
                    stops: [
                        { size: 2, value: 0 },
                        { size: 0.05, value: 5000 }
                    ]
                }]
           },
           searchSources: [
            // {
            //     name: "Parcel Pin", // Name of the search source.
            //     displayField: "PIN14_dash", // Field used for displaying search suggestions.
            //     exactMatch: false, // Exact match search (boolean).
            //     maxResults: 1000, // Maximum number of search results.
            //     maxSuggestions: 50, // Maximum number of search suggestions.
            //     minSuggestCharacters: 2, // Minimum characters for search suggestions.
            //     outFields: [ "PIN14","PIN10", "PIN14_dash"], // IMPORTANT put the field that will be used to perfrom search query as the first item in the array. Fields to return in search results (array of strings).
            //     orderByFields: ["PIN14"], // Fields for sorting search results (array of strings).
            //     searchFields: ["PIN10", "PIN14", "PIN14_dash"], // Fields used for searching (array of strings).
            //     suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
            //     autoNavigate: false, // Automatically navigate to the result on selection (boolean).
            //     searchTemplate: "{PIN14_dash}"
            // },

            // {
            //     name: "Parcel 14 digit pin", // Name of the search source.
            //     displayField: "PIN14", // Field used for displaying search suggestions.
            //     exactMatch: false, // Exact match search (boolean).
            //     maxResults: 50, // Maximum number of search results.
            //     maxSuggestions: 50, // Maximum number of search suggestions.
            //     minSuggestCharacters: 4, // Minimum characters for search suggestions.
            //     outFields: ["PIN14"], // Fields to return in search results (array of strings).
            //     orderByFields: ["PIN14"], // Fields for sorting search results (array of strings).
            //     searchFields: ["PIN14"], // Fields used for searching (array of strings).
            //     suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
            //     autoNavigate: false, // Automatically navigate to the result on selection (boolean).
            // },

            //    {

            //        name: "Parcel Address",
            //        displayField:"street_address",
            //        exactMatch:false,
            //        maxResults:1000,
            //        maxSuggestions:50,
            //        minSuggestCharacters:2,
            //        outFields: ["street_address", "city_state_zip"],
            //        orderByFields:["street_address"],
            //        searchFields:["street_address","city_state_zip"],
            //        suggestionsEnabled:true,
            //        autoNavigate:false,
            //        searchTemplate: "{street_address}, {city_state_zip}",
            //        suggestionTemplate: "{street_address}, {city_state_zip}"
            //    }
           ]
       } 
   ],
      // LOCATOR SOURCES CONFIGURATION: Configure the locators for the search widget
      locator_search_sources: [
        {
            apiKey: null,
            autoNavigate:true,
            maxResults: 1000,
            maxSuggestions:50,
            minSuggestCharacters: 3,
            name: "Address Locator",
            outFields:["StAddr", "City", "Postal"],
            popupEnabled: false,
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://gis.cookcountyil.gov/traditional/rest/services/Locator/CookAddressMultirole/GeocodeServer"
        },
        {
            apiKey: null,
            autoNavigate:false,
            maxResults: 1000,
            maxSuggestions:50,
            minSuggestCharacters: 3,
            name: "Parcel Locator",
            outFields:["StAddr",],
            popupEnabled: false,
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            //url:"https://test-gis.cookcountyil.gov/traditional/rest/services/Locator/parcelMultirole/GeocodeServer"
            url:"https://test-gis.cookcountyil.gov/traditional/rest/services/Locator/parcelMultirole_20240730/GeocodeServer"
        }
    ]
}
