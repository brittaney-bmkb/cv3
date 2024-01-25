import { Box } from "@mui/material"
import ResultsList from "./ResultsList"

const PanelRight = () => {
    <Box bgcolor="blueviolet" flex={1} flexDirection="column" sx={{display:{xs:'none', sm:'block'}}}>
            <ResultsList/>
    </Box>
}


export default PanelRight