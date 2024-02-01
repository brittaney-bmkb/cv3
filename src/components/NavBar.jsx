import { AppBar, styled, Box, Toolbar, Typography, Avatar, Stack, IconButton, Button, Link } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import Search from "./Search/Search"
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
                    <Stack direction={{xs:'column', sm:'row'}} justifyContent="space-between" alignItems="center" width='100%' gap={2}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2, display:{xs: 'block', sm: 'none'}, left:10, top:0, position:"absolute"}}
                            >
                                <MenuIcon fontSize="large"/>
                            </IconButton>
                        <Stack direction="row" alignItems='center' flex={1} width="auto">
                            
               
                            <Stack direction="row" alignContent="center" gap={1} height='100%' width="auto">
                                <Avatar sx={{bgcolor:"orange"}}/>    
                                <Typography variant="h6">CookViewer</Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={2} flex={5} padding={2}>
                            <Search/>
                            <Stack flex={5} direction="row" alignItems="center" gap={2} display={{xs:'none', sm:'none', md:'flex' }}>
                            <Link>
                            <Typography color="white">
                                Page Link
                            </Typography>
                            </Link>
                            <Link>
                            <Typography color="white">
                                Page Link
                            </Typography>
                            </Link>
                            <Link>
                            <Typography color="white">
                                Page Link
                            </Typography>
                            </Link>
                            </Stack>
                            
                        </Stack>
                        
                        <Stack direction="row" gap={2}> 
                            <Button variant="secondary" sx={{display:{xs:'none', sm:'block'}}}>Button</Button>
                            <Button variant="secondary" sx={{display:{xs:'none', sm:'block'}}}>Button</Button>
                        </Stack>
                        
                    </Stack>
                </StyledToolbar>
            </AppBar>
    )
}

export default NavBar