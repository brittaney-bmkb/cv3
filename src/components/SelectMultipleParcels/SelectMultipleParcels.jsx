import { Box, Button, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react";
import StyledButtonFilledPrimary from "../Button/Button";
import { CalciteIcon } from "@esri/calcite-components-react";

const descriptions = (state) => {
    switch (state) {
        case 'selectMultiple':
            return 'Click in the map to select parcels. Click on a selected parcel to deselect';
        case 'draw':
            return 'Click points in the map to draw an area and select parcels.';
        default:
            return 'Use the tools below to select multiple parcels in the map. You can either click to select or deselect individual parcels or draw an area to select all parcels within it';
    }
}


// this lifted from comparable property search and will needed to be updated for this widget
const SelectMultipleParcels = () => {

    const { translateText, setSelectMultiple, selectMultiple } = UseAppContext()

    const [ tool, setTool ] = useState(null)
    const [ isTooltipVisible, setTooltipVisible ] = useState(false);
    const [ toolDescription, setToolDescription ] = useState(false);


    const handleSelectClick = () => {

        setTool('click')
        setSelectMultiple(!selectMultiple)
        setToolDescription('selectMultiple')
    }

    const handleSelectDraw = () => {

        setTool('draw')
        setSelectMultiple(!selectMultiple)
        setToolDescription('draw')
    }

    // useEffect(() => {

    //     if(selectMultiple){
    //         setToolDescription('selectMultiple')
    //     }
    //     else{
    //         setToolDescription(null)
    //     }
    
    // },[selectMultiple])

    return(
        <Box display="flex" flexDirection="column" rowGap={2}>

            {/* <Tooltip isTooltipVisible={isTooltipVisible} content={"test"}/> */}


            <Stack direction="row" justifyContent="space-between">

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
                onClick={handleSelectDraw}
                >   
                    <CalciteIcon icon="pencil"/>
                    <Typography
                    variant="body1"
                    >
                        {translateText("Draw")}
                    </Typography>
                </Button>

            </Stack>

            <Typography variant="body1" sx={{height: 125}}>
                {descriptions(toolDescription)}
            </Typography>

           
        </Box>
        
    )
}

export default SelectMultipleParcels