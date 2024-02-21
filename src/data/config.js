export const config = {
    //show alert banner
    showBanner: true,
    bannerMessage:"Cookviewer beta message",
    bannerColor:"#ed6c02",
    //NAVBAR
    //App Logo
    logo:"https://maps.cookcountyil.gov/cdn/cook/cook_logo.png",
    //App Pages
    pages: ['Home','Data','Help'],
    // PORTAL URL: Provide the URL to your ArcGIS Online organization or Portal for ArcGIS.
    portal:"https://cookcountyil.maps.arcgis.com/",
    // BASEMAP ID: Provide the ID of the basemap you want to use in the application.
    basemap_item_id:"7d31919b0623451ea7e576c85c48f52a",
    //MAP selection colors
    //Primary Color:
    primary_color:'',
    //Secondayr Color:
    secondary_color:'',
    //PRINT OPTIONS
    print_orientation_options : ['Landscape', 'Portrait'],
    //DATA DICTIONARY SERVICE
    data_dictionary: "https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/cookviewer_data_dictionary/FeatureServer/0",
    // TARGET LAYER CONFIGURATION: Specify the name of the target layer and the fields to display in results.
    // MAKE SURE THE NAME OF THIS LAYER IS EXACTLY THE SAME IN THE LAYERSOURCES ARRAY
    target_layer_name: "parcelLayer", // Name of the target layer in LayerSources
    target_layer_out_fields: ["PIN10","PIN14","PIN14_dash","street_address","city_state_zip","OBJECTID"],// Fields to display in the results pane (array of strings).
    //FIELD TO REFERENCE FOR CREATING URL PARAM WHEN CLICKING IN MAP
    target_layer_id_field: "PIN10",
    //MUNICIPALITY SERVICE- USED TO CALCULATE INCORPORATED VS UNINCORPORATED VALUES FOR MUNICIPALITY IN PROPERTY DETAIL
    municipality_url: "https://gis.cookcountyil.gov/traditional/rest/services/politicalBoundary/MapServer/2",
    // NEARBY SEARCH SETTINGS: Configure the buffer distance and unit for nearby searches.
    buffer_distance: 50,
    buffer_unit: "feet",
    // LAYER SOURCES CONFIGURATION: Configure the layers for map and search sources for the search widget
    layer_sources: [
        // First Layer Source: Configure the parcelLayer
        // To add or remove a layer source copy or delete an object and modify
        // the object's properties
       {
           layerName: "parcelLayer", // Name of the layer source.
           description:"",
           url: "https://dev-gis.cookcountyil.gov/traditional/rest/services/CookViewerParcels/MapServer", // URL to the layer service.
           type: 'mapImageLayer',
           index: 0,
           outFields: ["*"], // Fields to return in the search results (array of strings).
           popupEnabled:true, // Enable/disable popups for this layer source (boolean).
           popupTemplateTitle:"Parcel pin 14 {PIN14}", // Popup template title with field placeholders.
           maxScale:0,
           minScale: 30000,
           opacity: .5,
           visible:true,
           groupName:"Parcels",
           render: {
                type: "simple",
                symbol: {
                    type: "simple-fill",
                    style:"none",
                    outline: {
                        width:.5,
                        color: "#009ADA"
                    },
                }
           },
           searchSources: [
            {
                name: "Parcel 10 digit pin", // Name of the search source.
                displayField: "PIN10", // Field used for displaying search suggestions.
                exactMatch: false, // Exact match search (boolean).
                maxResults: 50, // Maximum number of search results.
                maxSuggestions: 50, // Maximum number of search suggestions.
                minSuggestCharacters: 4, // Minimum characters for search suggestions.
                outFields: ["PIN10"], // Fields to return in search results (array of strings).
                orderByFields: ["PIN10"], // Fields for sorting search results (array of strings).
                searchFields: ["PIN10"], // Fields used for searching (array of strings).
                suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
                autoNavigate: false, // Automatically navigate to the result on selection (boolean).
            },

            {
                name: "Parcel 14 digit pin", // Name of the search source.
                displayField: "PIN14", // Field used for displaying search suggestions.
                exactMatch: false, // Exact match search (boolean).
                maxResults: 50, // Maximum number of search results.
                maxSuggestions: 50, // Maximum number of search suggestions.
                minSuggestCharacters: 4, // Minimum characters for search suggestions.
                outFields: ["PIN14"], // Fields to return in search results (array of strings).
                orderByFields: ["PIN14"], // Fields for sorting search results (array of strings).
                searchFields: ["PIN14"], // Fields used for searching (array of strings).
                suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
                autoNavigate: false, // Automatically navigate to the result on selection (boolean).
            },

               {

                   name: "Address",
                   displayField:"street_address",
                   exactMatch:false,
                   maxResults:50,
                   maxSuggestions:50,
                   minSuggestCharacters:4,
                   outFields: ["street_address"],
                   orderByFields:["street_address"],
                   searchFields:["street_address"],
                   suggestionsEnabled:true,
                   autoNavigate:false,
               }
           ]
       },
       //Natural Environment and Recreation
       {
        layerName:"Fishing Lakes",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/6", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Natural Environment and Recreation",
        render:null,
        searchSources: []
       },
       {
        layerName:"Trail",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/10", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Natural Environment and Recreation",
        render:null,
        searchSources: []
       },
       {
        layerName:"Contours",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/11", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Natural Environment and Recreation",
        render:null,
        searchSources: []
       },
       {
        layerName:"High School Districts",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/19", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Tax Districts",
        render:null,
        searchSources: []
       },
       //Boundaries and Districts
       //Property & Land Records
       //Imagery
       //Places of Interest
       //Transportation
   ],
      // LOCATOR SOURCES CONFIGURATION: Configure the locators for the search widget
      locator_search_sources: [
        {
            apiKey: null,
            autoNavigate:false,
            maxResults: 50,
            maxSuggestions:50,
            minSuggestCharacters: 4,

            name: "Address",
            outFields:["Street", "City", "Postal"],
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://test-gis.cookcountyil.gov/traditional/rest/services/AddressLocator/pointStreetMultiRoleAltStNameNoSubaddress/GeocodeServer"
        }
    ]
}