# CookViewer-3 (Current version CookViewer-Beta)

Welcome to the repository for our CookViewer application. This README provides essential information about the application, how to set it up, and how to use it effectively.

---

# Title

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [NPM Modules](#npm-modules)
- [Usage](#usage)
- [Customization](#customization)
    - [Services](#services)
- [TODOS](#todos)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

**Introduction**
CookViewer-3 is the third version of the Cook County GIS parcel viewer application. This application is built using React, Material UI, ArcGIS JS API version 4.28 (October 2023)

## Getting Started

Follow these steps to get a copy of the project up and running on your local machine for development and testing purposes.

---
### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
    - Version: 20.7.0 

- **npm or Yarn**: You will need either npm or Yarn as your package manager. You can download npm with Node.js, or you can install Yarn following the instructions at [yarnpkg.com](https://yarnpkg.com/getting-started/install).

### NPM Modules
NPM modules used in this applicationa are listed below. Each module will be installed when npm install is run in the command line. You do not need to install each module individually. The content below includes a description and links to documentation for each module. 

#### [ArcGIS JS API](https://developers.arcgis.com/javascript/latest/es-modules/)
API to utilize ArcGIS Maps SDK

```
npm install @arcgis/core
```

#### [ArcGIS Calcite-Components](https://developers.arcgis.com/javascript/latest/es-modules/)
React component library that implements the [Calcite Design System](https://developers.arcgis.com/calcite-design-system/)

```
npm install npm install @esri/calcite-components-react
```

#### [Material UI](https://mui.com/material-ui/)
Open source React component library that implements [Googles Material Design System](https://m2.material.io/). 

```
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
```

Install cook county font Barlow
```
npm install @fontsource/barlow
```

#### [React Router Dom](https://reactrouter.com/en/main)
React router dom handles url parameters and routing to components while acting as a single page application (SPA)
```
npm install react-router-dom
```
---
### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone git@github.com:CCGOVBOT/app-cookviewer-3.git

2. Change to the projects directory:
    ```bash
    cd app-cookviewer-3
3. Install project dependencies using npm or Yarn:
    ```bash
    npm install
    # or 
    yarn install
    ```
4. Start the development server
    ```bash
    npm run dev
    # or 
    yarn dev
    ```
5. Application should now be running locally. Open your web browser and visit http://localhost:5173/ to access it.

## Usage

[Explain how to use the application, including any user roles, access permissions, or specific functionalities. Provide examples, screenshots, or GIFs if helpful.]

## Customization

You can customize the application to meet your specific needs by modifying the code and configuration files. The main configuration files can be found in the src directory.

Key application features can be customized using the config.json file found in the src directory. The config.json file exposes core application features such as titles, descriptive text, webmap and feature services, and application style settings.

**example project file structure**
project-root/
├── src/
│ ├── components/
├── README.md
├── package.json
└── .gitignore

### Cookviewer 3 Services and Webmaps
In addition to the direct application customization that can be accompolished by updating the config.json file, the application webmap and support services can be customized in ArcGIS Online and ArcGIS Pro. 

#### Services: 
**CookViewer3Parcels** - Referenced Map Service that contains parcel data and parcel geometries displayed in the webmap. This service is included in the `config.json` file for 2 config props: 
- `target_layer_url` - Parcel feature layer url is used to identify the Current Parcel layer in the AGO webmap to allow the user to click and select parcels within the webmap
- `layer_sources url` - Parcel feature layer is used as search layer source for the `Search.jsx` component
Service URLS:
- **PROD**: https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer
- **TEST**: 

**Data Dictionary** - Hosted table that controls the data display in the PropertyDetails.jsx component and Property Detail Panel in the application. This table includes fields that are referenced from the CookViewer3Parcels service and injects the field values into the the application. The data value, display label, data category, display order, and hyperlinked text are all controlled by this table. The data dictionary service url is an input to the `data_dictionary` prop in `config.json`
- **PROD**: https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_data_dictionary_view/FeatureServer/0 : AGO ID: d2dd12d8fc874948830636b2ba4b0f72
- **TEST**: https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/arcgis/rest/services/cookviewer_data_dictionary_test_data/FeatureServer/0 | AGO ID: d2dd12d8fc874948830636b2ba4b0f72

**Translated Text** - Hosted service that controls the translation of application text. This hosted table includes two tables: 
- Cookviewer translated text general - controls 90% of translation in the app excluding text in the help dialog
- Cookviewer translated text help - controls translations for all text in the help dialog
Service URLS:
-**PROD & TEST**: https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer | AGO ID: c428e191a8114a4aa41b4fb12b16c998

**Locator Search Sources** - Cookviewer powers the `Search.jsx` component with the CookViewer3Parcels as a layer search source and two locator services as locator search sources
- Parcel Address Locator: https://gis.cookcountyil.gov/traditional/rest/services/Locator/parcelAddresses/GeocodeServer
- Cook Address Multirole Locator: https://gis.cookcountyil.gov/traditional/rest/services/Locator/CookAddressMultirole/GeocodeServer

**Web Map** - Cookviewer consumes a webmap hosted in ArcGIS online that allows the user to view/interact with parcels and cookviewer dynamic data layers
- **PROD**: https://cookcountyil.maps.arcgis.com/apps/mapviewer/index.html?webmap=779a9643c58f4a48a002a9b277a8bcc7 | AGO ID: 779a9643c58f4a48a002a9b277a8bcc7
- **TEST**: https://cookcountyil.maps.arcgis.com/apps/mapviewer/index.html?webmap=15c4eb52c7bb468d93c5946cb8e9d6ce | AGO ID: 15c4eb52c7bb468d93c5946cb8e9d6ce
  
**ArcGIS Pro Project** - References webmap, data dictionary, and translated text services listed above to view/edit in one place.
**PROD & TEST**: \\gisfsp2\gisanalysts\portalServices\service_maps\Application_Services\cookviewer3  

## TODOS
[Insert details on parts of the project that are still in progress/development. These could be future enhancements, plans to migrate to newer versions of a code base, future deprecation of a code base etc.]

## Deployment
To deploy your custom application, follow these steps:

1. **Compile and Build Your Application**: First, compile and build your application using the following command:

   ```shell
   npm run build
   ```
   After running this command, a new directory called build or dist (if using vite.js) should be created in your project's root directory. This build directory contains the compiled and optimized files ready for deployment.

2. **Push Your Application to GitHub**: Commit and push your application code to your GitHub repository.

3. **Create a Deployment YAML File**: Next, create a `.yml` deployment file in your repository. This file will be used to execute a GitHub self-hosted runner. Here's an example of a basic `.yml` deployment file:

   ```yaml
   Copy paste deployment file here
   ```

   Make sure to replace `/path/to/directory` with the actual path in your repository where your build directory exists. 

4. **GitHub Actions Workflow**: GitHub Actions will automatically execute the deployment workflow defined in your `.yml` file whenever you push changes to the `working` branch of your repository.

This workflow will build your application, copy the files to the specified server path, and deploy it. Make sure to customize the deployment YAML file and server configurations according to your specific needs.

That's it! Your custom application should now be deployed using GitHub Runners.

## Contributing

[Encourage contributions to the project, outline the guidelines for contributing, and provide information on how to submit pull requests or report issues.]

## License

[Specify the license under which this application is distributed. For example, you can use a standard open-source license like the MIT License.]

## Contact

[Provide contact information for questions, feedback, or support related to this application.]
