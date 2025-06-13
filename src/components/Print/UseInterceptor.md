# useEsriInterceptor Hook

The `useEsriInterceptor` hook is a custom React hook for managing ArcGIS REST request interceptors in applications using the ArcGIS JS API. It registers a request interceptor when the component mounts or when activated, and automatically removes it when the component unmounts or deactivates. This helps you intercept and modify network requests (e.g., for authentication, logging, or request manipulation) in a React-friendly way.

## Reference

[ArcGIS Core Request Interceptor](https://developers.arcgis.com/javascript/latest/api-reference/esri-config.html#RequestInterceptor)

## Features

- **Automatic Registration and Cleanup**: Adds the interceptor when active, and removes it on cleanup.
- **Unique Identification**: Uses a unique ID to ensure only the intended interceptor is managed.
- **Flexible Activation**: Can be toggled on or off using the `active` parameter.
- **Supports All Interceptor Options**: Pass any valid ArcGIS interceptor object (with `urls`, `before`, `after`, etc.).

## Usage

Import and use the hook in your component:

```jsx
import useEsriInterceptor from './UseInterceptor';

useEsriInterceptor(
  "my-unique-id",
  {
    urls: "https://my.arcgis.com/arcgis/rest/services/Print*",
    before: (params) => { /* modify request */ },
    after: (response) => { /* handle response */ }
  },
  true // active
);
```
## Parameters
- id: (string) Unique identifier for this interceptor instance.
- interceptor: (object) The interceptor object, supporting all ArcGIS request interceptor options.
- active: (boolean, optional) Whether the interceptor should be active. Defaults to true.
## Key Details
- The hook ensures that only one interceptor with a given ID is active at a time.
- Interceptors are tagged with a _customId property for easy management.
- Cleanup is handled automatically when the component unmounts or when active becomes false.
## Could Be Better
- Multiple Interceptors: Support for registering multiple interceptors at once.
- Error Handling: Improved error handling for invalid interceptor objects.
- Testing: Add more tests for edge cases and concurrent interceptor usage.

## Troubleshooting Tips
- Interceptor Not Triggering: Ensure the urls pattern matches the requests you want to intercept.
- Multiple Interceptors Not Working: Each interceptor must have a unique id.
- Not Cleaning Up: Make sure the hook is used inside a React component and not in plain JS code.
