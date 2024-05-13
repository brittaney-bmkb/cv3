### Functions Documentation

#### `isTargetLayer(layerUrl)`
- **Description**: Checks if the provided layer URL matches the target layer URL defined in the configuration.
- **Parameters**:
  - `layerUrl`: URL of the layer to be checked.
- **Returns**: Boolean value indicating whether the provided layer URL matches the target layer URL.

#### `handleMultipleResults(results)`
- **Description**: Handles multiple search results, categorizing them into target features and search features.
- **Parameters**:
  - `results`: Array of search results.
- **Returns**: Object containing arrays of target features and search features.

#### `queryTargetLayerByAddress(addresses)`
- **Description**: Queries the target layer with street_address and city_state_zip values.
- **Parameters**:
  - `addresses`: Array of [street_address, city_state_zip] values.
- **Returns**: Array of features matching the street_address & city_state_zip query.


#### `queryTargetLayerWithPointFeatures(pointFeatures, includeBuffer)`
- **Description**: Queries the target layer with point features to retrieve intersecting features.
- **Parameters**:
  - `pointFeatures`: Array of point features or a single point feature to be used in the query.
  - `includeBuffer`: Boolean flag indicating whether to include a buffer around the point features.
- **Returns**: Array of features intersecting with the provided point features.

#### `queryTargetLayerWithCoordinates(coordinates)`
- **Description**: Queries the target layer with coordinates to retrieve intersecting features.
- **Parameters**:
  - `coordinates`: String containing the coordinates in the format "x,y".
- **Returns**: Array of features intersecting with the provided coordinates.

#### `compareProperities(whereQuery, searchDistance, feature, queryFields)`
- **Description**: Compares properties of features based on a given query, search distance, and feature attributes.
- **Parameters**:
  - `whereQuery`: SQL-like query string to filter features.
  - `searchDistance`: Search distance in miles.
  - `feature`: Feature to be used as a reference for the query.
  - `queryFields`: Array of fields to be returned in the query result.
- **Returns**: Array of features matching the query criteria.

#### `nearbyProperties(searchDistance, units, feature, queryFields)`
- **Description**: Retrieves nearby properties within a specified distance from a given feature.
- **Parameters**:
  - `searchDistance`: Search distance.
  - `units`: Units of the search distance (e.g., "miles").
  - `feature`: Feature to be used as a reference for the search.
  - `queryFields`: Array of fields to be returned in the query result.
- **Returns**: Array of nearby properties excluding the provided feature.