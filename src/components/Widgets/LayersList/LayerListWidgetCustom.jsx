import { Box, Checkbox, Chip, Collapse, List, ListItem, ListItemButton, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import UseAppContext from "../../../contexts/AppContext";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import { CalciteLoader } from "@esri/calcite-components-react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import LayerListVM from "@arcgis/core/widgets/LayerList/LayerListViewModel.js";

const layerListVMCustom = () => {

    const layerListVM = useRef(null)
    const [ layerListItems, setLayerListItems ] = useState(null)
    const [groupOpen, setGroupOpen] = useState(null);
    const [layerGroups, setLayerGroups] = useState(null);
    const { translateText, mapView } = UseAppContext()

    const handleClick = (title) => {

        let groupedLayers = {}

        layerListVM.current?.operationalItems?.items.flatMap(({ children }) => {
            return children.items.map(childItem => {
                const { title: groupTitle, children: mapImageChildren } = childItem;
                groupedLayers[groupTitle] = mapImageChildren;
    
                const childToUpdate = mapImageChildren.find(child => child.title === title);
                if (childToUpdate) {
                    childToUpdate.layer.visible = !childToUpdate.layer.visible;
                }
            });
        });
        

        setLayerGroups(groupedLayers)
                                                
        }

    useEffect(() => {
        const createLayerListVM = async () => {

            if(!layerListVM.current){
                layerListVM.current = new LayerListVM({
                    view:mapView,
                })

            if(layerListVM.current){

                //console.log("LayerListVM: ", layerListVM.current)

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
                        //console.log("layerListItem: ", item)
                        //if layer type is map image skip the parent group
                        //access the grouped children
                        item.children.items.map(childItem => {
                            
                            let groups = childItem.title
                            let mapImageChildren = childItem.children.items

                            groupedLayers[groups] = mapImageChildren
                            //console.log("layerListItem childItem: ", groupedLayers)

       
                        })
                        
                    }
                })

                let obj = {}
                Object.keys(groupedLayers).map((group) => {
                    obj[group] = false
                })

                setGroupOpen(obj)

                setLayerGroups(groupedLayers)
            }
        }

        createLayerList()

    }, [layerListItems])

    


    useEffect(() => {

        reactiveUtils.watch(
            () => mapView.scale,
            () => {

                // Update layer sources with visibility
                if(layerListVM.current){
                    
                    //console.log("LayerListVM: ", layerListVM.current)
    
                    setLayerListItems(layerListVM.current.operationalItems.items)
                }
            }
        );
    }, []);
    
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
                Object.keys(layerGroups).map(group => {
                    return(
                        <Box>
                            <ListItemButton 
                                key={group}
                                sx={{justifyContent:"space-between"}}
                                onClick={() => {handleGroupClick(group)}}
                                >
                                <Typography variant="body2">{translateText(group)}</Typography>
                                { groupOpen[group] ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={groupOpen[group]}>
                                {
                                    layerGroups[group].map(layer => {
                                        return(
                                            <ListItem
                                                dense
                                                key={layer.title}
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