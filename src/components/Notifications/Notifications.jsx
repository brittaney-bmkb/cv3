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


const BannerMessage = () => {
    const translatedMessage = translateText(config.bannerMessage, true);
    const translatedLinkText = translateText(config.bannerLinkText);
    const [beforeLink, afterLink] = translatedMessage.split(translatedLinkText);

    return (
        <span>
            {beforeLink}
                <Link
                    variant="body1"
                    href={config.bannerLinkHtml}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                    {translatedLinkText}
                </Link>
            {afterLink}
        </span>
        );
    };

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
                    <span>
                        <BannerMessage />
                    </span>                    
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