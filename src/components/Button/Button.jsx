import { Button, ButtonGroup, Fab, IconButton, Typography, styled } from "@mui/material"
import { theme } from "../../theme"
import UseAppContext from "../../contexts/AppContext"

const StyledButtonFilledPrimary = ({text, startIcon, endIcon, onClick, textVarient, disabled, width, active}) => {

    const {screenWidth} = UseAppContext()
    

    return(
        <Button 
            size={screenWidth < theme.breakpoints.values.md ? "small" : "medium"}
            disabled={disabled}
            variant="contained" 
            color= "primary"
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            sx={{
                textTransform:"none", 
                width: width ?? "auto", 
                height:30,
                backgroundColor: active ? theme.palette.primary.dark: theme.palette.primary.main, //TODO edit here for style guide
                boxShadow:  active ? 0: 2,
                ////add this for style guide, adding for future reference.
            //     ':hover': {
            //     bgcolor: theme.palette.primary.complementary,
            //     color: theme.palette.accessibilityText.dark,
            // },                
                }}
        ><Typography 
            variant={textVarient} 
            color={theme.palette.primary.contrastText}
            ////add this for style guide, adding for future reference.
            // sx={{
            //     ':hover': {
            //     // bgcolor: theme.palette.primary.light,
            //     color: theme.palette.accessibilityText.dark,
            //     },
            // }}            
        >
            {text}
        </Typography>
        </Button>
    )
}


// Add a new compoenent for button group and customize
export const StyledPanelButton = ({text1, text2, text3, icon1, icon2, icon3, onClick}) => {
    // display="flex" flexDirection="column" flexGrow={1} minHeight={0}

    return(
        
        <ButtonGroup size="small" sx={{display:"flex", textTransform:"none"}}>
            <StyledButtonFilledPrimary
                variant="contained"
                color="primary"
                startIcon={icon1}
                text={text1}
                onClick={onClick}
            >
                
            </StyledButtonFilledPrimary>
            
            <StyledButtonFilledPrimary
                variant="contained"
                color="primary"
                startIcon={icon2}
                text={text2}
                onClick={onClick}
            >
            </StyledButtonFilledPrimary>

            <StyledButtonFilledPrimary
                variant="contained"
                color="primary"
                startIcon={icon3}
                text={text3}
                onClick={onClick}
            >
                
            </StyledButtonFilledPrimary>            

        </ButtonGroup>
    )
}

export const StyledButtonFilledSecondary = ({text, startIcon, endIcon, onClick}) => {
    return(
        <Button 
            variant="contained" 
            color="secondary"
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            sx={{paddingTop:'2px', paddingBottom:'2px', textTransform:'none'}}
        >
            <Typography p={0} variant="body1">
                {text}
            </Typography>
        </Button>
    )
}

export const StyledButtonFilledPrimaryLight = ({text, startIcon, endIcon, onClick}) => {
    return(
        <Button 
        variant="contained" 
        startIcon={startIcon}
        endIcon={endIcon}
        onClick={onClick}
        sx={{
            paddingTop:'2px', 
            paddingBottom:'2px', 
            textTransform:'none', 
            bgcolor: theme.palette.accessibilityButton.main,
            color: theme.palette.accessibilityText.dark,
            ':hover': {
                bgcolor: theme.palette.accessibilityButton.complementary
              },
        }}
        ><Typography p={0} variant="body1">
        {text}
    </Typography></Button>
    )
}


export const StyledIconButton = ({text, icon, onClick}) => {
    return(
        <IconButton sx={{display:"flex", flexDirection:"column"}} onClick={onClick}>
            {icon}
            <Typography variant="subtitle1" color={theme.main.text.dark}>{text}</Typography>
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