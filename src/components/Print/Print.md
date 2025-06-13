# Print Component
The Print component provides map and report printing capabilities for CookViewer. It allows users to print the current map view, generate detailed property reports, and manage print jobs, within the Print panel.

## Features
- **Print Map**: Print the current map view, including selected parcels, aerial imagery, and visible layers.
- **Generate Reports**: Create detailed property summary reports with assessor info, tax details, building data, and district assignments.
- **Include Search or Comparable Results**: Optionally include all search results or comparable parcels in reports.
- **Custom Print Area**: Adjust a print area on the map.
- **Language Support**: Dynamically loads print templates, report files, and data sources based on the selected language.
- **Job Management**: View, download, and open completed print jobs directly from the panel.
- **Help Integration**: Quick access to help resources via a header action.

## Usage
Import and use the component in your application:

### Props & Context
This component relies on the following context values from UseAppContext:

- **printPanelClosed, setPrintPanel**
- **translateText**
- **arcgisMapRef**
- **mapView**
- **primaryResultFeature**
- **searchFeatures**
- **language**
- **comparableParcels**
### Key Dependencies
- @esri/calcite-components-react
- @arcgis/core
- Custom components: 
    - PrintAreaBox
    - CustomMaskLayer
    - Inactive
- App-specific config: config from ../../data/config
## Main Functional Areas
- **Print Templates**: Loads available print layouts and formats from ArcGIS Portal based on language.
- **Print Area**: Allows users to toggle and adjust the print area on the map.
- **Report Options**: Toggle inclusion of all search results or comparable parcels.
- **Print Execution**: Handles print requests, manages print jobs, and provides download links.
- **Legend and Layer Filtering**: Dynamically updates operational layers and legend entries for print output.
- **Help**: Header action opens help documentation in a new tab.
## Example Workflow
1) Open the Print panel.
2) Select "Map" or "Report" tab.
3) Choose layout, format, and options (e.g., include comparables).
4) Click "Print" to submit a print job.
5) View and download completed jobs from the "Prints" tab.
## Customization
- Update the config object to point to your ArcGIS Portal, print service, and report templates.
- Extend or modify the PrintAreaBox and CustomMaskLayer components for custom print area behavior.
## Notes
- The component uses async/await for loading templates and executing print jobs.
- Print jobs are tracked in local state and displayed in a list for user access.
- The component is designed to work within an application using the ArcGIS JavaScript API and Calcite Components.
## Troubleshooting Tips

- **No Print Output or Blank Pages**:  
  Ensure the map and all required layers are visible and loaded before starting a print job. Check that the print service URL in your config is correct and accessible.

- **Print Job Fails or Hangs**:  
  Verify network connectivity and that the ArcGIS print service is running. Review browser console logs for error messages and check for CORS issues.

- **Missing or Incorrect Layers in Output**:  
  Confirm that operational layers are correctly included and not filtered out by the component logic. Make sure layer IDs and URLs in your config match those in your map.

- **Language or Template Issues**:  
  If templates or report layouts do not match the selected language, check your config for correct language keys and template URLs.

- **Slow Performance**:  
  Large maps or many layers can slow down print jobs. Try reducing the number of visible layers or the print area size.

- **UI Not Responding**:  
  Refresh the browser and clear cache if the print panel becomes unresponsive. Ensure all dependencies are up to date.

- **Help Link Not Working**:  
  Make sure the help URL in the config is correct and accessible from the client environment.

## Could Be Better

- **Code Organization**: The component could be refactored into smaller, more focused subcomponents to improve readability and maintainability.
- **Error Handling**: Add more robust error handling for print job failures, network issues, and invalid configurations to provide better user feedback.
- **Accessibility**: Enhance accessibility by ensuring all interactive elements are keyboard-navigable and screen-reader friendly.
- **Performance**: Optimize state management and reduce unnecessary re-renders, especially when handling large print jobs or many map layers.
- **Testing**: Increase unit and integration test coverage for all major features and edge cases.
- **User Feedback**: Provide clearer progress indicators and status messages during long-running print operations.
- **Customization**: Allow more flexible customization of print templates, layouts, and report sections through props or configuration.