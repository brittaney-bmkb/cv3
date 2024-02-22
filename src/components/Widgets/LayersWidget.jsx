import { Box, Chip, List, ListItem, ListItemText } from "@mui/material"
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

    const layerGroups = config.layer_sources.map((layer) => {
        return layer.groupName
    })

    const toggleLayer = (layerName) => {
        toggleMapLayer(layerName)
    }

    const handleChipClick = (layerName) => {
        setActiveChips((prevActiveChips) => ({
          ...prevActiveChips,
          [layerName]: !prevActiveChips[layerName]
        }));
      };

    const layerGroupList = [...new Set(layerGroups)].map((group) => (
            <ListItem divider>
                <Box diplay="flex" flexDirection="column" rowGap={2}>
                
                <ListItemText primary={group}/>
                <Box display="flex" columnGap={1} pt={1}>
                {
                    config.layer_sources.filter((layer) => layer.groupName === group)
                                        .map((layer) => {
                                            return(
                                            <Chip
                                            key={layer.layerName}
                                            label={layer.layerName}
                                            clickable
                                            onClick={() => {
                                                toggleLayer(layer.layerName)
                                                handleChipClick(layer.layerName)
                                            }}
                                            color={activeChips[layer.layerName] ? 'primary' : 'info'}
                                            />
                                            )
                                        })
                }
                </Box>

                </Box>

            </ListItem>
        ))

    return(
        <Box display="flex" flexDirection="column" >
            <List>
                {layerGroupList}
            </List>
        </Box>
        
    )
}

export default MeasureWidget