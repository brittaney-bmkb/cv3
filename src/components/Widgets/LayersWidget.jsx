import { Box, Chip, List, ListItem, ListItemText, Typography } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import { config } from "../../data/config"
import { map, view } from "../../arcgis/webmap/webmap"
import { useEffect, useState } from "react"


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const { toggleMapLayer, setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()
    
    const [activeChips, setActiveChips] = useState({});

    useEffect(() => {
        config.layer_sources.map((layer)=> {
            setActiveChips((prevActiveChips) => ({
                ...prevActiveChips,
                [layer.layerName] : layer.visible
            }))
        })
    },[])

    const layerGroups = config.layer_sources.sort((a, b) => a.groupName > b.groupName ? 1:-1)
                                            .map((layer) => {
                                                return layer.groupName
                                            })

    const toggleLayer = (layer) => {
        toggleMapLayer(layer)
    }

    const handleChipClick = (layerName) => {
        setActiveChips((prevActiveChips) => ({
          ...prevActiveChips,
          [layerName]: !prevActiveChips[layerName]
        }));
      };

    const layerGroupList = [...new Set(layerGroups)].map((group) => (
            <ListItem divider >
                <Box diplay="flex" flexDirection="column" rowGap={2}>
                <Typography variant="h3">{group}</Typography>
                <Box display="flex" columnGap={1} pt={1} sx={{display:"flex", flexFlow:"wrap",gap: "10px 5px"}}>
                {
                    config.layer_sources.filter((layer) => layer.groupName === group)
                                        .sort((a, b) => a.layerName > b.layerName ? 1:-1)
                                        .map((layer) => {
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
            <List sx={{overflow:"scroll"}}>
                {layerGroupList}
            </List>  
    )
}

export default MeasureWidget