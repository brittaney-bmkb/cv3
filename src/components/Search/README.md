**Component Documentation: Search**

### Overview

The `Search` component is a React component designed to integrate and manage a search widget within a mapping application. It utilizes the ArcGIS API for JavaScript to provide a powerful and customizable search functionality for users interacting with the map.

### Prerequisites

- **React**: This component is built using React, a JavaScript library for building user interfaces.

### Dependencies

- **@arcgis/core**: This component relies on the ArcGIS API for JavaScript to handle mapping and search functionalities.

### Props

- None

### Component Behavior

1. **Initialization**: The `Search` component initializes the ArcGIS search widget within the specified `searchDiv` element.
2. **Event Handling**: It captures the "select-result" event when a user selects a search result, logging the selected result and updating the `searchResults` variable in the app context.
3. **Preventing Redundant Initialization**: The component ensures that the search widget is initialized only if the `searchDiv` element exists and if the search widget has not been initialized previously.

### Example Usage

```jsx
import React from "react";
import Search from "./Search";

function App() {
    // Main application component
    return (
        <div>
            <h1>Mapping Application</h1>
            <Search />
            {/* Other components and content */}
        </div>
    );
}

export default App;
```

### Notes

- Ensure that the necessary dependencies, including the ArcGIS API for JavaScript, are correctly installed and accessible within the project.
- This component assumes the existence of the `UseAppContext` hook and the `mapView` and `setSearchResults` variables within the app context.
- Customize the `sources` property in the search widget configuration to match the specific data sources required for the application.