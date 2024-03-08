import { Box, Collapse, IconButton, Link, Typography } from "@mui/material"
import { theme } from "../../theme"
import { config } from "../../data/config"
import UseAppContext from "../../contexts/AppContext"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Notifications = () => {

    const { translateText, screenWidth } = UseAppContext()

    const [open, setOpen] = useState(true)

    const handleClick = () => {
        setOpen(!open)
    }

    const hyperlink = (
                <Link
                    variant="string"
                    href="https://maps.cookcountyil.gov/cookviewer/"
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                        fontFamily: "barlow",
                        fontWeight: 600, 
                        color:theme.palette.primary.main, }}
                >
                    {`${translateText(config.bannerLinkText)}.`}
                </Link>
    )

    return(
        <Box pt={1} display="flex" flexDirection="column" bgcolor={config.bannerColor} alignItems="center" justifyContent="center" width="100%">
            <Typography 
            variant="h5" 
            align="center" 
            >
                {translateText(config.bannerHeader)}
            </Typography>
            <Collapse in={open}>
                <Typography 
                variant="body1" 
                align="center" 
                sx={{display:"flex"}}
                >
                    <Box display="flex" flexDirection={screenWidth <= theme.breakpoints.values.md ? "column" : "row"} columnGap="4px"> 
                    {translateText(config.bannerMessage.replace(config.bannerLinkText,""))}
                    {hyperlink}
                    </Box>
                </Typography>
            </Collapse>  
            <div 
            onClick={handleClick}
            > 
                {open  ? <ExpandLessIcon/> : <ExpandMoreIcon/> }
            </div>

            
        </Box>
    )
}

export default Notifications