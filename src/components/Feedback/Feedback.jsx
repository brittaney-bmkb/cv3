import { CloseOutlined } from "@mui/icons-material"
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { theme } from "../../theme"
import { useEffect, useState } from "react"

const FeedbackDialog = ({open, onClose}) => {

    return(
        <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="feedback-dialog-title"
        aria-describedby="feedback-dialog-description"
        >
            <IconButton sx={{position:"absolute", right:8, top:8}} onClick={onClose}><CloseOutlined/></IconButton>
            <DialogTitle>Feedback</DialogTitle>
        </Dialog>
    )
}

export const FeedbackGeneral = ({open, onClose}) => {

    const { translateText, screenWidth } = UseAppContext()
    const [ deviceType, setDeviceType ] = useState()

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
        aria-labelledby="CookViewer 3.0 Simple Feedback"
        aria-describedby="CookViewer 3.0 Simple Feedback"
        >
            <IconButton sx={{position:"absolute", right:8, top:8}} onClick={handleClose}><CloseOutlined/></IconButton>
            <DialogTitle>{translateText("General Feedback")}</DialogTitle>
            <DialogContent>
                <div style={embedContainerStyle}>
                <iframe 
                    name="survey123webform"
                    title="CookViewer 3.0 Simple Feedback"
                    src={`//survey123.arcgis.com/share/ba8f1d610701420abc33612ef1d3378a?hide=navbar,footer&field:device_type=${deviceType}`}
                    allow="geolocation https://survey123.arcgis.com; camera https://survey123.arcgis.com"
                    style={iframeStyle}
                />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const FeedbackExtended = ({open, onClose}) => {

    const { translateText, screenWidth } = UseAppContext()

    const [ deviceType, setDeviceType ] = useState()

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

        console.log("Device type: ", deviceType)

    }, [screenWidth])

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
        aria-labelledby="CookViewer 3.0 Extended Feedback"
        aria-describedby="CookViewer 3.0 Extended Feedback"
        >
            <IconButton sx={{position:"absolute", right:8, top:8}} onClick={handleClose}><CloseOutlined/></IconButton>
            <DialogTitle>
                <Typography variant="h2" color={theme.main.text.dark}>
                    {translateText("Feedback")}
                </Typography>
                

            </DialogTitle>
            <DialogContent>
                <div style={embedContainerStyle}>
                <iframe 
                    name="survey123webform"
                    title="CookViewer 3.0 Extended Feedback"
                    src={`//survey123.arcgis.com/share/640dd8fd0d064eb880b65cc3d238f87f?hide=navbar,footer&field:device_type=${deviceType}`}
                    allow="geolocation https://survey123.arcgis.com; camera https://survey123.arcgis.com"
                    style={iframeStyle}
                />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export const FeedbackSearch = ({open, onClose}) => {

    const { translateText, screenWidth } = UseAppContext()

    
    const [ deviceType, setDeviceType ] = useState()

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

        console.log("Device type: ", deviceType)

    }, [screenWidth])

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
        aria-labelledby="CookViewer 3.0 Search Feedback"
        aria-describedby="CookViewer 3.0 Search Feedback"
        >
            <IconButton sx={{position:"absolute", right:8, top:8}} onClick={handleClose}><CloseOutlined/></IconButton>
            <DialogTitle>
                <Typography variant="h2" color={theme.main.text.dark}>
                    {translateText("Search Feedback")}
                </Typography>
                

            </DialogTitle>
            <DialogContent>
                <div style={embedContainerStyle}>
                <iframe 
                    name="survey123webform"
                    title="CookViewer 3.0 Search Feedback"
                    src={`//survey123.arcgis.com/share/6c24e84d3ac24024a311b7e81045c382?hide=navbar,footer&field:device_type=${deviceType}`}
                    allow="geolocation https://survey123.arcgis.com; camera https://survey123.arcgis.com"
                    style={iframeStyle}
                />
                </div>
            </DialogContent>
        </Dialog>
    )
}



export default FeedbackDialog