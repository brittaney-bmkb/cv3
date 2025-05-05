
## HelpTabs

### Overview

The `HelpTabs` component is a React-based user interface element that provides a tabbed navigation system for displaying help content. It uses Material-UI components and custom styling to create a responsive and accessible tab interface.

### Components

#### TabPanel

A custom component that renders the content for each tab. It only displays the content when the tab is active.

#### HelpTabs

The main component that sets up the tab structure and manages the tab state.

### Usage

```jsx
import HelpTabs from './path-to-HelpTabs';

function App() {
  return (
    <div>
      <HelpTabs />
    </div>
  );
}
```

### Props

The `HelpTabs` component doesn't accept any props directly, but it utilizes the `HelpContent` component which takes a `display` prop.

### Dependencies

- React
- Material-UI (Box, Tabs, Tab, Typography)
- PropTypes
- Custom context hook (UseAppContext)
- HelpContent component

### Functions

#### `a11yProps(index)`

Generates the necessary props for accessibility features of each tab.

### Hooks

- `useState`: Manages the active tab state.
- `UseAppContext`: Custom hook for accessing translation functions.

### Styling

- Uses Material-UI's `sx` prop for custom styling.
- Tabs are set to `textTransform: "none"` to preserve the original text case.

### Internationalization

The component uses a `translateText` function from a custom context to support multiple languages.

### Accessibility

- Implements proper ARIA attributes for screen readers.
- Uses `role="tabpanel"` and associated ARIA attributes for improved accessibility.

### Structure

1. Overview
2. Navigation
3. Search
4. Property Results
5. Compare Properties
6. Measure
7. Layers
8. Basemaps
9. Print
10. Clear, Export, Feedback

### Notes

- The tabs are scrollable and include mobile scroll buttons for better usability on smaller screens.
- Each tab's content is rendered using the `HelpContent` component, which receives the current tab value as a `display` prop.

This component is designed to be a part of a larger help system, likely for a mapping or property information application. It provides a structured and accessible way to navigate through various help topics.