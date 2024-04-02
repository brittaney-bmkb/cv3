import { AppBar, styled, Box, Toolbar, Typography, Avatar, Stack, IconButton, Button, Link, Menu, MenuItem, MenuList, Paper } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TranslateIcon from '@mui/icons-material/Translate';

import Search from "../Search/Search"
import BlueButton, { StyledButtonFilledPrimaryLight, StyledButtonFilledSecondary } from "../Button/Button"
import { config } from "../../data/config";
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { CalciteIcon } from "@esri/calcite-components-react";
import { useRef, useEffect, useState } from "react";
import MenuBar from "./MenuBar";
import UseAppContext from "../../contexts/AppContext";
import TranslateMenu from "./TranslateMenu";
import { FeedbackExtended, FeedbackGeneral } from "../FeedBack/Feedback";

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
    const [openFeedback, setOpenFeedback] = useState(false)

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

    const openFeedbackDialog = () => {
        setOpenFeedback(true)
    }
    
    return(
            <AppBar position="sticky">
                <StyledToolbar>
                    <Stack direction={{xs:'column', sm:'row'}} justifyContent="space-between" alignItems="center" width='100%' gap={{xs:0, sm:1, md: 2}}>
                            
                        <Stack direction="row" alignItems='center' flex={1} width="auto">
                            <Stack direction="row" alignItems="center" gap={1} height='100%' width="auto">
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleClick}
                                sx={{ display:{xs: 'flex', sm: 'none', md:'none', lg:'none'}, alignItems:"center", position:"absolute",  left:10 }}
                            >
                                <MenuIcon fontSize="large"/>
                            </IconButton>
                                <Avatar alt="Cook County Seal" src={config.logo}/>    
                                <Typography variant="h1" textAlign="center">CookViewer</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" alignItems="center" flex={5} padding={{xs:1, sm:1, md: 2}} justifyContent="space-between">
                            <Box display="flex" flex={5} > 
                                <Search/>
                            </Box>

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
                                
                            </IconButton>
                            </Box>
                            
                            <MenuBar open={open} setOpen={setOpen}/>
                        </Stack>
                        
                        <Stack direction="row" gap={2} display={{xs:'none', sm:'none', md:'none', lg:'flex' }}> 

                            <StyledButtonFilledPrimaryLight 
                                onClick={handleHelp}
                                text={translateText("Help")} 
                                startIcon={<HelpOutlineOutlinedIcon/> }/>                        
                            
                            <StyledButtonFilledPrimaryLight 
                                onClick={openFeedbackDialog}
                                text={translateText("Feedback")} 
                                startIcon={<FeedbackIcon/> }/>
                            
                            <StyledButtonFilledPrimaryLight 
                                onClick={handleTranslateButton}
                                text={translateText("Translate")} 
                                startIcon={<TranslateIcon />}/>

                        </Stack>

                        <FeedbackExtended open={openFeedback} onClose={setOpenFeedback}/>
                        
                    </Stack>
                </StyledToolbar>

            </AppBar>
    )
}

export default NavBar