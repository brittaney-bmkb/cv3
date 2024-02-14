import { ChevronLeft, ClearAllOutlined, CloseOutlined, CloseRounded } from "@mui/icons-material"
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

const PanelHeader = ( {text, results, exportButton, clearButton, feedbackButton, backButton, backButtonComponent, closeButton, panel} ) => {

    const { searchFeatures, clearResults, setPanelDisplay, setPanelPrimaryVisibility, setPanelSecondaryVisibility } = UseAppContext()

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

    const handleClosePanel = (panel) => {
        if(panel==="primary"){
            setPanelPrimaryVisibility(false)
        }
        if(panel==="secondary"){
            setPanelSecondaryVisibility(false)
        }
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={0}>
            
            <Stack direction="row">
            {backButton ? 
                    <IconButton 
                        onClick={handleBack}
                        sx={{ display:"flex", flexDirection:"column", position:"absolute", left:8}}>
                        <ChevronLeft fontSize="small" sx={{color:theme.main.text.dark}}/>
                    <Typography color={theme.main.text.dark} variant="subtitle1">Back</Typography>
                    </IconButton> : null}
                <Box display="flex" flex={1} alignItems="center" justifyContent="space-around" p={1} minWidth={150}>
                    <Box bgcolor={theme.main.backgroundColor.grey} p={1} sx={{borderRadius: theme.shape.borderRadius}}>
                        <Typography variant="h5" color={theme.main.text.dark}>{text}</Typography>
                    </Box> 
                </Box>
                {closeButton ? 
                    <IconButton 
                        onClick={() => {handleClosePanel(panel)}}
                        sx={{ display:"flex", flexDirection:"column", position:"absolute", right:8}}>
                        <CloseOutlined fontSize="small" sx={{color:theme.main.text.dark}}/>
                    <Typography color={theme.main.text.dark} variant="subtitle1">Close</Typography>
                    </IconButton> : null}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center" height={30}>
                {results ? <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" height={35} p={0} m={0}>
                    <Typography variant="subtitle2" color={theme.main.text.dark} align="center" sx={{height:21}}>
                        {searchFeatures ? searchFeatures.length: 0}
                    </Typography>
                    <Typography variant="subtitle1" color={theme.main.text.dark} align="center">
                        {`Result${searchFeatures?.length > 1 ? 's': ''}`}
                    </Typography>
                </Box> : null}
                {clearButton ? 
                <StyledIconButton icon={<HighlightOffIcon fontSize="small" sx={{color: theme.main.text.dark, width: 15}}/>} text={"Clear"} onClick={handleClearResults}/>
                : null}
                {exportButton ? 
                <StyledIconButton icon={<FileDownloadOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark, width: 15}}/>} text={"Export"} onClick={handleExport}/>
                : null}
                {feedbackButton ? 
                <StyledIconButton icon={<FeedbackOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark, width: 15}}/>} text={"Feedback"} onClick={handleFeedback}/>
                : null}
                </Stack>

            <ExportDialog open={openExportDialog} onClose={handleCloseExport}/>
            <FeedbackDialog open={openFeedbackDialog} onClose={handleCloseFeedback}/>

        </Box>
    )
}

export default PanelHeader