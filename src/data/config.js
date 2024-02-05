export const config = {
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
    target_layer_out_fields: ["Pin10","Address","OBJECTID_1"],// Fields to display in the results pane (array of strings).
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
           url: "https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc/MapServer/44", // URL to the layer service.
           outFields: ["Pin10", "Address","OBJECTID_1"], // Fields to return in the search results (array of strings).
           popupEnabled:true, // Enable/disable popups for this layer source (boolean).
           popupTemplateTitle:"Parcel pin 10 {Pin10}", // Popup template title with field placeholders.
           maxScale:0,
           minScale: 0,
           opacity: 0,
           render: {
                type: "simple",
                symbol: {
                    type: "simple-marker",
                    size: 0
                }
           },
           searchSources: [
               {
                   name: "Parcel 10 digit pin", // Name of the search source.
                   displayField: "Pin10", // Field used for displaying search suggestions.
                   exactMatch: false, // Exact match search (boolean).
                   maxResults: 50, // Maximum number of search results.
                   maxSuggestions: 50, // Maximum number of search suggestions.
                   minSuggestCharacters: 4, // Minimum characters for search suggestions.
                   outFields: ["Pin10"], // Fields to return in search results (array of strings).
                   orderByFields: ["Pin10"], // Fields for sorting search results (array of strings).
                   searchFields: ["Pin10"], // Fields used for searching (array of strings).
                   suggestionsEnabled: true, // Enable/disable suggestions for this search source (boolean).
                   autoNavigate: false, // Automatically navigate to the result on selection (boolean).
               },
               {
                   name: "Parcel address",
                   displayField:"Address",
                   exactMatch:false,
                   maxResults:50,
                   maxSuggestions:50,
                   minSuggestCharacters:4,
                   outFields: ["Address"],
                   orderByFields:["Address"],
                   searchFields:["Address"],
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