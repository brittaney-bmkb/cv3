# app-cookviewer-3
Cook Viewer Version 3


Create new app
https://vitejs.dev/guide/

```
npm create vite@latest cookviewer 
cd cookviewer
```


install vite react modules
```
npm install
```

install arcgis js api modules
https://developers.arcgis.com/javascript/latest/es-modules/

```
npm install @arcgis/core
```

install material ui - react framework

```
npm install @mui/material @emotion/react @emotion/styled
```

install cook county font Barlow
```
npm install @fontsource/barlow
```

create app folder directories
components
    functional components using ES6: https://www.w3schools.com/react/react_es6_arrow.asp
    Navigation Top: top navigation bar, will contain logo, search bar, page links, buttons
    Panel: Panel component with ability to orientate left, right, and bottom to hold data and widgets
    WebMapView: Component to reference arcgis js web map
    Button: Component for app buttons, customizable text, icons, onclick functions
arcgis
contexts
data
reducers