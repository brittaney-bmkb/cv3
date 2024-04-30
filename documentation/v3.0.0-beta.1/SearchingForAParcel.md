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
-	When the primaryResultFeature property is updated based on the user’s parcel(s) selection, the useEffect hook sets the url parameter and the search term depending on the parcel features that are returned from the selection:
  - If the features returned only include 1 parcel then the “pin” parameter is set to PIN14
  - If the features returned include more than one parcel AND the pin10s of all the parcels match then the “pin” parameter is set to PIN10
  - If the features returned include more than one parcel AND the pin10s do not match BUT the parcel addresses DO match then the “address” parameter is set to the parcel street_address
  - If the features returned include more than one parcel AND the pin10s AND the street addresses DO NOT match then the “location” parameter is set to the lat/long of the mouse click/tap (will generate lat/long in upcoming issue)
- If the search term in the search bar is not referencing the selected parcel then the search term will be updated to show the PIN or Address
