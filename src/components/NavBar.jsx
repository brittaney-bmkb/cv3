import { AppBar, styled, Box, Toolbar, Typography, Avatar, Stack, IconButton, Button } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import Search from "./Search"
import BlueButton from "./Button"

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between"
})


const NavBar = () => {
    return(
            <AppBar position="sticky">
                <StyledToolbar>
                    <Stack direction={{xs:'column', sm:'row'}} justifyContent="space-between" width='100%' spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2, display:{xs: 'block', sm: 'none'} }}
                        >
                            <MenuIcon />
                        </IconButton>
               
                        <Box display="flex" flexDirection="row" flex={0} width='auto'>
                        <Avatar sx={{bgcolor:"orange"}}/>    
                            <Typography variant="h6">CookViewer</Typography>
                        </Box>
                        <Button variant="secondary" sx={{display:{xs:'block', sm:'none'}}}>Button</Button>
                        </Stack>
                        <Search/>
                    </Stack>
                </StyledToolbar>
            </AppBar>
    )
}

export default NavBar