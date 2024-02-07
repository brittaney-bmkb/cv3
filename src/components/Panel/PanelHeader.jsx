import { ChevronLeft, ClearAllOutlined, CloseRounded } from "@mui/icons-material"
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
import FeedbackDialog from "../FeedBack/Feedback";

const PanelHeader = ( {text, results, exportButton, clearButton, feedbackButton, backButton, backButtonComponent} ) => {

    const { searchFeatures, clearResults, setPanelDisplay } = UseAppContext()

    //get url parameters
    const [routeParams , setSearchParams] = useSearchParams()
    const [ openExportDialog, setOpenExportDialog ] = useState(false)
    const [ openFeedbackDialog, setOpenFeedbackDialog ] = useState(false)

    function handleClearResults(){
        clearResults()

        setSearchParams({'location': null})

        const updatedUrl = `${window.location.pathname}`;

        // Use history.pushState to update the URL without refreshing the page
        window.history.pushState({ path: updatedUrl }, '', updatedUrl);

    }

    const handleExport = () =>{
        setOpenExportDialog(true)
    }

    const handleCloseExport = () => {
        setOpenExportDialog(false);
    };

    const handleFeedback = () => {
        setOpenFeedbackDialog(true)
    }

    const handleCloseFeedback = () => {
        setOpenFeedbackDialog(false);
    };

    const handleBack = () => {
        setPanelDisplay(backButtonComponent)
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={2}>
            
            <Stack direction="row">
                <Box display="flex" flex={1} alignItems="center" justifyContent="space-around" p={1}>
                    {backButton ? 
                    <IconButton 
                        onClick={handleBack}
                        sx={{position:"absolute", left:8, display:"flex", flexDirection:"column"}}>
                        <ChevronLeft fontSize="small" sx={{color:theme.main.text.dark}}/>
                    <Typography color={theme.main.text.dark} variant="subtitle1">Back</Typography>
                    </IconButton> : null}
                    <Box bgcolor={theme.main.backgroundColor.grey} p={1} sx={{borderRadius: theme.shape.borderRadius}}>
                        <Typography variant="h4" color={theme.main.text.dark}>{text}</Typography>
                    </Box>
                </Box>
                
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                {results ? <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" rowGap={0}>
                    <Typography variant="subtitle1" color={theme.main.text.dark} align="center" >
                        {searchFeatures ? searchFeatures.length: 0}
                    </Typography>
                    <Typography variant="subtitle1" color={theme.main.text.dark} align="center">
                        {`Result${searchFeatures?.length > 1 ? 's': ''}`}
                    </Typography>
                </Box> : null}
                {clearButton ? 
                <StyledIconButton icon={<HighlightOffIcon fontSize="small" sx={{color: theme.main.text.dark}}/>} text={"Clear"} onClick={handleClearResults}/>
                : null}
                {exportButton ? 
                <StyledIconButton icon={<FileDownloadOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark}}/>} text={"Export"} onClick={handleExport}/>
                : null}
                {feedbackButton ? 
                <StyledIconButton icon={<FeedbackOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark}}/>} text={"Feedback"} onClick={handleFeedback}/>
                : null}
                </Stack>

            <ExportDialog open={openExportDialog} onClose={handleCloseExport}/>
            <FeedbackDialog open={openFeedbackDialog} onClose={handleCloseFeedback}/>

        </Box>
    )
}

export default PanelHeader