import { Box, Checkbox, Chip, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import LayerList from "@arcgis/core/widgets/LayerList.js";
import { view } from "../../arcgis/webmap/webmap";
import { config } from "../../data/config";
import UseAppContext from "../../contexts/AppContext";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";



const LayerListWidgetCustom = () => {

    const layerListWidget = useRef(null)
    const layerListDiv = useRef(null)
    const [layerSources, setLayerSources] = useState(config.layer_sources);
    const [layerListItems, setLayerListItems] = useState([])
    const { toggleMapLayer, setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()
    
    const [activeChips, setActiveChips] = useState({});

    const toggleLayer = (layer) => {
        toggleMapLayer(layer)
    }

    const handleChipClick = (layerName) => {
        setActiveChips((prevActiveChips) => ({
          ...prevActiveChips,
          [layerName]: !prevActiveChips[layerName]
        }));
      };


    const handleClick = (layerName) => {

        layerListWidget.current?.operationalItems?.items.filter(item => item.layer.title === layerName)
                                                       .map(item => {
                                                        item.layer.visible = !item.layer.visible 
                                                        item.layer.allSublayers.map(subLayer =>  subLayer.visible = !subLayer.visible)
                                                        })
                                                    

        const updatedLayerSources = layerSources.map(layer => ({
            ...layer,
            visible: layerListWidget.current.operationalItems.items.filter(item => item.layer.title === layer.layerName)
                                                                    .map(item =>  item.visible)[0],
                                                                    
        }));

        setLayerSources(updatedLayerSources);
    
        }

        


    useEffect(() => {
        const createLayerListWidget = async () => {
            if(!layerListWidget.current){
                layerListWidget.current = new LayerList({
                    view:view,
                })

                await layerListWidget.current.when()

                const updatedLayerSources = layerSources.map(layer => ({
                    ...layer,
                    visibleScale: layerListWidget.current.operationalItems.items
                    .filter(item => item.title === layer.layerName)
                    .map(item => item.visibleAtCurrentScale)[0],
                    visible:layerListWidget.current.operationalItems.items
                    .filter(item => item.title === layer.layerName)
                    .map(item => item.visible)[0]
                }));

                setLayerSources(updatedLayerSources);

                console.log("Selected Items: ", layerListWidget.current.selectedItems)

                //layerListWidget.current.selectedItems.items = [layerListWidget.current.operationalItems.items[4]]

            }
        }
        
         createLayerListWidget()
    }, [layerListWidget])

    useEffect(() => {
        reactiveUtils.watch(
            () => view.scale,
            () => {

                //console.log("Visible at scale ",layerListWidget.current.operationalItems.items[7].title, layerListWidget.current.operationalItems.items[7])

                // Update layer sources with visibility
                const updatedLayerSources = layerSources.map(layer => ({
                    ...layer,
                    visibleScale: layerListWidget.current.operationalItems.items.filter(item => item.layer.title === layer.layerName)
                                                                            .map(item =>  item.visibleAtCurrentScale)[0],
                    visible:layerListWidget.current.operationalItems.items
                    .filter(item => item.title === layer.layerName)
                    .map(item => item.visible)[0]
                                                                            
                }));
                setLayerSources(updatedLayerSources);
            }
        );
    }, []);

    const checkVisibility = (layerName) => {
        let visible
        // if(layerListItems > 0){
            visible = layerListItems.filter(item => item.layer.title === layerName)
            .map((item) => item.visibleAtCurrentScale
            )

            //console.log("Layer: ", layer)
       // }

        return visible[0]
        
    }

    const layerGroups = config.layer_sources.sort((a, b) => a.groupName > b.groupName ? 1:-1)
                                            .map((layer) => {
                                                return layer.groupName
                                            })


    

    const layerGroupList = [...new Set(layerGroups)].map((group) => (
        <Box key={group} pt={2}>
                <Typography key={group} variant="h5">{group}</Typography>
                {
                    layerSources.filter((layer) => layer.groupName === group)
                                        .sort((a, b) => a.layerName > b.layerName ? 1:-1)
                                        .map((layer) => {

                                            // let visible = checkVisibility(layer.layerName)
                                            // console.log("layer is visible? ", visible)

                                            return(
                                            <ListItem
                                            dense
                                            key={layer.layerName}
                                            divider
                                            sx={{width: "100%"}}
                                            >
                                                <ListItemButton
                                                    disabled={layer.visibleScale === true ? false : true}
                                                    onClick={() => handleClick(layer.layerName)}
                                                >
                                                <ListItemText variant="body1">{layer.layerName}</ListItemText>
                                                <Checkbox
                                                    checked={layer.visible}
                                                />
                                                </ListItemButton>
                                            
                                            </ListItem>
                                            )
                                        })
                }
             
             </Box>
    ))

    return(
        

        <Box display={"flex"} sx={{ width: '100%', height:"100%", maxWidth: 360}}>
        {
            layerSources &&  layerSources.length > 0 ? 
             <List sx={{overflowY:"auto", minWidth:300, width:"100%"}}>
            {layerGroupList}
        </List>:"null"
        }
           
        </Box>
        
    
    )
}

export default LayerListWidgetCustom