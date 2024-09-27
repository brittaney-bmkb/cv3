# Cookviewer Technical Documentation

## Methods for Viewing Property Details
last updated: 2024-09-17

- [Overview](#overview)
- [Approach](#approach)
- [Prerequisites](#prerequisites)
- [Key Features](#key-features)

## Overview
Property details are displayed using the `PropertyDetail.jsx` component. When a user selects a search result from the results, comparables, or nearby properties pane, the `PropertyDetail.jsx` component renders detailed property information by:

- Fetching property related data from the `Parcels Current` service defined in `config.js` and the webmap 
- Fetching a curated list of fields to display from the `data_dictionary` service defined in `config.js`
- Performing spatial queries to calculate values for the Municipality and Zoning Information fields using the `municipality_url` prop defined in `config.js`
- Hiding or displaying property data based on data availability for taxing districts based on specific property fields
- Hiding or displaying open data resources based on property class types
- Applying stylized font colors when comparing properties side by side

## Approach

