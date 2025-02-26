**Component Documentation: Search**

### Overview

The `Search` component is a React component designed to integrate and manage a search widget within a mapping application. It utilizes the ArcGIS API for JavaScript `SearchWidget` to provide a powerful and customizable search functionality for users interacting with the map.

### Change Log
## [v3.0.2] - 2025-02-26

### Changed
- the `updateSearchText` function now executes the `initalizeSearchSources` function and passes an updated object of search sources to the sources property of the searchWidget when the language changes in the app. This allows the search source names and placeholder text to be replaced with English or Spanish translations depending on the user language selection.


### Change Log
## [v3.0.0-beta.2] - 2024-04-25

### Changed
- Changed the `searchWidget` `autoSelect` property to false to prevent the first search result from being automatically selected
    - This change was made based on feedback from users, stating that they were unable to perform a partial string search and return all results that included the partial string. With the `autoSelect` property set to true only the first search result was returned instead of all of the search results
- Swapped `selected-result` for the `search-complete` event handler: As a result of the `autoSelect` property being changed, the `selected-result` event no longer returns the search results. To work with the results the `search-complete` event handler was setup to get the results through the event object   
- Leverged the `returnSearchResultFeatures` function that was newly added to `AppContext` to pass the search results and return target features to display in the map and in the search results
    - This was a major update because the the app is now accessing the features that are returned from the search results when the search source is the same as the target layer, rather than performing an additional query on the target layer to return features. See `queryTargetLayer.md` for more information
- **Displaying previous results when back button is clicked in results panel** 
  - a new condition is added to the `primaryResultFeature` use effect hook to watch for changes to the `primaryResultFeature` when `newSearch` is set to true and the `search` search param is populated. This handles updates to the search widget search term and sets the SearchResults
    - Inside the `PanelHeader` component the `primaryResultFeature` is also updated with the `prevSearchFeatures`
    - when the `prevSearchFeatures` is passed to the `setPrimaryResultFeature` function this triggers a change to the `primaryResultFeature` to update the `searchtTerm` in the search widget, the search results, and display to previous results in the map
  - a new condition and function `anyAttributesIncluded` was added to the check if selected features are in the `searchFeatures`, which means that the selected parcel was included in the results list
    - if the selected feature is in the `searchFeatures` then the the condition prevents `searchFeatures` from being set to the `primaryResultFeatures`. 
      - `searchFeatures` then set to the `prevFeatures` argurment in the `setSearchResults` function. 
      - lastly, the `searchTerm` is kept the same so it be referenced when the back button is clicked
    - if the selected feature is not in the `searchFeatures` then the `setSearchResults` is passed the newly selected `primaryResultFeatures` and a new `searchTerm`

    
### Fixes
- None
### Deprecated
- `selected-result` event handler wad deprecated and the `renderSearchResults` function is not longer being used to query target features based on attributes or geometry of the selected result. This has been replaced with the `search-complete` event handler and `returnSearchResultFeatures`

### Breaking Changes
- None

---

### Usage
```jsx
import React from 'react';
import { Search } from './components';

const App = () => {
  return (
    <div>
      <Search />
    </div>
  );
}

export default App;
```

### Props
The `Search` component does not accept any props directly. However, it relies on the context provided by the `AppContext` to access various application states and functions.

### Dependencies
- `@mui/material`: Material-UI components for user interface elements.
- `@arcgis/core/widgets/Search.js`: ArcGIS widget for searching within a map.
- `react-router-dom`: React library for handling routing in the application.

### Functions
#### `updateAppWithSearchResult()`
- **Description**: Updates the application state with the search results and triggers necessary actions.
- **Parameters**: None
- **Returns**: Void

### Hooks
- `useEffect`: Used to trigger side effects such as initializing search sources, updating UI elements, and handling search events.

### Usage
```jsx
import React from 'react';
import { Search } from './components';

const App = () => {
  return (
    <div>
      <Search />
    </div>
  );
}

export default App;
```

### Props
The `Search` component does not accept any props directly. However, it relies on the context provided by the `AppContext` to access various application states and functions.

### Dependencies
- `@mui/material`: Material-UI components for user interface elements.
- `@arcgis/core/widgets/Search.js`: ArcGIS widget for searching within a map.
- `react-router-dom`: React library for handling routing in the application.

### Functions
#### `updateAppWithSearchResult()`
- **Description**: Updates the application state with the search results and triggers necessary actions.
- **Parameters**: None
- **Returns**: Void

### Hooks
- `useEffect`: Used to trigger side effects such as initializing search sources, updating UI elements, and handling search events.

#### Explanation of `useEffect` Hooks
1. **Initialization of Search Sources**:
   - The `initalizeSearchSources()` function is called when the component mounts to initialize search sources.

2. **Handling Changes in Primary Result Feature**:
   - This effect monitors changes in the `primaryResultFeature` and `newSearch` state variables.
   - When `primaryResultFeature` changes and `newSearch` is false, the effect processes the feature to determine the search parameters.
   - It checks if the primary result feature is a single feature or multiple features.
   - Based on the feature attributes, it determines the appropriate search parameter (`pin`, `address`, or `location`) and updates the search parameters accordingly.
   - If no primary result feature is available, it queries URL parameters to set search terms for `location`, `pin`, `address`, or `search`.

3. **Configuring Search Widget**:
   - This effect initializes the search widget when the component mounts or when `searchSources` or `language` change.
   - It configures the search widget with custom settings such as container, sources, and placeholder text.
   - If a new search is requested (`newSearch` is true), it performs searches based on URL parameters (`genericSearch`, `pinSearch`, `addressSearch`, `locationSearch`).
   - It listens for the `search-complete` event to handle search results, update application state, and trigger necessary actions.
   - Additionally, it listens for the `search-clear` event to reset search-related states when the search input is cleared.

### Context
The `Search` component relies on the `AppContext` for accessing application states and functions related to map interactions.

### Example
```jsx
import React from 'react';
import { Search } from './components';

const App = () => {
  return (
    <div>
      <Search />
    </div>
  );
}

export default App;
```

### Notes
- Ensure that the `AppContext` is properly configured to provide necessary states and functions to the `Search` component.
- This component integrates with ArcGIS maps and handles search functionality, utilizing the provided search sources and map view context.
- UI elements are styled using Material-UI components. Adjustments to styling can be made via theme configurations.