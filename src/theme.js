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
        borderRadius: '20px'
    }
})