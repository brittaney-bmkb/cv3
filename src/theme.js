import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette:{
        primary:{
            main:"#0D4D96",
            light: "#59C5D1"
        },
        secondary:{
            main:"#B6006A"
        },
        otherColor:{
            main:"#72635D"
        }
    },
    shape: {
        borderRadius: 20
    },
    typography: {
        h1: {
            fontSize: 40,
            fontWeight:"bold",
        },
        h2: {
            fontSize: 36,
            fontWeight:"bold",
        },
        h3: {
            fontSize: 18
        },
        body1: {
            fontSize: 15
        },
        subtitle1: {
            fontSize: 14
        }
    }
})

//Response font size for nav bar
theme.typography.h1 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 40
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 30
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 24
    }
}

theme.typography.h2 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 36
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 24
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 20
    }
}

theme.typography.body1 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 15
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 14
    },
    // [theme.breakpoints.down('sm')]: {
    //     fontSize: 20
    // }
}