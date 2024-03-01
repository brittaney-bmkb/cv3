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
import { useEffect, useState } from "react";
import FeedbackDialog from "../FeedBack/Feedback";
import InfoIcon from '@mui/icons-material/InfoOutlined';


const PanelHeader = ( {text, descriptionText, results, exportButton, clearButton, feedbackButton, backButton, backButtonComponent, closeButton, panel, primary} ) => {

    const { translateText, clearResultsComparables, panelDisplaySecondary, clearResults, panelPrimaryVisible, panelSecondaryVisible, setPanelDisplay, setPanelPrimaryVisibility, setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()

    //get url parameters
    const [routeParams , setSearchParams] = useSearchParams()
    const [ openExportDialog, setOpenExportDialog ] = useState(false)
    const [ openFeedbackDialog, setOpenFeedbackDialog ] = useState(false)
    const [ actionRowVisible, setActionRowVisible ] = useState(false)

    useEffect(() => {
        if(results ||  exportButton || clearButton || feedbackButton){
            setActionRowVisible(true)
        }
        else{
            setActionRowVisible(false)
        }
    },[results, exportButton, clearButton, feedbackButton])

    function handleClearResults(primary){

        if(primary===true){
            clearResults()

            setSearchParams()
    
            // const updatedUrl = `${window.location.pathname}`;
    
            // // Use history.pushState to update the URL without refreshing the page
            // window.history.pushState({ path: updatedUrl }, '', updatedUrl);

            clearResultsComparables()
            setPanelSecondaryVisibility(false)
        }
        else{
            clearResultsComparables()
            setPanelSecondaryVisibility(false)
        }


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

        let secondaryParcelsDisplayed= ["nearbyProperties", "comparablePropertySearch","resultsListComparables","resultsListNearby","propertyDetailComparable","propertyDetailNearby"].includes(panelDisplaySecondary)

        if(panel==="primary"){
            console.log("going back to: ", backButtonComponent)
            setPanelDisplay(backButtonComponent)

            if(backButtonComponent ==="resultsList" && secondaryParcelsDisplayed){
                clearResultsComparables()
                setPanelSecondaryVisibility(false)
            }
        }
        if(panel==="secondary"){
            console.log("going back to: ", backButtonComponent)
            setPanelDisplaySecondary(backButtonComponent)

            if(["nearbyProperties", "comparablePropertySearch"].includes(backButtonComponent)){
                clearResultsComparables() 
            }            
        }
    }

    const handleClosePanel = (panel) => {
        if(panel==="primary" && panelPrimaryVisible===true){
            setPanelPrimaryVisibility(false)
        }
        if(panel==="secondary" && panelSecondaryVisible===true){
            setPanelSecondaryVisibility(false)
        }
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={0}>
            <Stack direction="row">
                    {backButton ? 
                    <IconButton 
                        onClick={handleBack}
                        sx={{ 
                            display:"flex", 
                            flexDirection:"column",
                            position:"absolute"
                            }}>
                        <ChevronLeft fontSize="small" sx={{color:theme.main.text.dark}}/>
                    <Typography color={theme.main.text.dark} variant="subtitle1">{translateText("Back")}</Typography>
                    </IconButton> : null} 
                <Box display="flex" flex={1} alignItems="center" justifyContent="space-around" p={1} minWidth={150}>
                    <Box bgcolor={theme.main.backgroundColor.grey} p={1} sx={{borderRadius: theme.shape.borderRadius}}>
                        <Typography variant="h5" color={theme.main.text.dark}>
                            {translateText(text)}
                            {/* { infoButton ?  <IconButton  target="_blank" > {<InfoIcon/>} </IconButton > : null} */}
                        </Typography>
                    </Box> 
                </Box>
                
                    {closeButton ? <IconButton 
                        onClick={() => {handleClosePanel(panel)}}
                        sx={{ 
                            display:"flex", 
                            flexDirection:"column",
                            position:"absolute",
                            right: 0}}>
                        <CloseOutlined fontSize="small" sx={{color:theme.main.text.dark}}/>
                    <Typography color={theme.main.text.dark} variant="subtitle1">{translateText("Close")}</Typography>
                    </IconButton> :null}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="center" height={30} sx={{display:actionRowVisible ? "flex" : "none"}}>
                {results ? <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" height={35} p={0} m={0}>
                    <Typography variant="subtitle2" color={theme.main.text.dark} align="center" sx={{height:21}}>
                        {results ? results: 0}
                    </Typography>
                    <Typography variant="subtitle1" color={theme.main.text.dark} align="center">
                        {translateText(`Result${results?.length > 1 ? 's': ''}`)}
                    </Typography>
                </Box> : null}
                {clearButton ? 
                <StyledIconButton icon={<HighlightOffIcon fontSize="small" sx={{color: theme.main.text.dark, width: 15}}/>} text={translateText("Clear")} onClick={() => {handleClearResults(primary)}}/>
                : null}
                {exportButton ? 
                <StyledIconButton icon={<FileDownloadOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark, width: 15}}/>} text={translateText("Export")} onClick={handleExport}/>
                : null}
                {feedbackButton ? 
                <StyledIconButton icon={<FeedbackOutlinedIcon fontSize="small" sx={{color: theme.main.text.dark, width: 15}}/>} text={translateText("Feedback")} onClick={handleFeedback}/>
                : null}
            </Stack>
            {descriptionText ? <Typography p={2} variant="body">{translateText(descriptionText)}</Typography>: null}
            

            <ExportDialog open={openExportDialog} onClose={handleCloseExport}/>
            <FeedbackDialog open={openFeedbackDialog} onClose={handleCloseFeedback}/>

        </Box>
    )
}

export default PanelHeader