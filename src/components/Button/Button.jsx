import { Button, IconButton, Typography, styled } from "@mui/material"
import { theme } from "../../theme"

const StyledButtonFilledPrimary = ({text, startIcon, endIcon, onClick}) => {
    return(
        <Button 
        variant="contained" 
        color="primary"
        // startIcon={startIcon}
        // endIcon={endIcon}
        onClick={onClick}
        ><Typography variant="body1">
            {text}
        </Typography>
        </Button>
    )
}

export const StyledButtonFilledSecondary = ({text, startIcon, endIcon}) => {
    return(
        <Button 
        variant="contained" 
        color="secondary"
        startIcon={startIcon}
        endIcon={endIcon}
        sx={{paddingTop:'2px', paddingBottom:'2px', textTransform:'none'}}
        ><Typography p={0} variant="body1">
        {text}
    </Typography></Button>
    )
}

export const StyledIconButton = ({text, icon, onClick}) => {
    return(
        <IconButton sx={{display:"flex", flexDirection:"column"}} onClick={onClick}>
            {icon}
            <Typography variant="h5" color={theme.main.text.dark}>{text}</Typography>
        </IconButton>
    )
}


export default StyledButtonFilledPrimary