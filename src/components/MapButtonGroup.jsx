import { Box, Button, Stack } from "@mui/material"
import { theme } from "../theme"

const MapButtonGroup = () => {
    return(
        <Stack direction="row" position="absolute" spacing={1} padding={2} zIndex={100}>
            <Button variant="contained" sx={{bgcolor:theme.palette.primary}}>Button</Button>
            <Button variant="contained" sx={{bgcolor:theme.palette.primary}}>Button</Button>
            <Button variant="contained" sx={{bgcolor:theme.palette.primary}}>Button</Button>
            <Button variant="contained" sx={{bgcolor:theme.palette.primary}}>Button</Button>
        </Stack>
    )
}

export default MapButtonGroup