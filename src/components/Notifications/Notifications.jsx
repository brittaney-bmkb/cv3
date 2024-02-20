import { Box, Typography } from "@mui/material"
import { theme } from "../../theme"
import { config } from "../../data/config"

const Notifications = () => {
    return(
        <Box bgcolor={config.bannerColor} alignItems="center" justifyContent="center" width="100%">
            <Typography 
            variant="h4" 
            align="center" 
            p={1}>
                {config.bannerMessage}
            </Typography>
        </Box>
    )
}

export default Notifications