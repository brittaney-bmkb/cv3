import { createTheme } from "@mui/material";

export const theme = createTheme({
    main: {
        backgroundColor:{
            light: "#59BDE7",
            dark:"#f5f5f5",
            grey:"#BEB7B3"
        },
        text:{
            dark:"#111111",
            light:"#59BDE7"
        }
    },
    palette:{
        primary:{
            main:"#0D4D96",
            light: "#59BDE7",
            contrastText:"#f5f5f5",
        },
        secondary:{
            main:"#B6006A",
        },
        info:{
            main:"#928884",
            light:"#BEB7B3",
            dark:"#72635D"
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
            fontSize: 30,
            fontWeight:"bold",
        },
        h3: {
            fontSize: 18,
            fontWeight:"bold",
        },
        h4: {
            fontSize: 16,
            fontWeight:700
        },
        h5: {
            fontSize: 16,
            fontWeight:500
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
        fontSize: 36
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
        fontSize: 30
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
        fontSize: 16
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 15
    },
    // [theme.breakpoints.down('sm')]: {
    //     fontSize: 20
    // }
}