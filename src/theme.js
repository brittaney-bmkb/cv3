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
            light: "#00A5B8",
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
            fontSize: 36,
            fontWeight:"bold",
        },
        h2: {
            fontSize: 20,
            fontWeight:400,
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
        h6: {
            fontSize: 15,
            fontWeight:500
        },
        body1: {
            fontSize: 15
        },
        body2: {
            fontSize: 15
        },
        subtitle1: {
            fontSize: 12,
            fontWeight:400
        },
        subtitle2: {
            fontSize: 14,
            fontWeight:500
        },
        hyperLink:{
            fontSize: 14,
            fontWeight:500
        }
    }
})

theme.typography.subtitle1 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 12,
        fontWeight:400,
        
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 11,
        fontWeight:400
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 10,
        fontWeight:400
    }
}

theme.typography.h1 = {
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

theme.typography.h2 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 20,
        fontWeight:500,
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 18,
        fontWeight:500,
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        fontWeight:500,
    }
}

theme.typography.h3 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 18,
        fontWeight: 600,
        //color: theme.main.text.dark
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 17,
        fontWeight: 600,
        //color: theme.main.text.dark
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        fontWeight: 600,
        //color: theme.main.text.dark
    }
}

theme.typography.h4 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 18,
        fontWeight: 700,
        color: theme.main.text.dark
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 17,
        fontWeight: 700,
        color: theme.main.text.dark
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        fontWeight: 700,
        color: theme.main.text.dark
    }
}

theme.typography.h5 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 16,
        fontWeight: 600,
        //color: theme.main.text.dark
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 15,
        fontWeight: 600,
        //color: theme.main.text.dark
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 14,
        fontWeight: 500,
        //color: theme.main.text.dark
    }
}

theme.typography.h6 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 15,
        fontWeight: 500,
        color: theme.palette.info.dark
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 14,
        fontWeight: 500,
        color: theme.palette.info.dark
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 13,
        fontWeight: 500,
        color: theme.palette.info.dark
    }
}

theme.typography.body1 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 16,
        color: theme.main.text.dark
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 15,
        color: theme.main.text.dark
    },
    // [theme.breakpoints.down('sm')]: {
    //     fontSize: 20
    // }
}

theme.typography.body2 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 15,
        fontWeight: 500,
        
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 14,
        fontWeight: 500,

    },
    // [theme.breakpoints.down('sm')]: {
    //     fontSize: 20
    // }
}