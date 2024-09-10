
# Cookviewer Technical Documentation
## Web Map Configuration
## Table of Contents

- [Introduction](#introduction)
- [Configuration Details](#configuration-details)

## Introduction
This document will describe how the web map that is being used in CookViewer is being configured. 

## Configuration Details

* Webmap:
  * Item URL: https://cookcountyil.maps.arcgis.com/home/item.html?id=2d8ad931484c4f6dad75e1842470e19a
  * Item ID: 2d8ad931484c4f6dad75e1842470e19a 
  
* Feature Service Item URLs:
  * cookVwrDynmc_beta_noParcels: https://gis.cookcountyil.gov/traditional/rest/services/cookVwrDynmc_beta_noParcels/MapServer
    * By default, the groups of layers within this service are visible but, the layers within each group are not visible.
      * Natural Environment and Recreation
      * Parcel Archive
      * Places of Interest
      * Political Boundaries
      * Tax Districts
      * Transportation
      * Zoning
  * Forest Preserve District of Cook County Boundary: https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/Forest_Preserve_Boundary/FeatureServer
    * This service is included in the map as part of the grouped Natural Environment and Recreation layer. Only the boundary layer is in the group, and is not visible by default. 
  * Parcels: https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0
    * This service is added as a group layer that only includes the Parcels Current layer. The group Parcels is visible by default as is the Parcels Current layer. The Parcels Current layer has a peak visiblity range of 1:10,000.
* Basemap
  * State Plane Street and Municipal Basemap - Light Grey: https://gis.cookcountyil.gov/hosting/rest/services/Hosted/cookBaseVectorGreyStatePlane/VectorTileServer

## 





