import { CloseOutlined } from "@mui/icons-material"
import { Dialog, DialogTitle, IconButton } from "@mui/material"

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

export default FeedbackDialog