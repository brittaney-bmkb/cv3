import { Box, Button, TextField, Typography } from "@mui/material"
import { CustomStyledTextField } from "./ComparablePropertySearch"
import { useState } from "react"
import UseAppContext from "../../contexts/AppContext"
import StyledButtonFilledPrimary from "../Button/Button"
import { theme } from "../../theme"

const CompareNearby = () => {

    const { searchNearbyProperties, screenWidth, setPanelPrimaryVisibility, setPanelDisplay, setPanelSecondaryVisibility, setPanelDisplaySecondary, translateText } = UseAppContext()

    const [ searchRadius, setSearchRadius ] = useState(0)

    function handleInput(event){
        console.log("nearby value: ", event)
        setSearchRadius(event.target.value)
    }

    function handleSearchRadius(){
        searchNearbyProperties(searchRadius)

        if(screenWidth < theme.breakpoints.values.lg){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("resultsListNearby")
        }
        else if (screenWidth >= theme.breakpoints.values.lg){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary("resultsListNearby")
        }
        
    }

    return(
        <Box display="flex" flexDirection="column" p={2} rowGap={1} component="form"  flexGrow={1} minHeight={0}>
            <Typography variant="body1">
                 {translateText("Select surrounding parcels within")}: 
            </Typography>
            <Box display="flex" columnGap={2} alignItems="center" justifyContent="end">
            <CustomStyledTextField
            id="search-radius"
            required
            variant="outlined" 
            fullWidth 
            margin="dense" 
            size="small"
            type="number"
            value={searchRadius}
            onInput={handleInput}
            />
            <Typography variant="body1">
                 {translateText("miles")} 
            </Typography>
            </Box>

            <Box display="flex" width="100%" justifyContent="end" alignItems="center" columnGap={2}>
                <Button variant="text" sx={{textTransform:"none"}}>
                    <Typography variant="body1">{translateText("Cancel")}</Typography>
                </Button>
                <StyledButtonFilledPrimary text={translateText("Search")} onClick={handleSearchRadius} textVarient={"body1"}/>
            </Box>
            
            
        </Box>
    )
}

export default CompareNearby