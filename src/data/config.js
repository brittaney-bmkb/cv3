export const config = {
    //show alert banner
    showBanner: true,
    bannerHeader:"Welcome to CookViewer 3.0!",
    bannerMessage:"We hope you enjoy the modernized user experience. The previous version of CookViewer will still be available for a limited time.",
    bannerLinkText: "The previous version of CookViewer",
    bannerLinkHtml:"https://maps.cookcountyil.gov/cookviewerv2/", 
    bannerColor:"#F0F4F8",
    // bannerHeader:"Intermittent Downtime",
    // bannerMessage:"CookViewer will have intermittent downtime between November 19 and November 22 due to system updates. Users may experience issues viewing parcels and using CookViewer tools.",
    // // bannerLinkText: "The previous version of CookViewer",
    // // bannerLinkHtml:"https://maps.cookcountyil.gov/cookviewerv2/", 
    // bannerColor:"#edbe1c",
    //IMAGES ROOT DIRECTORY
    image_directory: "https://maps.cookcountyil.gov/files/apps/cookviewer/images",
    //NAVBAR
    title: "CookViewer",
    description: "Cook County Parcel Viewer",
    //App Logo
    logo:"https://maps.cookcountyil.gov/cdn/cook/cook_logo.png",
    //App Pages
    // pages: ['Home','Data','Help'], // removed for now. 
    // PORTAL URL: Provide the URL to your ArcGIS Online organization or Portal for ArcGIS.
    portal:"https://cookcountyil.maps.arcgis.com/",
    portal_gis: "https://gis.cookcountyil.gov/gisportal",
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
    //FEEDBACK URLS
    feedback_general:'//survey123.arcgis.com/share/ba8f1d610701420abc33612ef1d3378a?hide=navbar,footer',
    feedback_extended:'//survey123.arcgis.com/share/640dd8fd0d064eb880b65cc3d238f87f?hide=navbar,footer',
    feedback_search:'//survey123.arcgis.com/share/6c24e84d3ac24024a311b7e81045c382?hide=navbar,footer',
    //DATA DICTIONARY SERVICE
    data_dictionary: "https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/cookviewer_data_dictionary/FeatureServer/0",
    // TARGET LAYER CONFIGURATION: Specify the name of the target layer and the fields to display in results.
    //PARCEL LABELS LAYER
    parcel_label_layer: "Labels",
    //PARCEL ARCHIVE LAYER GROUP
    historical_group_name: "Parcel Archive",
    // MAKE SURE THE NAME OF THIS LAYER IS EXACTLY THE SAME IN THE LAYERSOURCES ARRAY
    target_layer_name: "Parcels Current", // Name of the target layer in LayerSources
    target_layer_url: "https://test-gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0",
    target_layer_out_fields: ["PIN10","PIN14","PIN14_dash","street_address","city_state_zip","OBJECTID"],// Fields to display in the results pane (array of strings).
    //FIELD TO REFERENCE FOR CREATING URL PARAM WHEN CLICKING IN MAP
    target_layer_id_field: "PIN10",
    target_layer_unique_id: "PIN14",
    target_layer_display_field: "PIN14_dash", //Controls how the export parcel title is dipslayed
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
    language_codes:{"english":"en-US","spanish":"es"},
    //APP TRANSLATION TEXT
    translation_text:"https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer/1",
    translation_text_help:"https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer/4",
    //WEB MAP ID
    webmap_id:"15c4eb52c7bb468d93c5946cb8e9d6ce", //PROD: "779a9643c58f4a48a002a9b277a8bcc7",
    // LAYER SOURCES CONFIGURATION: Configure the layers for map and search sources for the search widget
    layer_sources: [
        // First Layer Source: Configure the parcelLayer
        // To add or remove a layer source copy or delete an object and modify
        // the object's properties
       {
           layerName: "Parcels Current", // Name of the layer source.
           description:"",
           url: "https://test-gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/", // URL to the layer service.
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
            {
                name: "Parcel PIN", // Name of the search source.
                displayField: "PIN14_dash", // Field used for displaying search suggestions.
                exactMatch: false, // Exact match search (boolean).
                maxResults: 1000, // Maximum number of search results.
                maxSuggestions: 50, // Maximum number of search suggestions.
                minSuggestCharacters: 2, // Minimum characters for search suggestions.
                outFields: [ "PIN14","PIN10","PIN14_dash"], // IMPORTANT put the field that will be used to perfrom search query as the first item in the array. Fields to return in search results (array of strings).
                orderByFields: ["PIN14"], // Fields for sorting search results (array of strings).
                placeholder:"Search by 10 or 14 digit parcel PIN",
                searchFields: ["PIN10", "PIN14", "PIN14_dash"], // Fields used for searching (array of strings).
                suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
                autoNavigate: false, // Automatically navigate to the result on selection (boolean).
                searchTemplate: "{PIN14_dash}"
            },

           ]
       } 
   ],
      // LOCATOR SOURCES CONFIGURATION: Configure the locators for the search widget
      locator_search_sources: [
        {
            apiKey: null,
            autoNavigate:false,
            maxResults: 1000,
            maxSuggestions:50,
            minSuggestCharacters: 3,
            name: "Parcel Address Locator",
            outFields:["street_address","city_state_zip","UnitName"],
            placeholder:"Search by parcel address",
            popupEnabled: false,
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://gis.cookcountyil.gov/traditional/rest/services/Locator/parcelAddresses/GeocodeServer"
        },
        {
            apiKey: null,
            autoNavigate:true,
            maxResults: 1000,
            maxSuggestions:50,
            minSuggestCharacters: 3,
            name: "Address Locator",
            outFields:["StAddr", "City", "Postal","UnitName"],
            placeholder:"Search by street address",
            popupEnabled: false,
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://gis.cookcountyil.gov/traditional/rest/services/Locator/CookAddressMultirole/GeocodeServer"
        },

    ]
}
