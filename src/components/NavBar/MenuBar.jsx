import { useState } from "react"
import { config } from "../../data/config";
import { Box, Divider, Drawer, Icon, List, ListItem, Menu, MenuItem, MenuList, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { CalciteIcon } from "@esri/calcite-components-react";
import TranslateMenu from "./TranslateMenu";
import UseAppContext from "../../contexts/AppContext";
import { theme } from "../../theme";
import { FeedbackExtended, FeedbackGeneral } from "../FeedBack/Feedback";

const MenuBar = ({open, setOpen}) => {

    const [openFeedback, setOpenFeedback] = useState(false)

    const {setTranslateDialogOpen, screenWidth} = UseAppContext()
    
    const handleDrawerToggle = (open) => {
        setOpen(open)
    }

    const handleTranslateButton = () => {
        setTranslateDialogOpen(true)
    }

    const openFeedbackDialog = () => {
        setOpenFeedback(true)
    }

    const drawer = (
        <Box onClick={handleDrawerToggle}  pt={2} display="flex" flexDirection="column" rowGap={2}>
            <List>
            <MenuItem onClick={openFeedbackDialog}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <CalciteIcon icon="mega-phone"/>
                    <Typography variant="h5">Feedback</Typography>
                </Stack>
            </MenuItem>
            <MenuItem onClick={handleTranslateButton}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <CalciteIcon icon="language-translate"/>
                    <Typography variant="h5">Translate</Typography>
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