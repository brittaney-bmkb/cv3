import { CloseRounded } from "@mui/icons-material"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import { theme } from "../../theme"

const PanelHeader = ( {text} ) => {
    return(
        <Box display="flex" flexDirection="column">
            <Stack direction="row">
                <Box display="flex" flex={1} alignItems="center" justifyContent="space-around">
                    <Box bgcolor={theme.palette.info.light} p={1} sx={{borderRadius: theme.shape.borderRadius}}>
                        <Typography variant="h4">{text}</Typography>
                        </Box>
                </Box>
                <IconButton sx={{display:"flex", flexDirection:"column"}}>
                    <CloseRounded fontSize="small" sx={{color:''}}/>
                    <Typography variant="subtitle1">Close</Typography>
                </IconButton>
            </Stack>
        </Box>
    )
}

export default PanelHeader