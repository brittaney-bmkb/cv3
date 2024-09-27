### Property Detail Component Documentation

The `propertyDetail` component displays detailed information about properties, allowing users to compare two properties by displaying property1 and property2. This component fetches property-related data, processes it, and presents it in a structured format using various UI elements from the Material UI library.

#### Dependencies

- **Material UI Components:**
  - `Box`, `Button`, `CircularProgress`, `Divider`, `Typography`, `useMediaQuery`
  
- **Custom Components:**
  - `StyledButtonFilledPrimary`: Custom styled button imported from the Button folder.
  
- **Custom Hooks and Utilities:**
  - `UseAppContext`: Custom hook for accessing global state and utility functions from `AppContext`.
  - `returnMunicipality`: Function used to retrieve the municipality data for the property.
  
#### Props

The `propertyDetail` component expects the following props:

- **property1**: First property to display details for.
- **property2**: (Optional) Second property for comparison.
- **propertyColor1**: Color theme for property1 details.
- **propertyColor2**: Color theme for property2 details.

#### Key Features

1. **Property Comparison**:
   - If two properties are provided, the component compares them, highlighting differences such as zoning, district info, and property characteristics.
  
2. **Dynamic Content Loading**:
   - Uses hooks (`useState`, `useEffect`) to fetch and update property details dynamically, such as municipalities and zoning information.
   - Property details are sorted and presented according to categories fetched from the global `dataDictionary`.
  
3. **Responsive Design**:
   - Adapts its layout based on the screen size using `screenWidth` and Material UI breakpoints.

4. **Clickable Elements**:
   - Provides interactive buttons for fetching comparable properties or nearby parcels.
   - Hyperlinks to external resources are dynamically generated based on the property’s attributes.

5. **Data Filtering and Exclusions**:
   - Filters out irrelevant or unavailable property fields, such as certain school districts or property classes.
   - Adjusts the presentation based on the property class, making it suitable for various property types (e.g., residential, condos).

#### Functions

1. **`prefix(key)`**:
   - Adds a prefix like `$` for monetary values or leaves it blank for other types.

2. **`addCommaSeparator(value, type)`**:
   - Formats numbers with commas for readability if the value is of type money or number.

3. **`fetchpropertyDetailData(category, index)`**:
   - Fetches and processes the property data for the given category and organizes it for display.
   - Sorts and excludes data based on property characteristics and available information.
   
4. **`incorp_unincorp(property)`**:
   - Determines if the property belongs to an incorporated or unincorporated area and displays it accordingly.

5. **`zoningInfo(property, data)`**:
   - Displays the zoning information for the property. If the property is incorporated, it will provide a municipality message. If unincorporated, it links to the Cook County Zone Lookup.

6. **`returnHyperlink(text, params, url, field, attributes)`**:
   - Generates a clickable hyperlink based on the field parameters and attributes passed.

#### Usage

To use the `propertyDetail` component:

```jsx
import PropertyDetail from './components/PropertyDetail';

// Pass in the necessary properties
<PropertyDetail 
  property1={firstPropertyData}
  property2={secondPropertyData}
  propertyColor1="#FF5733" 
  propertyColor2="#3498DB"
/>
```

#### States and Variables

- **`categories`**: Holds the list of data categories fetched from `dataDictionary`, used to organize property details.
- **`muni`**: Stores the municipality information for each property.
- **`zoningMessage`**: Contains the zoning message for each property based on whether it is incorporated or not.
- **`properties`**: Stores the properties to be displayed (single or multiple).
- **`textAlignment`**: Determines text alignment based on screen width (centered for small screens, left-aligned otherwise).

#### Dynamic Behavior

1. **Responsive Text Alignment**: The text alignment changes based on screen size.
2. **Dynamic Zoning Info**: Depending on whether a property is incorporated, the component shows different zoning messages or links to the county’s zoning lookup page.
3. **Data Loading**: Property details are fetched and displayed dynamically as the component is rendered.

#### Considerations

- Ensure that the `dataDictionary` contains the necessary attributes for the properties being displayed.
- This component is designed to handle comparisons between two properties, but will still function if only one property is passed.
