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
    target_layer_name: "Parcels (current)", // Name of the target layer in LayerSources
    target_layer_out_fields: ["PIN10","PIN14","PIN14_dash","street_address","city_state_zip","OBJECTID"],// Fields to display in the results pane (array of strings).
    //FIELD TO REFERENCE FOR CREATING URL PARAM WHEN CLICKING IN MAP
    target_layer_id_field: "PIN10",
    //MUNICIPALITY SERVICE- USED TO CALCULATE INCORPORATED VS UNINCORPORATED VALUES FOR MUNICIPALITY IN PROPERTY DETAIL
    municipality_url: "https://gis.cookcountyil.gov/traditional/rest/services/politicalBoundary/MapServer/2",
    // NEARBY SEARCH SETTINGS: Configure the buffer distance and unit for nearby searches.
    buffer_distance: 50,
    buffer_unit: "feet",
    //No results Message
    no_results_message: "Try a new search using the search bar or by clicking in the map",
    //LANGUAGES
    defaultLanguage: "english",
    languages:["english","spanish"],
    //APP TRANSLATION TEXT
    translation_text:"https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer/1",
    translation_text_help:"https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer/4",
    // LAYER SOURCES CONFIGURATION: Configure the layers for map and search sources for the search widget
    layer_sources: [
        // First Layer Source: Configure the parcelLayer
        // To add or remove a layer source copy or delete an object and modify
        // the object's properties
       {
           layerName: "Parcels (current)", // Name of the layer source.
           description:"",
           url: "https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/", // URL to the layer service.
           type: 'mapImageLayer',
           index: 0,
           outFields: ["*"], // Fields to return in the search results (array of strings).
           popupEnabled:true, // Enable/disable popups for this layer source (boolean).
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
                name: "Parcel Pin", // Name of the search source.
                displayField: "PIN14_dash", // Field used for displaying search suggestions.
                exactMatch: false, // Exact match search (boolean).
                maxResults: 50, // Maximum number of search results.
                maxSuggestions: 50, // Maximum number of search suggestions.
                minSuggestCharacters: 2, // Minimum characters for search suggestions.
                outFields: [ "PIN14","PIN10", "PIN14_dash"], // IMPORTANT put the field that will be used to perfrom search query as the first item in the array. Fields to return in search results (array of strings).
                orderByFields: ["PIN14"], // Fields for sorting search results (array of strings).
                searchFields: ["PIN10", "PIN14", "PIN14_dash"], // Fields used for searching (array of strings).
                suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
                autoNavigate: false, // Automatically navigate to the result on selection (boolean).
                searchTemplate: "{PIN14_dash}"
            },

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

               {

                   name: "Parcel Address",
                   displayField:"street_address",
                   exactMatch:false,
                   maxResults:50,
                   maxSuggestions:50,
                   minSuggestCharacters:2,
                   outFields: ["street_address", "city_state_zip"],
                   orderByFields:["street_address"],
                   searchFields:["street_address","city_state_zip"],
                   suggestionsEnabled:true,
                   autoNavigate:false,
                   searchTemplate: "{street_address}, {city_state_zip}",
                   suggestionTemplate: "{street_address}, {city_state_zip}"
               }
           ]
       },
    //    //Natural Environment and Recreation
       {
        layerName:"Forest Preserve District of Cook County Boundary",
        description: "",
        url: "https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/Forest_Preserve_Boundary/FeatureServer/0", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Natural Environment and Recreation",
        render:{
            "type":"simple",
            "symbol":{
                "type": "simple-fill",
                "style":"solid",
                "color":[196,237,199,.4],
                "outline":{
                    "color":[112,112,112,1],
                    "width":0.75
                }}},
        searchSources: []
       },
    //    {
    //     layerName:"Boat Launch",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/5", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Natural Environment and Recreation",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Nature Preserve",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/7", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Natural Environment and Recreation",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Recreation",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/9", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Natural Environment and Recreation",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Picnic Grove",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/8", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Natural Environment and Recreation",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Fishing Lakes",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/6", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Natural Environment and Recreation",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Trail",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/10", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Natural Environment and Recreation",
    //     render:null,
    //     searchSources: []
    //    },
       {
        layerName:"Contours",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 11,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 2500,
        opacity: null,
        visible:false,
        groupName:"Natural Environment and Recreation",
        render:null,
        searchSources: []
       },
       //TAX DISTRICTS
       {
        layerName:"High School District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 19,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       {
        layerName:"Park District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 20,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       {
        layerName:"Library District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
        type: 'mapImageLayer',
        index: 21,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       {
        layerName:"Fire Protection District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 22,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       {
        layerName:"Community College District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 23,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       {
        layerName:"Tax Increment Finance (TIF) District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 24,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       {
        layerName:"Elementary School District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
        type: 'mapImageLayer',
        index: 25,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       {
        layerName:"Combined School District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 26,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       //Political Districts
    //    {
    //     layerName:"Election Precinct",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
    //     type: 'mapImageLayer',
    //     index: 27,
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:0,
    //     minScale: 500000,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Political Boundaries",
    //     render:null,
    //     searchSources: []
    //    },
       {
        layerName:"Chicago Ward",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 28,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 250000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Board of Review",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 30,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 400000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Judicial District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 31,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 400000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Commissioner District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 32,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 400000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"State Senate District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 34,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 400000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"State Representative District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 35,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 400000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"U.S. Congressional District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 36,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 400000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Political Township",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 43,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 400000,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Municipality",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 64,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 35001,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Unincorporated Area",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 42,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 190001,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
    //    //Places of Interest
    //    {
    //     layerName:"Cemetery",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/0", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Places of Interest",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Hospital",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/1", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Places of Interest",
    //     render:null,
    //     searchSources: []
    //    },
       {
        layerName:"County Facility",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
        type: 'mapImageLayer',
        index: 2,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: 190000,
        opacity: null,
        visible:false,
        groupName:"Places of Interest",
        render:null,
        searchSources: []
       },
    //    {
    //     layerName:"School",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/3", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Places of Interest",
    //     render:null,
    //     searchSources: []
    //    },
    //    //Transportation
    //    {
    //     layerName:"Rail Station",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/12", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Transportation",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"CTA Bus Route",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/15", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Transportation",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Pace Bus Route",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/16", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Transportation",
    //     render:null,
    //     searchSources: []
    //    },
       {
        layerName:"Highway System",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
        type: 'mapImageLayer',
        index:17,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: 150000,
        opacity: null,
        visible:false,
        groupName:"Transportation",
        render:null,
        searchSources: []
       },
    //    //Census Statistical Areas
    //    {
    //     layerName:"Block",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/38", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Census Statistical Areas 2010",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Tract",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/40", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Census Statistical Areas 2010",
    //     render:null,
    //     searchSources: []
    //    },
    //    {
    //     layerName:"Block Group",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/39", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Census Statistical Areas 2010",
    //     render:null,
    //     searchSources: []
    //    },
    //    //Zoning
    //    {
    //     layerName:"Zoning (2011)",
    //     description: "",
    //     url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/66", // URL to the layer service.
    //     type: 'featureLayer',
    //     outFields: ["*"], // Fields to return in the search results (array of strings).
    //     maxScale:null,
    //     minScale: null,
    //     opacity: null,
    //     visible:false,
    //     groupName:"Zoning",
    //     render:null,
    //     searchSources: []
    //    },
       {
        layerName:"Unincorporated Zoning (current)",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
        type: 'mapImageLayer',
        index: 65,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: 2501,
        opacity: null,
        visible:false,
        groupName:"Zoning",
        render:null,
        searchSources: []
       },
       //Parcel Archive
       {
        layerName:"Parcels 2023",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 2023,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: 1,
        visible:false,
        groupName:"Parcel Archive",
        render: null,
        searchSources: []
       },
       {
        layerName:"Parcels 2022",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 72,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: 1,
        visible:false,
        groupName:"Parcel Archive",
        render: null,
        searchSources: []
       },
       {
        layerName:"Parcels 2021",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
        type: 'mapImageLayer',
        index: 71,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:{},
        searchSources: []
       },
       {
        layerName:"Parcels 2020",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 70,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2019",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 69,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2018",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 68,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2017",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 57,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2016",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 46,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2015",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 47,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2014",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 48,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2013",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 49,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2012",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 50,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2011",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 51,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2010",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 52,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2009",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 53,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2008",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 54,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2007",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 55,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2006",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 56,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2005",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 57,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2004",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 58,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2003",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 59,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2002",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 60,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2001",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 61,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcels 2000",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 56,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 5001,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       //Imagery
       
       
   ],
      // LOCATOR SOURCES CONFIGURATION: Configure the locators for the search widget
      locator_search_sources: [
        {
            apiKey: null,
            autoNavigate:false,
            maxResults: 50,
            maxSuggestions:50,
            minSuggestCharacters: 2,
            name: "Address Locator",
            outFields:["StAddr", "City", "Postal"],
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://gis.cookcountyil.gov/traditional/rest/services/Locator/CookAddressMultirole/GeocodeServer"
        }
    ]
}
