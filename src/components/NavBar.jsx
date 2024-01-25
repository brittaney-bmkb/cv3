import { AppBar, styled, Box, Toolbar, Typography, Avatar, Stack, IconButton, Button } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import Search from "./Search"
import BlueButton from "./Button"

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 10
})

const NavBar = () => {
    return(
            <AppBar position="sticky">
                <StyledToolbar>
                    <Stack direction={{xs:'column', sm:'row'}} justifyContent="space-between" alignItems="center" width='100%' spacing={2}>
                        <Stack direction="row" alignItems='center'>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2, display:{xs: 'block', sm: 'none'}, position:"absolute" }}
                            >
                                <MenuIcon />
                            </IconButton>
               
                            <Stack direction="row" alignContent="center" spacing={1} height='100%'>
                                <Avatar sx={{bgcolor:"orange"}}/>    
                                <Typography variant="h6">CookViewer</Typography>
                            </Stack>
                        </Stack>
                        <Search/>
                        <Stack direction="row" spacing={2}> 
                            <Button variant="secondary" sx={{display:{xs:'none', sm:'block'}}}>Button</Button>
                            <Button variant="secondary" sx={{display:{xs:'none', sm:'block'}}}>Button</Button>
                        </Stack>
                        
                    </Stack>
                </StyledToolbar>
            </AppBar>
    )
}

export default NavBar