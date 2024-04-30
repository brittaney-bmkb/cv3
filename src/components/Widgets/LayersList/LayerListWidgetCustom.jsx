import { Box, Checkbox, Chip, Collapse, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import LayerListVM from "@arcgis/core/widgets/LayerList/LayerListViewModel.js";
import { map, view } from "../../../arcgis/webmap/webmap";
import { config } from "../../../data/config";
import UseAppContext from "../../../contexts/AppContext";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import { theme } from "../../../theme";
import { CalciteLoader } from "@esri/calcite-components-react";
import { createFeatureLayers } from "../../../arcgis/layers/layers";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

// Function to extract numeric part from a string
function extractNumericPart(str) {
    const matches = str.match(/\d+/g);
    return matches ? parseInt(matches.join(''), 10) : NaN;
  }

const LayerListWidgetCustom = () => {

    const layerListWidget = useRef(null)
    const [layerSources, setLayerSources] = useState(config.layer_sources);
    const [groupOpen, setGroupOpen] = useState(null);
    const [layerGroups, setLayerGroups] = useState(null);
    const { mapView, translateText } = UseAppContext()
    
    const handleClick = (layerName) => {

        layerListWidget.current?.operationalItems?.items.filter(item => item.layer.title === layerName)
                                                       .map(item => {
                                                        item.layer.visible = !item.layer.visible 
                                                        item.layer.allSublayers?.map(subLayer =>  subLayer.visible = !subLayer.visible)
                                                        })
                                                    

        const updatedLayerSources = layerSources.map(layer => ({
            ...layer,
            visible: layerListWidget.current.operationalItems.items.filter(item => item.layer.title === layer.layerName)
                                                                    .map(item =>  item.visible)[0],
                                                                    
        }));

        setLayerSources(updatedLayerSources);
    
        }


    const getLayerGroups = (operationalItems) => {

        let groups = []
        let layers = {}

        if (operationalItems) {
            operationalItems.items.flatMap((item) => {
                if (item.layer.type === "map-image" && item.children?.length > 0) {
                    console.log("items: ", item);
                    item.children.map((child) => {
                        console.log("children: ", child);
                        if(!groups.includes(child.title)){
                            groups = [...groups, child.title];
                        }
                        layers[child.title] = child.children.items
                        
                    });
                }
                else if(item.layer.type === "group" && item.children?.length > 0){
                    if(!groups.includes(item.layer.title)){
                        groups = [...groups, item.layer.title];
                        
                    }
                    layers[item.layer.title] = [...layers[item.layer.title], item.children.items.flatMap(item => item)]
                }   
                // If the condition is not met, return an empty array to flatten properly
                return [];
            });
        
            console.log("children groups: ", groups);
            console.log("children layers: ", layers);
        }

        return groups
    }

    const layers = (operationalItems) => {
        groups.map((group) => {
            
        })
    }

    useEffect(() => {
        const createLayerListViewModel = async () => {

            //await createFeatureLayers(map, true)
            
            if(!layerListWidget.current){
                layerListWidget.current = new LayerListVM({
                    view:mapView,
            })

            //await layerListWidget.current.when()

            console.log("New layer list view model: ", layerListWidget.current)
            if(layerListWidget.current){
                
                let operationalItems = layerListWidget.current.operationalItems

                console.log("getting opertional items: ", operationalItems)

                let groups = getLayerGroups(operationalItems)
                setLayerGroups(groups)

                let layers
            }
            

                // const updatedLayerSources = layerSources.map(layer => ({
                //     ...layer,
                //     visibleScale: layerListWidget.current.operationalItems.items
                //     .filter(item => item.title === layer.layerName)
                //     .map(item => item.visibleAtCurrentScale)[0],
                //     visible:layerListWidget.current.operationalItems.items
                //     .filter(item => item.title === layer.layerName)
                //     .map(item => item.visible)[0]
                // }));

                // setLayerSources(updatedLayerSources);

                // console.log("Selected Items: ", layerListWidget.current.selectedItems)

                // //layerListWidget.current.selectedItems.items = [layerListWidget.current.operationalItems.items[4]]

            }
        }
        
        createLayerListViewModel()
    }, [layerListWidget])

    // useEffect(() => {
    //     reactiveUtils.watch(
    //         () => view.scale,
    //         () => {

    //             //console.log("Visible at scale ",layerListWidget.current.operationalItems.items[7].title, layerListWidget.current.operationalItems.items[7])

    //             // Update layer sources with visibility
    //             const updatedLayerSources = layerSources.map(layer => ({
    //                 ...layer,
    //                 visibleScale: layerListWidget.current.operationalItems.items.filter(item => item.layer.title === layer.layerName)
    //                                                                         .map(item =>  item.visibleAtCurrentScale)[0],
    //                 visible:layerListWidget.current.operationalItems.items
    //                 .filter(item => item.title === layer.layerName)
    //                 .map(item => item.visible)[0]
                                                                            
    //             }));
    //             setLayerSources(updatedLayerSources);
    //         }
    //     );
    // }, []);

    // useEffect(() => {

    //     const createLayerGroups = () => {
    //         const layerGroups = config.layer_sources.sort((a, b) => a.groupName > b.groupName ? 1:-1)
    //         .map((layer) => {
    //             return layer.groupName
    //         })

    //         setLayerGroups(layerGroups)

    //         let obj = {}
    //         layerGroups.map((group) => {
    //             obj[group] = false
    //         })

    //         setGroupOpen(obj)
    //     }

    //     createLayerGroups()

    // }, [])

    
    // const handleGroupClick = (group) => {

    //     setGroupOpen(prev => ({
    //         ...prev,
    //         [group]: !prev[group]
    //     }));

    // }
    

    // const layerGroupList = [...new Set(layerGroups)].map((group) => (
    //     <Box key={group} pt={2}>
    //         <ListItemButton
    //         onClick={() => {handleGroupClick(group)}}
    //         sx={{justifyContent:"space-between"}}>
    //         <Typography key={group} variant="body2">{translateText(group)}</Typography>
    //         { groupOpen[group] ? <ExpandLess/> : <ExpandMore/>}
    //         </ListItemButton>
    //             <Collapse in={groupOpen[group]}>
                
    //             {
    //                 layerSources.filter((layer) => layer.groupName === group)
    //                                     .sort((a, b) => {
                                            
    //                                         // Extract numeric parts of layer names
    //                                         const numericA = extractNumericPart(a.layerName);
    //                                         const numericB = extractNumericPart(b.layerName);
                                    
    //                                         // If both names have numeric parts, compare them
    //                                         if (!isNaN(numericA) && !isNaN(numericB)) {
    //                                             return numericB - numericA; // Sort in descending order based on numeric part
    //                                         }
                                    
    //                                         // If one of the names has numeric part, prioritize it
    //                                         if (!isNaN(numericA)) {
    //                                             return -1; // `a` has numeric part, so it should come before `b`
    //                                         }
    //                                         if (!isNaN(numericB)) {
    //                                             return 1; // `b` has numeric part, so it should come before `a`
    //                                         }
                                    
    //                                         // If none of the names have numeric parts, compare them as strings
    //                                         return a.layerName.localeCompare(b.layerName);
    //                                     })
    //                                     .map((layer) => {

    //                                         // let visible = checkVisibility(layer.layerName)
    //                                         // console.log("layer is visible? ", visible)

    //                                         return(
    //                                         <ListItem
    //                                         dense
    //                                         key={layer.layerName}
    //                                         divider
    //                                         sx={{width: "100%"}}
    //                                         >
    //                                             <ListItemButton
    //                                                 disabled={layer.visibleScale === true ? false : true}
    //                                                 onClick={() => handleClick(layer.layerName)}
    //                                                 sx={{justifyContent:"space-between"}}
    //                                             >
    //                                             <ListItemText  sx={{display:"flex", flex:4}}>
    //                                                 <Typography variant="body2">
    //                                                     {translateText(layer.layerName)}
    //                                                 </Typography>
                                                    
    //                                                 </ListItemText>
    //                                             <Checkbox
    //                                                 color="primary"
    //                                                 checked={layer.visible}
    //                                             />
    //                                             </ListItemButton>
                                            
    //                                         </ListItem>
    //                                         )
    //                                     })
    //             }
    //          </Collapse>
    //          </Box>
    // ))

    return(
        <Box display="flex" sx={{ width: '100%', height:"100%", overflow:"auto"}}>
        {/* {
            layerSources &&  layerSources.length > 0 ? 
             <List disablePadding sx={{ width:"100%", height:"100%"}}>
                {layerGroupList}
            </List> : <CalciteLoader/>
        } */}
           
        </Box>
        
    
    )
}

export default LayerListWidgetCustom