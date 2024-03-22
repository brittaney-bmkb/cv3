import { AppBar, styled, Box, Toolbar, Typography, Avatar, Stack, IconButton, Button, Link, Menu, MenuItem, MenuList, Paper } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

import Search from "../Search/Search"
import BlueButton, { StyledButtonFilledPrimaryLight, StyledButtonFilledSecondary } from "../Button/Button"
import { config } from "../../data/config";
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { CalciteIcon } from "@esri/calcite-components-react";
import { useRef, useEffect, useState } from "react";
import MenuBar from "./MenuBar";
import UseAppContext from "../../contexts/AppContext";
import TranslateMenu from "./TranslateMenu";

import HelpDialog from "../HelpDialog/HelpDialog";
import ExportDialog from "../ExportDialog/ExportDialog";


const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 2
})

const NavBar = () => {


    const {setTranslateDialogOpen, translateText} = UseAppContext()
    const {openHelpDialog, setOpenHelpDialog} = UseAppContext()

    const [open, setOpen] = useState(false);
    // const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open)
    }

    const handleHelp = () => {
        console.log("Setting Open Help Dialog True");
        console.log(openHelpDialog)
        setOpenHelpDialog(true)
        console.log(openHelpDialog)
    }

    const handleTranslateButton = () => {
        console.log("OPENING TRANSLATE BUTTON")
        setTranslateDialogOpen(true)
    }
    
    return(
            <AppBar position="sticky">
                <StyledToolbar>
                    <Stack direction={{xs:'column', sm:'row'}} justifyContent="space-between" alignItems="center" width='100%' gap={{xs:0, sm:1, md: 2}}>
                            
                        <Stack direction="row" alignItems='center' flex={1} width="auto">
                            <Stack direction="row" alignContent="center" alignItems="center" gap={1} height='100%' width="auto">
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2, display:{xs: 'flex', sm: 'none', md:'none', lg:'none'}, alignItems:"center", position:"absolute", left:10}}
                            >
                                <MenuIcon fontSize="large"/>
                            </IconButton>
                                <Avatar alt="Cook County Seal" src={config.logo}/>    
                                <Typography variant="h1" textAlign="center">CookViewer</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={2} flex={5} padding={{xs:1, sm:1, md: 2}} justifyContent="space-between">
                            <Box display="flex" flex={5} > 
                                <Search/>
                            </Box>
                            
                            {/* Page Links displayed  */}
                            {/* <Stack flex={5} direction="row" alignItems="center" gap={2} display={{xs:'none', sm:'none', md:'none', lg:'flex' }}>
                                {config.pages.map((page) => {
                                    return(
                                        <Link key={page}>
                                            <Typography variant="body1" color="white">
                                                {translateText(page)}
                                            </Typography>
                                        </Link>
                                    )
                                })}
                            </Stack> */}

                            <Box display="flex" flex={1} sx={{display:{xs: 'none', sm: 'flex', md:'flex', lg:'none'}, alignItems:"center", justifyContent:"flex-end"}}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleClick}
                            >
                                <MenuIcon 
                                fontSize="large"
                                />
                                <MenuBar open={open} setOpen={setOpen}/>
                            </IconButton>
                            </Box>
                            
                            
                        </Stack>
                        
                        <Stack direction="row" gap={2} display={{xs:'none', sm:'none', md:'none', lg:'flex' }}> 
                            
                            <StyledButtonFilledSecondary 
                                onClick={handleHelp}
                                text={translateText("Help")} 
                                startIcon={<HelpOutlineOutlinedIcon/> }/>                        
                            
                            <StyledButtonFilledSecondary 
                                text={translateText("Feedback")} 
                                startIcon={<CalciteIcon icon="mega-phone"/> }/>
                            
                            <StyledButtonFilledSecondary 
                                onClick={handleTranslateButton}
                                text={translateText("Translate")} 
                                startIcon={<CalciteIcon icon="language-translate"/>}/>
                        </Stack>
                        
                    </Stack>
                </StyledToolbar>

            </AppBar>
    )
}

export default NavBar