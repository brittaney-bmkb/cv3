# Cookviewer Technical Documentation

## Selecting a Parcel from the Map

### Action
User clicks within the map to select a parcel.

### Process

#### Step 1: WebMapView.jsx Component OnClick Prop Execution
- The `onclick` prop in the `WebMapView.jsx` component triggers the execution of the `mapClickEventHandler()` function.

#### Step 2: mapClickEventHandler() Function Execution from AppContext.jsx
- The `mapClickEventHandler()` function is executed from `AppContext.jsx`.

#### Step 3: mapClickEventHandler() Function Details
- The `mapClickEventHandler()` function does the following:
  - Imports the `onViewClick` function from '../arcgis/webmap/webmap'.
  - Checks if the `measureState` to prevent parcel selections during a measure session.
  - Pulls the `parcelQueryFields` array from the state to pass to the `onViewClick` function, querying parcel features based on the map point location generated from the user's click or tap.
  - Checks if the selected parcel features are the same as comparable parcels to prevent a new primary parcel from being selected from the comparable parcel list.
  - Sets the `PrimaryResultFeature` value to the returned parcel features from the `onViewClick` function and sets the `newSearch` value to false to prevent the search widget from triggering a new search once the URL parameter is updated.
  - Sets the search features to the selected parcels.
  - Creates graphics using the selected parcels and sets the graphic color to primary.

#### Step 4: Dependency on Search.jsx
- The `primaryResultFeature` property is included in the dependency array of the `Search.jsx` `useEffect` hook (line 39).

#### Step 5: URL Parameter Update in Search.jsx
- When the `primaryResultFeature` property is updated based on the user's parcel selection, the `useEffect` hook in `Search.jsx` checks if the length of the parcel features is equal to 1, indicating that the parcel does not have multiple units.
- Updates the URL parameter "location" to the parcel 14-digit PIN.
- If there are multiple units, the "location" parameter is set to the parcel 10-digit PIN.

#### Step 6: UseSearchParams and RouteParams
- The URL parameters are accessed using the `useSearchParams` hook and the `routeParams` property.

#### Step 7: Dependency on RouteParams in Search.jsx
- The `routeParams` is included in the dependency array of the second `useEffect` hook in `Search.jsx`.

#### Step 8: Update of Search Term in Search.jsx
- When the "location" parameter is updated, the `useEffect` in `Search.jsx` checks if "location" is populated.
- If `newSearch` is false (indicating that the parcel was selected by clicking in the map and not using the search bar), then the search bar search term or value is compared to the `primaryResultFeature` `pin10` for properties without multiple units or the `pin14` for properties with multiple units.
- If the search term does not match the value, then the search term is updated with `pin10` or `pin14`.