import { CloseRounded } from "@mui/icons-material"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { theme } from "../../theme"

const PanelHeader = ( {text} ) => {

    // const { }

    return(
        <Box display="flex" flexDirection="column">
            <Stack direction="row">
                <Box display="flex" flex={1} alignItems="center" justifyContent="space-around">
                    <Box bgcolor={theme.main.backgroundColor.grey} p={1} sx={{borderRadius: theme.shape.borderRadius}}>
                        <Typography variant="h4" color={theme.main.text.dark}>{text}</Typography>
                        </Box>
                </Box>
                {/* <IconButton sx={{display:"flex", flexDirection:"column"}}>
                    <CloseRounded fontSize="small" sx={{color:theme.main.text.dark}}/>
                    <Typography variant="subtitle1" color={theme.main.text.dark}>Close</Typography>
                </IconButton> */}
            </Stack>
            <Stack direction="row">

            </Stack>
        </Box>
    )
}

export default PanelHeader