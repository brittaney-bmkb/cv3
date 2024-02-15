import { Button, Fab, IconButton, Typography, styled } from "@mui/material"
import { theme } from "../../theme"

const StyledButtonFilledPrimary = ({text, startIcon, endIcon, onClick, textVarient}) => {
    return(
        <Button 
        variant="contained" 
        color="primary"
        startIcon={startIcon}
        endIcon={endIcon}
        onClick={onClick}
        sx={{textTransform:"none", width:"fit-content", height:30}}
        ><Typography variant={textVarient} color={theme.palette.primary.contrastText}>
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
            <Typography variant="subtitle1" color={theme.main.text.dark} fontFamily="barlow">{text}</Typography>
        </IconButton>
    )
}

export const ToggleIconButton = ({icon, text, onClick, ariaLabel}) => {

    return(
        <Fab
        color="primary"
        aria-label={ariaLabel}
        onClick={onClick}
        sx= {{display:"flex", flexDirection:"column", textTransform:"none"}}
        >
        {icon}
        <Typography variant="subtitle1">{text}</Typography>
        </Fab>
    )
}


export default StyledButtonFilledPrimary