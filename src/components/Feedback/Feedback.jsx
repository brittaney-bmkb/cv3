import { CloseOutlined } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { theme } from "../../theme"
import { useEffect, useState } from "react"
import { CalciteButton, CalciteDialog } from "@esri/calcite-components-react"
import { config } from "../../data/config"

const FeedbackDialog = ({open, onClose}) => {

    return(
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="feedback-dialog-title"
        >
            <IconButton aria-label ="close-outlined-button" sx={{position:"absolute", right:8, top:8}} onClick={onClose}><CloseOutlined/></IconButton>
            <DialogTitle id="feedback-dialog-title" >Feedback</DialogTitle>
        </Dialog>
    )
}

export const FeedbackGeneral = ({open, onClose}) => {

    const { translateText, screenWidth, language } = UseAppContext()
    const [ deviceType, setDeviceType ] = useState()
    const [ locale, setLocale ] = useState()

    useEffect(() => {

        if(screenWidth < theme.breakpoints.values.sm){
            setDeviceType("mobile")
        }
        else if(screenWidth < theme.breakpoints.values.md && screenWidth >= theme.breakpoints.values.sm){
            setDeviceType("tablet")
        }
        else{
            setDeviceType("desktop")
        }

    }, [screenWidth])

    useEffect(() => {
        if(language === "english"){
            setLocale("en")
        }
        if(language === "spanish"){
            setLocale("es")
        }
    }, [language])

    const embedContainerStyle = {
        position: 'relative',
        height: "100%",
        minHeight: "60vh",
        maxWidth: '100%',
      };
    
    const iframeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        };

    const handleClose = () => {
        onClose(false)
    }


    return(
        <Dialog
            fullScreen = {screenWidth < theme.breakpoints.values.sm ? true : false}
            fullWidth
            open={open}
            onClose={onClose}
            aria-labelledby="cookviewer-dialog-title"
        >
            <IconButton aria-label ="close-outlined-button" sx={{position:"absolute", right:8, top:8}} onClick={handleClose}><CloseOutlined/></IconButton>
            <DialogTitle id="cookviewer-dialog-title">{translateText("General Feedback")}</DialogTitle>
            <DialogContent>
                <div style={embedContainerStyle}>
                <iframe 
                    name="survey123webform"
                    title="CookViewer 3.0 Simple Feedback"
                    src={`//survey123.arcgis.com/share/ba8f1d610701420abc33612ef1d3378a?hide=navbar,footer&locale=${locale}&field:device_type=${deviceType}`}
                    allow="geolocation https://survey123.arcgis.com; camera https://survey123.arcgis.com"
                    style={iframeStyle}
                />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const FeedbackExtended = ({open, onClose}) => {

    const { translateText, screenWidth, language } = UseAppContext()

    const [ deviceType, setDeviceType ] = useState()
    const [ locale, setLocale ] = useState()

    useEffect(() => {

        if(screenWidth < theme.breakpoints.values.sm){
            setDeviceType("mobile")
        }
        else if(screenWidth < theme.breakpoints.values.md && screenWidth >= theme.breakpoints.values.sm){
            setDeviceType("tablet")
        }
        else{
            setDeviceType("desktop")
        }

        //console.log("Device type: ", deviceType)

    }, [screenWidth])

    useEffect(() => {
        if(language === "english"){
            setLocale("en")
        }
        if(language === "spanish"){
            setLocale("es")
        }
    }, [language])

    const embedContainerStyle = {
        position: 'relative',
        height: "100%",
        minHeight: "60vh",
        maxWidth: '100%',
      };
    
    const iframeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        };

    const handleClose = () => {
        onClose(false)
    }


    return(
        <Dialog
        fullScreen = {screenWidth < theme.breakpoints.values.sm ? true : false}
        fullWidth
        open={open}
        onClose={onClose}
        aria-labelledby="cookviewer-dialog-title"
        >
            <IconButton aria-label ="close-outlined-button" sx={{position:"absolute", right:8, top:8}} onClick={handleClose}><CloseOutlined/></IconButton>
            <DialogTitle id="cookviewer-dialog-title">
                <Typography variant="h2" color={theme.main.text.dark}>
                    {translateText("Feedback")}
                </Typography>
                

            </DialogTitle>
            <DialogContent>
                <div style={embedContainerStyle}>
                <iframe 
                    name="survey123webform"
                    title="CookViewer 3.0 Extended Feedback"
                    src={`//survey123.arcgis.com/share/640dd8fd0d064eb880b65cc3d238f87f?hide=navbar,footer&locale=${locale}&field:device_type=${deviceType}`}
                    allow="geolocation https://survey123.arcgis.com; camera https://survey123.arcgis.com"
                    style={iframeStyle}
                />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const FeedbackSearch = ({open, onClose}) => {

    const { translateText, screenWidth, language } = UseAppContext()

    
    const [ deviceType, setDeviceType ] = useState()
    const [ locale, setLocale ] = useState()

    useEffect(() => {

        if(screenWidth < theme.breakpoints.values.sm){
            setDeviceType("mobile")
        }
        else if(screenWidth < theme.breakpoints.values.md && screenWidth >= theme.breakpoints.values.sm){
            setDeviceType("tablet")
        }
        else{
            setDeviceType("desktop")
        }

        //console.log("Device type: ", deviceType)

    }, [screenWidth])

    useEffect(() => {
        if(language === "english"){
            setLocale("en")
        }
        if(language === "spanish"){
            setLocale("es")
        }
    }, [language])

    const embedContainerStyle = {
        position: 'relative',
        height: "100%",
        minHeight: "60vh",
        maxWidth: '100%',
      };
    
    const iframeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        };

    const handleClose = () => {
        onClose(false)
    }


    return(
        <Dialog
            fullScreen = {screenWidth < theme.breakpoints.values.sm ? true : false}
            fullWidth
            open={open}
            onClose={onClose}
            aria-labelledby="cookviewer-dialog-title"
        >
            <IconButton aria-label ="close-outlined-button" sx={{position:"absolute", right:8, top:8}} onClick={handleClose}><CloseOutlined/></IconButton>
            <DialogTitle id="cookviewer-dialog-title">
                <Typography variant="h2" color={theme.main.text.dark}>
                    {translateText("Search Feedback")}
                </Typography>
                

            </DialogTitle>
            <DialogContent>
                <div style={embedContainerStyle}>
                <iframe 
                    name="survey123webform"
                    title="CookViewer 3.0 Search Feedback"
                    src={`//survey123.arcgis.com/share/6c24e84d3ac24024a311b7e81045c382?hide=navbar,footer&locale=${locale}&field:device_type=${deviceType}`}
                    allow="geolocation https://survey123.arcgis.com; camera https://survey123.arcgis.com"
                    style={iframeStyle}
                />
                </div>
            </DialogContent>
        </Dialog>
    )
}



export default FeedbackDialog


export const Feedback = () => {

    const { feedbackOpen, feedbackSource, setFeedbackDialog, translateText, language, deviceType } = UseAppContext()
    const [dialogTitle, setDialogTitle] = useState(null)
    const [dialogDescription, setDialogDescription] = useState(null)
    const [feedbackUrl, setFeedbackUrl] = useState(null)
    const [locale, setLocale] = useState(null)

    useEffect(() => {
        if(language === "english"){
            setLocale("en")
        }
        if(language === "spanish"){
            setLocale("es")
        }
    }, [language])

    const handleClose = () => {

        setFeedbackDialog(false, feedbackSource)
    }

    const toggleSource = (feedbackSource) => {   
    
        switch (feedbackSource) {
            case 'search':
                setFeedbackUrl(config.feedback_search)
                setDialogTitle(translateText(`Search Feedback`));
                setDialogDescription(translateText('Help us improve your experience! Let us know how well the search and results are working for you in the parcel viewer app. Your feedback helps us make the search more accurate and efficient.'))
            break;
            case 'extended':
                setFeedbackUrl(config.feedback_extended)
                setDialogTitle(translateText('CookViewer Feedback'));
                setDialogDescription(translateText(''))
            break;
            case 'general':
                setFeedbackUrl(config.feedback_general)
                setDialogTitle(translateText('Parcel Data Feedback'));
                setDialogDescription(translateText('Tell us what you think! After selecting a search result, did the property data meet your expectations? Your feedback helps us improve accuracy and ensure you get the information you need.'))
            break;
        default:
            break;
        }
            
            
        }

    useEffect(() => {

        toggleSource(feedbackSource)

    }, [feedbackSource])

    return(
        <CalciteDialog
        scale="l"
        open={feedbackOpen}
        placement="center"
        heading={translateText(dialogTitle)}
        description={translateText(dialogDescription)}
        drag-enabled
        resizable
        onCalciteDialogClose={() => {handleClose()}}
        >
            {feedbackUrl && (
                <iframe 
                width={'100%'}
                style={{minHeight: 500}}
                height={'100%'}
                src={`${feedbackUrl}&locale=${locale}&field:device_type=${deviceType}`}
                        allow="geolocation https://survey123.arcgis.com; camera https://survey123.arcgis.com"
                />
            )   
            }

        <div slot="footer-end" style={{display: "flex", gap: '20px'}}>
            <CalciteButton 
            className='hyperlink-button' 
            onClick={() => handleClose()}
            >
                Done
            </CalciteButton>
        </div>
            

            

        </CalciteDialog>
    )
}