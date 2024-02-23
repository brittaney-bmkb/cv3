import { Box } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()


    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2}>

        </Box>
        
    )
}

export default MeasureWidget