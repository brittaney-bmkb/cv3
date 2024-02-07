import { ClearAllOutlined, CloseRounded } from "@mui/icons-material"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { theme } from "../../theme"
import UseAppContext from "../../contexts/AppContext"
import { StyledIconButton } from "../Button/Button";
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import { useSearchParams } from "react-router-dom"
import ExportDialog from "../ExportDialog/ExportDialog";
import { useState } from "react";

const PanelHeader = ( {text} ) => {

    const { searchFeatures, clearResults } = UseAppContext()

    //get url parameters
    const [routeParams , setSearchParams] = useSearchParams()
    const [ openExportDialog, setOpenExportDialog ] = useState(false)

    function handleClearResults(){
        clearResults()

        setSearchParams({'location': null})

        const updatedUrl = `${window.location.pathname}`;

        // Use history.pushState to update the URL without refreshing the page
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);

    }

    function handleExport(){
        setOpenExportDialog(true)
    }

    const handleClose = () => {
        setOpenExportDialog(false);
    };

    return(
        <Box display="flex" flexDirection="column" rowGap={2}>
            <Stack direction="row">
                <Box display="flex" flex={1} alignItems="center" justifyContent="space-around">
                    <Box bgcolor={theme.main.backgroundColor.grey} p={1} sx={{borderRadius: theme.shape.borderRadius}}>
                        <Typography variant="h4" color={theme.main.text.dark}>{text}</Typography>
                    </Box>
                </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" rowGap={0}>
                    <Typography variant="subtitle1" color={theme.main.text.dark} align="center" >
                        {searchFeatures ? searchFeatures.length: 0}
                    </Typography>
                    <Typography variant="subtitle1" color={theme.main.text.dark} align="center">
                        {`Result${searchFeatures?.length > 1 ? 's': ''}`}
                    </Typography>
                </Box>
                <StyledIconButton icon={<HighlightOffIcon fontSize="small" sx={{color: theme.main.text.dark}}/>} text={"Clear"} onClick={handleClearResults}/>
                <StyledIconButton icon={<FileDownloadOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark}}/>} text={"Export"} onClick={handleExport}/>
                <StyledIconButton icon={<FeedbackOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark}}/>} text={"Feedback"}/>
            </Stack>

            <ExportDialog open={openExportDialog} onClose={handleClose}/>

        </Box>
    )
}

export default PanelHeader