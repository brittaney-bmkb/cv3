import { Box, Chip, List, ListItem, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import LayerList from "@arcgis/core/widgets/LayerList.js";
import { view } from "../../arcgis/webmap/webmap";
import { config } from "../../data/config";
import UseAppContext from "../../contexts/AppContext";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";


const LayerListWidgetCustom = () => {

    const layerListWidget = useRef(null)
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


    useEffect(() => {
        const createLayerListWidget = async () => {
            if(!layerListWidget.current){
                layerListWidget.current = new LayerList({
                    view:view
                })
                console.log("layer list operational items", layerListWidget.current.operationalItems)
            }
        }
        
         createLayerListWidget()
    }, [layerListWidget])

    useEffect(() => {
        reactiveUtils.watch(
            () => view.scale,
            (scale) => {
                if(scale){
                    console.log("new view scale: ", scale)
                }
            }
        )
    })

    const checkVisibility = (layerName) => {
        const visible = false
        if(layerListWidget.current && layerListWidget.current.operationalItems.items > 0){
            visible =  layerListWidget.current.operationalItems.items.filter(layer =>{
                return layer.title === layerName})
            .map((layer) => {
                return layer.visibleAtCurrentScale
            })
        }

        return visible
        
    }

    const layerGroups = config.layer_sources.sort((a, b) => a.groupName > b.groupName ? 1:-1)
                                            .map((layer) => {
                                                return layer.groupName
                                            })

    const layerGroupList = [...new Set(layerGroups)].map((group) => (
        <ListItem divider >
            <Box diplay="flex" flexDirection="column" rowGap={2}>
            <Typography variant="h3">{group}</Typography>
            <Box display="flex" columnGap={1} pt={1} sx={{display:"flex", flexFlow:"wrap",gap: "10px 5px"}}>
            {
                config.layer_sources.filter((layer) => layer.groupName === group)
                                    .sort((a, b) => a.layerName > b.layerName ? 1:-1)
                                    .map((layer) => {

                                        let visible = checkVisibility(layer.layerName)
                                        console.log("layer is visible? ", visible)

                                        return(
                                        <Chip
                                        key={layer.layerName}
                                        label={layer.layerName}
                                        clickable
                                        onClick={() => {
                                            toggleLayer(layer)
                                            handleChipClick(layer.layerName)
                                        }}
                                        color={activeChips[layer.layerName] ? 'primary' : 'info'}
                                        
                                        sx={{fontFamily:"Barlow", fontWeight:500}}
                                        />
                                        )
                                    })
            }
            </Box>

            </Box>

        </ListItem>
    ))

    return(
        <Box
        id="layerListWidgetContainer"
        >
            {layerListWidget.current ? 
                <List sx={{overflow:"scroll"}}>
                {layerGroupList}
            </List>  : "no layers"
            }
        </Box>
    )
}

export default LayerListWidgetCustom