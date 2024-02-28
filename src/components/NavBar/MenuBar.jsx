import { useState } from "react"
import { config } from "../../data/config";
import { Box, Divider, Drawer, Icon, List, ListItem, Menu, MenuItem, MenuList, Stack, SwipeableDrawer, Typography } from "@mui/material";
import { CalciteIcon } from "@esri/calcite-components-react";
import TranslateMenu from "./TranslateMenu";
import UseAppContext from "../../contexts/AppContext";

const MenuBar = ({open, setOpen}) => {

    const {setTranslateDialogOpen} = UseAppContext()
    
    const handleDrawerToggle = () => {
        setOpen((prevState) => !prevState)
    }

    const handleTranslateButton = () => {
        setTranslateDialogOpen(true)
    }

    const drawer = (
        <Box onClick={handleDrawerToggle}  pt={2} display="flex" flexDirection="column" rowGap={2}>
            <List>
            {
                config.pages.map((page) => {
                    return (
                        <MenuItem sx={{ textAlign: "center" }}>
                            <Typography variant="h5" align="center">{page}</Typography>
                        </MenuItem>
                    
                    )
                })
            }
        <Divider/>
            <MenuItem>
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
            anchor="right"
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
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
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 200 },
            }}
            >
                {drawer}
            </SwipeableDrawer>
        </Box>

    )
}

export default MenuBar