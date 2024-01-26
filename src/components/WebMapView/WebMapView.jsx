// import { Box, Paper, Typography } from "@mui/material";

// const WebMapView = () => {
    
//     return(
//         <Box 
//         bgcolor="yellow" 
//         color="black" 
//         flex={10} 
//         display="flex" 
//         flexDirection="column" 
//         height="100%" app-cookviewer-3
//         width="100%"
//         justifyContent="center"
//         alignItems="center"
//         >
//             <Typography variant="h1" color="initial">Map</Typography>
//         </Box>

//     )
// }

// export default WebMapView

{/* <link rel="stylesheet" href="https://js.arcgis.com/4.18/esri/css/main.css"></link> */}


import { useEffect, useRef } from "react";
import UseAppContext from "../../AppContext";

export default function WebMapView(){

    const { loadMap, setMapContainer, mapContainer} = UseAppContext()
    const mapDiv = useRef(null)

    useEffect(() => {
        const createMap = async () => {
            if(mapDiv.current){
                await setMapContainer(mapDiv.current)   // TODO fails here 
                //Uncaught (in promise) TypeError: setMapContainer is not a function
            }
            if(mapContainer){
                await loadMap()
            }
        }

        createMap();

    }, [mapContainer])

    return (
        //todo possibly add the the styles into a separate components 
        <div id="MAPCONTAINER" ref={mapDiv} style={{width: '100%', height: '100%'}} ></div>
            )            
}
