import { Box, Checkbox, Chip, Collapse, List, ListItem, ListItemButton, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import UseAppContext from "../../../contexts/AppContext";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import { CalciteLoader } from "@esri/calcite-components-react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import LayerListVM from "@arcgis/core/widgets/LayerList/LayerListViewModel.js";
import { config } from "../../../data/config";

const layerListVMCustom = () => {

    const layerListVM = useRef(null)
    const [ layerListItems, setLayerListItems ] = useState(null)
    const [groupOpen, setGroupOpen] = useState(null);
    const [layerGroups, setLayerGroups] = useState(null);
    const { translateText, mapView, mapViewScale } = UseAppContext()

    const sortGroupedLayers = (groupedLayers) => {
        const sortedGroupedLayers = {};
        Object.entries(groupedLayers)
            .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
            .forEach(([group, children]) => {
                sortedGroupedLayers[group] = children;
            });
        return sortedGroupedLayers;
    };

    const handleClick = (title) => {
        const updatedGroupedLayers = {};

        if(title !== config.target_layer_name ){
            layerListItems.forEach(item => {
                if (item.layer.type === "map-image") {
                    item.children.items.forEach(childItem => {
                        const group = childItem.title;
                        const mapImageChildren = childItem.children.items;
        
                        if (updatedGroupedLayers[group]) {
                            updatedGroupedLayers[group] = [...updatedGroupedLayers[group], ...mapImageChildren];
                        } else {
                            updatedGroupedLayers[group] = mapImageChildren;
                        }
        
                        const childToUpdate = mapImageChildren.find(child => child.title === title);
                        if (childToUpdate) {
                            childToUpdate.layer.visible = !childToUpdate.layer.visible;
                        }
                    });
                } else if (item.layer.type === "group") {
                    const group = item.title;
                    const groupChildren = item.children.items;
        
                    if (updatedGroupedLayers[group]) {
                        updatedGroupedLayers[group] = [...updatedGroupedLayers[group], ...groupChildren];
                    } else {
                        updatedGroupedLayers[group] = groupChildren;
                    }
        
                    groupChildren.forEach(child => {
                        if (child.title === title) {
                            child.layer.visible = !child.layer.visible;
                        }
                    });
                }
            });
            
            let sortedUpdatedGroups = sortGroupedLayers(updatedGroupedLayers)
            setLayerGroups(sortedUpdatedGroups);
        }
    
        
    }
    

    useEffect(() => {
        const createLayerListVM = async () => {

            if(!layerListVM.current){
                layerListVM.current = new LayerListVM({
                    view:mapView,
                })

            if(layerListVM.current){

                ////console.log("LayerListVM: ", layerListVM.current)

                setLayerListItems(layerListVM.current.operationalItems.items)
            }


            }
        }
        
         createLayerListVM()
    }, [layerListVM])


    useEffect(() => {

        const createLayerList = () => {
            if(layerListItems){
                let groupedLayers = {}

                layerListItems.map((item) => {
                    
                    if(item.layer.type === "map-image"){
                        //console.log("layerListItem map-image: ", item)
                        //if layer type is map image skip the parent group
                        //access the grouped children
                        item.children.items.map(childItem => {
                            
                            let group = childItem.title
                            let mapImageChildren = childItem.children.items

                            
                            if(groupedLayers[group]){
                                groupedLayers[group] = [...groupedLayers[group], mapImageChildren]
                            }
                            else{
                                groupedLayers[group] = mapImageChildren
                            }
                            ////console.log("layerListItem childItem: ", groupedLayers)

       
                        })
                        
                    }

                    else if(item.layer.type === "group"){
                        //console.log("layerListItem: ", item)
                        let group = item.title
                        let groupChildren = item.children.items

                        if(groupedLayers[group]){
                            groupedLayers[group] = [...groupedLayers[group], ...groupChildren]
                            //console.log("groupedLayers: ", groupedLayers)
                        }
                        else{
                            groupedLayers[group] =  groupChildren
                        }
                        
                    }
                })

                let obj = {}
                Object.keys(groupedLayers).map((group) => {
                    obj[group] = false
                })

                setGroupOpen(obj)


                let sortedUpdatedGroups = sortGroupedLayers(groupedLayers)
                setLayerGroups(sortedUpdatedGroups);
            }
        }

        createLayerList()

    }, [layerListItems])

    


    useEffect(() => {

        if(mapViewScale){
            reactiveUtils.watch(
                () => mapViewScale.scale,
                () => {
                    // Update layer sources with visibility
                    if(layerListVM.current){
                        ////console.log("LayerListVM: ", layerListVM.current)
                        setLayerListItems(layerListVM.current.operationalItems.items)
                    }
                }
            );
        }

    }, [mapViewScale]);

    
    const handleGroupClick = (group) => {

        setGroupOpen(prev => ({
            ...prev,
            [group]: !prev[group]
        }));

    }

    return(
        <Box display="flex" sx={{ width: '100%', height:"100%", overflow:"auto"}}>
        {
            layerGroups ? 
             <List disablePadding sx={{ width:"100%", height:"100%"}}>
                {
                Object.keys(layerGroups).map((group, index) => {
                    return(
                        <Box key={`${group}-${index}`}>
                            <ListItemButton 
                                sx={{justifyContent:"space-between"}}
                                onClick={() => {handleGroupClick(group)}}
                                >
                                <Typography variant="body2">{translateText(group)}</Typography>
                                { groupOpen[group] ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={groupOpen[group]}>
                                {
                                    layerGroups[group].map((layer, index) => {
                                        return(
                                            <ListItem
                                                dense
                                                key={`${layer.title}-${index}`}
                                                divider
                                                sx={{width: "100%"}}
                                                >
                                                    <ListItemButton
                                                        disabled={layer.visibleAtCurrentScale === true ? false : true}
                                                        onClick={() => handleClick(layer.title)}
                                                        sx={{justifyContent:"space-between"}}
                                                    >
                                                    {/* <ListItemText  sx={{display:"flex", flex:4}}> */}
                                                        <Typography variant="body2">
                                                            {translateText(layer.title)}
                                                        </Typography>
                                                        
                                                        {/* </ListItemText> */}
                                                    <Checkbox
                                                        color="primary"
                                                        checked={layer.visible}
                                                    />
                                                    </ListItemButton>
                                                
                                            </ListItem>
                                        )
                                    })
                                }
                            </Collapse>
                        </Box>
                        
                    )
                    })
                    }

            </List> 
            : <CalciteLoader/>
        }
           
        </Box>
        
    
    )
}

export default layerListVMCustom