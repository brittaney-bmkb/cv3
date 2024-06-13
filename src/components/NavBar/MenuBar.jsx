import { useState } from "react"
import { config } from "../../data/config";
import { Box, Divider, Drawer, Icon, List, ListItem, Menu, MenuItem, MenuList, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { CalciteIcon } from "@esri/calcite-components-react";
import FeedbackIcon from '@mui/icons-material/Feedback';
import TranslateIcon from '@mui/icons-material/Translate';

import TranslateMenu from "./TranslateMenu";
import UseAppContext from "../../contexts/AppContext";
import { theme } from "../../theme";
import { InfoOutlined } from "@mui/icons-material";
import { FeedbackExtended, FeedbackGeneral } from "../Feedback/Feedback";

const MenuBar = ({open, setOpen}) => {


    const {setPanelPrimaryVisibility, setPanelDisplay, setTranslateDialogOpen, setOpenHelpDialog, screenWidth, translateText, setShowMapMoblie} = UseAppContext()

    const [openFeedback, setOpenFeedback] = useState(false)

    
    const handleDrawerToggle = (open) => {
        setOpen(open)
    }

    const handleTranslateButton = () => {
        setTranslateDialogOpen(true)
    }


    const handleHelp = () => {
        console.log("Setting Open Help Dialog True");
        setOpenHelpDialog(true)
    }
    
    const openFeedbackDialog = () => {
        setOpenFeedback(true)
    }

    const handleInfo = () => {
        setShowMapMoblie(false)
        setPanelPrimaryVisibility(true)
        setPanelDisplay("info")
    }
    const drawer = (
        <Box onClick={handleDrawerToggle}  pt={2} display="flex" flexDirection="column" rowGap={2}>
            <List>
            <MenuItem onClick={handleInfo}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <InfoOutlined/>
                        <Typography variant="h5">{translateText("Info")}</Typography>
                    </Stack>
                </MenuItem> 
                <MenuItem onClick={handleHelp}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CalciteIcon icon="question-mark"/>
                        <Typography variant="h5">{translateText("Help")}</Typography>
                    </Stack>
                </MenuItem>    
  
                <MenuItem onClick={openFeedbackDialog}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <FeedbackIcon />
                        <Typography variant="h5">{translateText("Feedback")}</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleTranslateButton}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TranslateIcon />
                        <Typography variant="h5">{translateText("Translate")}</Typography>
                    </Stack>
                </MenuItem>

            
            </List>
        </Box>
    )
    return(
        <Box>
            <SwipeableDrawer
            onOpen={() => {handleDrawerToggle(true)}}
            anchor={ screenWidth < theme.breakpoints.values.sm ? "bottom" : "right"}
            variant="temporary"
            open={open}
            onClose={() => {handleDrawerToggle(false)}}
            ModalProps={{
                keepMounted: true
            }}
            sx={{
                display: {
                    xs: "flex",
                    sm:"flex",
                    md: "flex",
                    lg: "none"
                },
                p:0,
                zIndex: "modal",
                
                '& .MuiDrawer-paper': 
                { 
                    boxSizing: 'border-box', 
                    width: screenWidth < theme.breakpoints.values.sm ? screenWidth : 200,
                },
            }}
            >
                {drawer}
            </SwipeableDrawer>

            <FeedbackExtended open={openFeedback} onClose={setOpenFeedback}/>
        </Box>

    )
}

export default MenuBar