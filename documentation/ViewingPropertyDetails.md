# Cookviewer Technical Documentation

## Methods for Viewing Property Details
last updated: 2024-09-17

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Customization](#customization)
- [Conditional and Calculated Values](#conditional-and-calculated-values)

## Overview
Property details are displayed using the `PropertyDetail.jsx` component. When a user selects a search result from the results, comparables, or nearby properties pane, the `PropertyDetail.jsx` component renders detailed property information by:

- Fetching property related data from the `Parcels Current` service defined in `config.js` and the webmap 
- Fetching a curated list of fields to display from the `data_dictionary` service defined in `config.js`
- Performing spatial queries to calculate values for the Municipality and Zoning Information fields using the `municipality_url` prop defined in `config.js`
- Hiding or displaying property data based on data availability for taxing districts using specific property fields
- Hiding or displaying open data resources based on property class types
- Applying stylized font colors when comparing properties side by side

## Prerequisites
The `PropertyDetail.jsx` component is dependent on 4 data sources defined in config.js:

- `data_dictionary`: The data dictionary defines the fields, display labels, category labels, hyperlinks, and order of the data displayed in the property details pane.

    **Services**: 
    - PROD: 
        - SERVICE URL: https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/cookviewer_data_dictionary/FeatureServer/0| 
        - AGO ITEM: https://cookcountyil.maps.arcgis.com/home/item.html?id=bad878a14eea412abca437a6e1edc89d
    - TEST: 
        - SERVICE URL: https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/cookviewer_data_dictionary_test_data/FeatureServer/0
        - AGO ITEM: https://cookcountyil.maps.arcgis.com/home/item.html?id=d2dd12d8fc874948830636b2ba4b0f72

- `target_layer_url` + `webmap_id`: This service url is used to identify Parcels Current layer in the webmap based on the layer url. This layer is used to return parcel attributes displayed in the Property Detail panel when the user selects a parcel from the webmap

- `layer_source` + `url`: This is the same service url as the `target_layer_url`. In this case the service is being used by the search widget as a search layer data source. When the user selects a search suggestion from this search source, parcel attributes are returned and displayed in the Property Detail panel.  

## Customization

The Property Detail panel can be customized by modifying the records in the `data dictionary` service. In order for property data to be displayed the following fields must be populated: 
- **field**: The attribute field from the Current Parcel service. The attribute value from the this field will be displayed directly in Property Detail panel or used in a calculation to generate a new value
- **label**: The text that will be displayed in the Property Detail panel above the Current field value
- **category**: Groups the field and label values into categories. The text in this column will be displayed at the top of each section in the Property Detail panel. If a category value is equal to "top" then all the fields and labels will be displayed at the very top of the panel and remain static. 
- **category_order**: Controls the order of fields displayed in each category. 
- **type**: controls how the field values from the Current Parcel service are formatted. Types can include:  
    - **text**: Will display values without any formatting to the field attribute value from Parcels Current
    - **calc**: Field attribute value will be used in a calculation to create a new value on the fly in the app
    - **int or double**: Will format fields as number with comma separator 
    - **money**: Will format fields with $ sign and comma separator
- **details_category_order**: Controls the order of category sections

Optional fields:
- **hyperlink_text**: hyperlink label that will displayed instead of the field value
- **hyperlink_params**: attribute fields from the Current Parcel service that will be used in the hyperlink_url as additional parameters
- **hyperlink_url**: full hyperlink that will open in a new window. Values included in curly braces ({}) will be replaced with actual attribute values from the hyperlink_params field
- **credit**: will display credited sources below hyperlinks

## Conditional & Calculated Values
Its important to note that as of V3.0.1 some property details are conditionally displayed or calcualted by referencing specific field values from the `Current Parcel` service and the `data dictionary` service. A number of attribute fields from the `Current Parcels` service and `data dictionary` field values are **hard coded** in the `PropertyDetail.jsx` component, so special care should be applied when customizing both the `Current Parcel` service and the `data dictionary` service. Hard coded fields can be found in: 

- `fetchpropertyDetailData()` - function that creates each element in the dom and injects values from the Current Parcels service or calculated values into the inner html. Hard coded fields include:
    - **BCLASS** - used to check if a property is a residential condo or single family/multifamily class. Depending on the class a hyperlink is created to display links to open data defined by the "res_condo_chars_link" and "hist_sf_mf_imp_chars_link" field values in the `data dictionary` service
    - **tax_school_unified_dist_name** - hides tax_school_unified_dist_name field from the `data dictionary` service if Parcel Current attribute value is null
    - **tax_school_elem_dist_name** - hides tax_school_elem_dist_name field from the `data dictionary` service if Parcel Current attribute value is null
    - **tax_school_sec_dist_name** - hides tax_school_sec_dist_name field from the `data dictionary` service if Parcel Current attribute value is null
    -**View District Details** - field value from the `data dictionary` service to trigger a button to be created in the Property Detail panel that acts as a bookmark to jump to the District Info section at the bottom of the Property Detail panel
    -**comparable_properties** - field value from the `data dictionary` service to trigger the `propertyComparison` function to create a button to open the Property Comparison panel
    -**nearby_properties** - field value from the `data dictionary` service to trigger the `nearbyProperties` function to create a button to open the Nearby Properties panel
    -**incorp_unincorp_state** - field value from the `data dictionary` service to trigger the `incorp_unincorp` function to perfrom a spatial calculation and diplay the incorporated municipality value or unincorporated value displayed under the Municipality label in the Property Detail panel
    -**zoning_info** - field value from the `data dictionary` service to trigger the `zoningInfo` function to return the zoning info message under the Zoning Information label in the Property Detail panel
    -**Any fields that end with "_link"**- On line 361 in the PropertyDetail.jsx component, any field value from the `data dictionary` service that ends with '_link' will trigger the `returnHyperlink` function to parse data from the `hyperlink_text`,  `hyperlink_params` and `hyperlink_url` fields to create a clickable link out to webpage in a new tab 
    -**credit** - values in the credit field from the `data dictionary` are included below property detail data if values are not null 


