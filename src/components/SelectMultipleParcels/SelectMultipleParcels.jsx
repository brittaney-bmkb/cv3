import { Box, Button, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react";
import StyledButtonFilledPrimary from "../Button/Button";
import { CalciteIcon } from "@esri/calcite-components-react";



// this lifted from comparable property search and will needed to be updated for this widget
const SelectMultipleParcels = () => {

    const { translateText, setSelectMultiple } = UseAppContext()

    const [ tool, setTool ] = useState(null)

    const handleSelectClick = () => {

        setTool('click')
        setSelectMultiple(true)
    }


    useEffect(() => {
    
    },[])

    return(
        <Box display="flex" flexDirection="row" columnGap={1}>
            <Button
            variant="contained"
            color="primary"
            sx={{textTransform:"none", display:"flex", flexDirection:"row", columnGap:1}}
            onClick={handleSelectClick}
            >   
                <CalciteIcon icon="select"/>
                <Typography
                variant="body1"
                >
                    {translateText("Click")}
                </Typography>
            </Button>

            <Button
            variant="contained"
            color="primary"
            sx={{textTransform:"none", display:"flex", flexDirection:"row", columnGap:1}}
            >   
                <CalciteIcon icon="pencil"/>
                <Typography
                variant="body1"
                >
                    {translateText("Draw")}
                </Typography>
            </Button>
        </Box>
        
    )
}

export default SelectMultipleParcels