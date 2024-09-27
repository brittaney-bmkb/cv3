# Cookviewer Technical Documentation

## Methods for Viewing Property Details
last updated: 2024-09-17

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Customization](#customization)
- [Approach](#approach)
- [Key Features](#key-features)

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

The Property Detail panel can be customized by modifying the records in the data dictionary service. In order for property data to be displayed the following fields must be populated: 
- **field**: The attribute field from the Current Parcel service. The attribute value from the this field will be displayed directly in Property Detail panel or used in a calculation to generate a new value
- **label**: The text that will be displayed in the Property Detail panel above the Current field value
- **category**: Groups the field and label values into categories. The text in this column will be displayed at the top of each section in the Property Detail panel. If a category value is equal to "top" then all the fields and labels will be displayed at the very top of the panel and remain static. 
- **category_order**: Controls the order of fields displayed in each category. 
- **type**: controls how the field values from the Current Parcel service are formatted. Types can include:  
    - text: Will display values without any formatting to the field attribute value from Parcels Current
    - calc: Field attribute value will be used in a calculation to create a new value on the fly in the app
    - int or double: Will format fields as number with comma separator 
    - money: Will format fields with $ sign and comma separator
- **details_category_order**: Controls the order of category sections

Optional fields:
- **hyperlink_text**: hyperlink label that will displayed instead of the field value
- **hyperlink_params**: attribute fields from the Current Parcel service that will be used in the hyperlink_url as additional parameters
- **hyperlink_url**: full hyperlink that will open in a new window. Values included in curly braces ({}) will be replaced with actual attribute values from the hyperlink_params field

## Customization

