import { CalciteIcon } from "@esri/calcite-components-react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { theme } from "../../theme"
import * as intl from "@arcgis/core/intl.js";
import { config } from "../../data/config";


const TranslateMenu = () => {
    const {translateDialogOpen, setTranslateDialogOpen, setLanguage} = UseAppContext()

    const handleClose = () => {
        setTranslateDialogOpen(false)
    }

    const onClick = (language) => {
        setLanguage(language)
        handleClose()

        //reference: https://developers.arcgis.com/javascript/latest/localization/
        let locale_code = config.language_codes[language]
        console.log("setting locale code to: ", locale_code)
        intl.setLocale(locale_code)
        console.log("locale code to: ", intl.getLocale())
    }

    return(
        <Dialog
        open={translateDialogOpen}
        onClose={handleClose} 
        >
            <DialogTitle>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    <CalciteIcon icon="language-translate"/>
                    <Typography variant="h2" color={theme.main.text.dark}>Translate</Typography>
                </Stack>
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <Stack direction="row" spacing={3}>
                <Button variant="text" sx={{textTransform:"none"}} onClick={() => {onClick("english")}}>
                <Typography variant="h5">English</Typography>
                </Button>
                    <Divider flexItem variant="fullWidth" orientation="vertical"/>
                <Button variant="text" sx={{textTransform:"none"}} onClick={() => {onClick("spanish")}}>
                    <Typography variant="h5">Español</Typography>
                </Button>
                </Stack>

            </DialogContent>
        </Dialog>
    )
}

export default TranslateMenu