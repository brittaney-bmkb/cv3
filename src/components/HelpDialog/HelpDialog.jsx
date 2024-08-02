import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider,  Typography, Button } from "@mui/material"
import { theme } from "../../theme"

import UseAppContext from "../../contexts/AppContext"
import HelpTabs from "./HelpTabs"
import HelpContent from "./HelpContext"
import useMediaQuery from '@mui/material/useMediaQuery';
import { returnTranslatedText } from "../../translation/handleTranslation"



const HelpDialog = ({}) => {
    
    const {openHelpDialog, setOpenHelpDialog, translateText, screenWidth} = UseAppContext()

    const onClose = () => {
        setOpenHelpDialog(false)
    }



    return(
        <Dialog 
            open={openHelpDialog}
            onClose={onClose}
            fullScreen={screenWidth <= theme.breakpoints.values.sm}
            fullWidth
            sx={{}}
            > 

            <Box display="flex" flexDirection='column'>
            <DialogTitle>
                <Typography variant="h1" color={theme.main.text.dark}>
                {translateText("Help")}
            </Typography>   
            </DialogTitle>     
            <Divider/>                                                                           
            </Box>

            
            <DialogContent sx={{ height: 'auto' }}>
                <HelpTabs/>
            </DialogContent>

                <Divider/>

            <DialogActions id ="Help Close" sx={{padding: '10px'}}>
                <Button variant="text" onClick={onClose} sx={{textTransform: 'none'}}> 
                    <Typography variant="h5" color={theme.palette.primary.main}>
                        {translateText("Close")}
                    </Typography>   
            </Button>
            </DialogActions>    
        </Dialog>
    )

}

export default HelpDialog