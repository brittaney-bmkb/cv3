export const config = {
    //show alert banner
    showBanner: true,
    bannerMessage:"Cookviewer beta message",
    bannerColor:"#EDBE1C",
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
    // LAYER SOURCES CONFIGURATION: Configure the layers for map and search sources for the search widget
    layer_sources: [
        // First Layer Source: Configure the parcelLayer
        // To add or remove a layer source copy or delete an object and modify
        // the object's properties
       {
           layerName: "Parcels (current)", // Name of the layer source.
           description:"",
           url: "https://dev-gis.cookcountyil.gov/traditional/rest/services/CookViewerParcels/MapServer", // URL to the layer service.
           type: 'mapImageLayer',
           index: 0,
           outFields: ["*"], // Fields to return in the search results (array of strings).
           popupEnabled:true, // Enable/disable popups for this layer source (boolean).
           popupTemplateTitle:"Parcel pin 14 {PIN14}", // Popup template title with field placeholders.
           maxScale:0,
           minScale: 30000,
           opacity: 1,
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
       //Natural Environment and Recreation
       {
        layerName:"Boat Launch",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/5", // URL to the layer service.
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
        layerName:"Nature Preserve",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/7", // URL to the layer service.
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
        layerName:"Recreation",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/9", // URL to the layer service.
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
        layerName:"Picnic Grove",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/8", // URL to the layer service.
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
       //TAX DISTRICTS
       {
        layerName:"High School",
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
       {
        layerName:"Park",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/20", // URL to the layer service.
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
       {
        layerName:"Library",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/21", // URL to the layer service.
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
       {
        layerName:"Fire Protection",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/22", // URL to the layer service.
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
       {
        layerName:"Community College",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/23", // URL to the layer service.
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
       {
        layerName:"Tax Increment Finance (TIF)",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/24", // URL to the layer service.
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
       {
        layerName:"Elementary School",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/25", // URL to the layer service.
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
       {
        layerName:"Combined School",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/26", // URL to the layer service.
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
       //Political Districts
       {
        layerName:"Election Precinct",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/27", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Chicago Ward",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/28", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Board of Review",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/30", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Judicial District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/31", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Commisioner District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/32", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"State Senate District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/34", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"State Representative District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/35", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"U.S. Congressional District",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/36", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Political Township",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/43", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       {
        layerName:"Municipality",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/64", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Political Boundaries",
        render:null,
        searchSources: []
       },
       //Places of Interest
       {
        layerName:"Cemetery",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/0", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Places of Interest",
        render:null,
        searchSources: []
       },
       {
        layerName:"Hospital",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/1", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Places of Interest",
        render:null,
        searchSources: []
       },
       {
        layerName:"County Facility",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/2", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Places of Interest",
        render:null,
        searchSources: []
       },
       {
        layerName:"School",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/3", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Places of Interest",
        render:null,
        searchSources: []
       },
       //Transportation
       {
        layerName:"Rail Station",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/12", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Transportation",
        render:null,
        searchSources: []
       },
       {
        layerName:"CTA Bus Route",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/15", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Transportation",
        render:null,
        searchSources: []
       },
       {
        layerName:"Pace Bus Route",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/16", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Transportation",
        render:null,
        searchSources: []
       },
       {
        layerName:"Highway System",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/17", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Transportation",
        render:null,
        searchSources: []
       },
       //Census Statistical Areas
       {
        layerName:"Block",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/38", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Census Statistical Areas 2010",
        render:null,
        searchSources: []
       },
       {
        layerName:"Tract",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/40", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Census Statistical Areas 2010",
        render:null,
        searchSources: []
       },
       {
        layerName:"Block Group",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/39", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Census Statistical Areas 2010",
        render:null,
        searchSources: []
       },
       //Zoning
       {
        layerName:"Zoning (2011)",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/66", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Zoning",
        render:null,
        searchSources: []
       },
       {
        layerName:"Unincorporated Zoning (current)",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/65", // URL to the layer service.
        type: 'featureLayer',
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:null,
        minScale: null,
        opacity: null,
        visible:false,
        groupName:"Zoning",
        render:null,
        searchSources: []
       },
       //Parcel Archive
       {
        layerName:"Parcel 2022",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 72,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 500000,
        opacity: 1,
        visible:false,
        groupName:"Parcel Archive",
        render: null,
        searchSources: []
       },
       {
        layerName:"Parcel 2021",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/", // URL to the layer service.
        type: 'mapImageLayer',
        index: 71,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:{},
        searchSources: []
       },
       {
        layerName:"Parcel 2020",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 70,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2019",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 69,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2018",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 68,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2017",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 57,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2016",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 46,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2015",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 47,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2014",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 48,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2013",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 49,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2012",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 50,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2011",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 51,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2010",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 52,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2009",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 53,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2008",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 54,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2007",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 55,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2006",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 56,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2005",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 57,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2004",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 58,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2003",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 59,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2002",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 60,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2001",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 61,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
        opacity: null,
        visible:false,
        groupName:"Parcel Archive",
        render:null,
        searchSources: []
       },
       {
        layerName:"Parcel 2000",
        description: "",
        url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer", // URL to the layer service.
        type: 'mapImageLayer',
        index: 56,
        outFields: ["*"], // Fields to return in the search results (array of strings).
        maxScale:0,
        minScale: 30000,
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
            name: "Address Point",
            outFields:["Street", "City", "Postal"],
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://test-gis.cookcountyil.gov/traditional/rest/services/AddressLocator/pointStreetMultiRoleAltStNameNoSubaddress/GeocodeServer"
        }
    ]
}