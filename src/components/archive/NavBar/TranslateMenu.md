**Component Documentation: TranslateMenu**

### Overview

The `TranslateMenu` component is a React component designed to manage a manage language settings within a mapping application. It utilizes a series of custom functions referenced from AppContent to provide language switching functionality for users interacting with the application.

### Change Log
## [v3.0.2] - 2025-02-26

### Changed
- the `onClick` function that passes the selected language to the setLanguage function now includes functionality to set the [ArcGIS intl module](https://developers.arcgis.com/javascript/latest/api-reference/esri-intl.html#setLocale_). The ArcGIS intl module formats text and numbers based on the locale selected. 
    - `config.language_codes` is referenced inside the function. This was a new object added to the config that contains a dictionary of the apps supported languages and ArcGIS supported locales. 

### Fixes
- The change mentioned above fixes issue [#260 missing translations](https://github.com/CCGOVBOT/app-cookviewer-3/issues/260), that called out missing translated text in the ArcGIS search and other widgets in the app. By setting the locale all ArcGIS widgets and components are properly formatted when the language is switched from English to Spanish.