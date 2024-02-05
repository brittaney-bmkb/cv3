export const config = {
    //show alert banner
    //NAVBAR
    //App Logo
    logo:"https://maps.cookcountyil.gov/cdn/cook/cook_logo.png",
    //App Pages
    pages: ['Home','Data','Help'],
    // PORTAL URL: Provide the URL to your ArcGIS Online organization or Portal for ArcGIS.
    portal:"https://cookcountyil.maps.arcgis.com/",
    // BASEMAP ID: Provide the ID of the basemap you want to use in the application.
    basemap_item_id:"7d31919b0623451ea7e576c85c48f52a",
    parcel_feature_service : "",
    // TARGET LAYER CONFIGURATION: Specify the name of the target layer and the fields to display in results.
    // MAKE SURE THE NAME OF THIS LAYER IS EXACTLY THE SAME IN THE LAYERSOURCES ARRAY
    target_layer_name: "parcelLayer", // Name of the target layer in LayerSources
    target_layer_out_fields: ["PIN14","Address","OBJECTID"],// Fields to display in the results pane (array of strings).
    // NEARBY SEARCH SETTINGS: Configure the buffer distance and unit for nearby searches.
    buffer_distance: 50,
    buffer_unit: "feet",
    // LAYER SOURCES CONFIGURATION: Configure the layers and search sources for the search widget
    layer_sources: [
        // First Layer Source: Configure the parcelLayer
        // To add or remove a layer source copy or delete an object and modify
        // the object's properties
       {
           layerName: "parcelLayer", // Name of the layer source.
           url: "https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/CookViewerParcelsFeatureAGO/FeatureServer/0", // URL to the layer service.
           outFields: ["PIN14","Pin14_dash", "street_address","OBJECTID"], // Fields to return in the search results (array of strings).
           popupEnabled:true, // Enable/disable popups for this layer source (boolean).
           popupTemplateTitle:"Parcel pin 14 {Pin14_dash}", // Popup template title with field placeholders.
           maxScale:0,
           minScale: 30000,
           opacity: 0,
           render: {
                type: "simple",
                symbol: {
                    type: "simple-line",
                    size: 1
                }
           },
           searchSources: [
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
                   name: "Parcel 14 digit pin dash", // Name of the search source.
                   displayField: "Pin14_dash", // Field used for displaying search suggestions.
                   exactMatch: false, // Exact match search (boolean).
                   maxResults: 50, // Maximum number of search results.
                   maxSuggestions: 50, // Maximum number of search suggestions.
                   minSuggestCharacters: 4, // Minimum characters for search suggestions.
                   outFields: ["Pin14_dash"], // Fields to return in search results (array of strings).
                   orderByFields: ["Pin14_dash"], // Fields for sorting search results (array of strings).
                   searchFields: ["Pin14_dash"], // Fields used for searching (array of strings).
                   suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
                   autoNavigate: false, // Automatically navigate to the result on selection (boolean).
               },
               {
                   name: "Parcel address",
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
   ],
      // LOCATOR SOURCES CONFIGURATION: Configure the locators for the search widget
      locator_search_sources: [
        {
            apiKey: null,
            autoNavigate:false,
            maxResults: 50,
            maxSuggestions:50,
            minSuggestCharacters: 4,
            name: "Cook Address Composite",
            outFields:["Street", "City", "ZIP"],
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://gis.cookcountyil.gov/traditional/rest/services/AddressLocator/CookAddressComposite/GeocodeServer"
        },
        {
            apiKey: null,
            autoNavigate:false,
            maxResults: 50,
            maxSuggestions:50,
            minSuggestCharacters: 4,
            name: "Point Street Multi Role Alt Streent Name No Sub Address",
            outFields:["Street", "City", "Postal"],
            singleLineFieldName:"SingleLine",
            suggestionsEnabled:true,
            url:"https://test-gis.cookcountyil.gov/traditional/rest/services/AddressLocator/pointStreetMultiRoleAltStNameNoSubaddress/GeocodeServer"
        }
    ]
}