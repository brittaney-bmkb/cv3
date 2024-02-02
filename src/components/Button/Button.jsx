import { Button, Typography, styled } from "@mui/material"

const StyledButtonFilledPrimary = ({text, startIcon, endIcon}) => {
    return(
        <Button 
        variant="contained" 
        color="primary"
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


export default StyledButtonFilledPrimary