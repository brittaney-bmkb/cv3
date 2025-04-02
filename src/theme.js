import { createTheme } from "@mui/material";

export const theme = createTheme({
    layers: {
        primary: {
            type: "simple-fill",
            style: "solid",
            color: [ 13, 77, 150, 0.0 ],
            opacity: 0.05,
            outline: {
                width:5,
                color: "#0D4D96",
            }
        },
        secondary: {
            type: "simple-fill",
            color: [ 255, 128, 0, 0 ],
            outline: {
                width:5,
                style: "short-dot",
                color: "#BD4B00",
            }
        },
        secondarySelected: {
            type: "simple-fill",
            color: [ 255, 128, 0, 0 ],
            outline: {
                width:5,
                color: "#BD4B00",
            }
        }
    },
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
    measureGraphics:{
        line:{
            color: [162, 0, 255, 1],
            width: 6
        },
        polygon:{
            color: [245, 0, 127, 0.1],
        },
        polygonOutline:{
            color: [245, 0, 127, 1],
            width: 5
        }
    },    
    palette:{
        primary:{
            main:"#0D4D96",
            light: "#009ADA",
            contrastText:"#f5f5f5",
            dark:"#071943",
            complementary:"#96560d"
        },
        secondary:{
            main:"#BD4B00",
            light:"#F5D2C2"
        },
        info:{
            main:"#928884",
            light:"#BEB7B3",
            dark:"#72635D"
        },
        accessibilityButton:{
            main:"#b3d1ff",
            light:"#eff5ff",
            dark:"#475366",
            complementary:"#ffe1b3",
        },
        accessibilityText:{
            main:"#928884",
            light:"#ffffff",
            dark:"#000000"
        },          
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
            fontWeight:400
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
        fontSize: ".7rem",
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
        //color: theme.main.text.dark
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 17,
        fontWeight: 700,
        ///color: theme.main.text.dark
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 16,
        fontWeight: 700,
        //color: theme.main.text.dark
    }
}

theme.typography.h5 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 15,
        fontWeight: 600,
        //color: theme.main.text.dark
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 14,
        fontWeight: 500,
        //color: theme.main.text.dark
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 13.5,
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
        fontSize: 13.5,
        fontWeight: 500,
        color: theme.palette.info.dark
    }
}

theme.typography.body1 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 14,
        
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 13,
        
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: ".75rem"
    }
}

theme.typography.body2 = {
    [theme.breakpoints.up('md')]: {
        fontSize: 15,
        fontWeight: 600,
        
    },
    [theme.breakpoints.down('md')]: {
        fontSize: 14,
        fontWeight: 600,

    },
    [theme.breakpoints.down('sm')]: {
        fontSize: 13,
        fontWeight: 600,
    }
}