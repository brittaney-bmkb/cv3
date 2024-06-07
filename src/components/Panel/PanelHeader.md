## PanelHeader Documentation

### Overview
The `PanelHeader` component is a versatile header component designed to provide common functionality for various panels within a React application. It includes features such as displaying panel titles, managing actions like clearing results and exporting data, providing feedback options, and handling navigation.

### Change Log
## [v3.0.0-beta.2] - 2024-04-30

### Changed
### Fixes
- None
### Deprecated
### Breaking Changes

### Usage
```jsx
import React from 'react';
import { PanelHeader } from './components';

const App = () => {
  return (
    <div>
      <PanelHeader />
    </div>
  );
}

export default App;
```

### Props
The `PanelHeader` component accepts the following props:

- `text`: Title text to be displayed in the header.
- `descriptionText`: Description text to provide additional information.
- `results`: Number of results to be displayed (optional).
- `exportButton`: Boolean indicating whether the export button should be displayed.
- `clearButton`: Boolean indicating whether the clear button should be displayed.
- `feedbackButton`: Boolean indicating whether the feedback button should be displayed.
- `backButton`: Boolean indicating whether the back button should be displayed.
- `backButtonComponent`: Component to navigate back to when the back button is clicked.
- `closeButton`: Boolean indicating whether the close button should be displayed.
- `panel`: Name of the panel.
- `primary`: Boolean indicating whether the panel is primary.
- `divider`: Boolean indicating whether a divider should be displayed below the header.

### Dependencies
- `@mui/icons-material`: Material-UI icons for UI elements.
- `@mui/material`: Material-UI components for user interface elements.
- `react-router-dom`: React router for navigation.
- `../Button/Button`: Custom button component.
- `../ExportDialog/ExportDialog`: Dialog component for exporting data.
- `../FeedBack/Feedback`: Feedback dialog component.

### Functions
#### `handleClearResults(primary)`
- **Description**: Clears the search results.
- **Parameters**:
  - `primary`: Boolean indicating whether the primary search results should be cleared.
- **Returns**: Void

#### `handleExport()`
- **Description**: Opens the export dialog.
- **Parameters**: None
- **Returns**: Void

#### `handleCloseExport()`
- **Description**: Closes the export dialog.
- **Parameters**: None
- **Returns**: Void

#### `handleFeedback()`
- **Description**: Opens the feedback dialog.
- **Parameters**: None
- **Returns**: Void

#### `handleCloseFeedback()`
- **Description**: Closes the feedback dialog.
- **Parameters**: None
- **Returns**: Void

#### `handleBack()`
- **Description**: Handles navigation back to the previous component.
- **Parameters**: None
- **Returns**: Void

#### `handleClosePanel(panel)`
- **Description**: Closes the current panel.
- **Parameters**:
  - `panel`: Name of the panel to be closed.
- **Returns**: Void

### Hooks
- `useEffect`: Used to trigger side effects such as updating the action row visibility.

### Context
The `PanelHeader` component relies on the `AppContext` for accessing various application states and functions.

### Example
```jsx
import React from 'react';
import { PanelHeader } from './components';

const App = () => {
  return (
    <div>
      <PanelHeader />
    </div>
  );
}

export default App;
```

### Notes
- Ensure that the `AppContext` is properly configured to provide necessary states and functions.
- Adjustments to the appearance and behavior of the header can be made through props and CSS styling.
q