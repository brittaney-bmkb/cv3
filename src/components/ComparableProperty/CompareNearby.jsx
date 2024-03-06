import { Box, Button, TextField, Typography } from "@mui/material"
import { CustomStyledTextField, radiusTypes } from "./ComparablePropertySearch"
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
        console.log("nearby value: ", searchRadius)
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

    const radiusDropdownOptions = Object.entries(radiusTypes)
    .filter(([radiusLabel, radiusValue]) => (radiusLabel !== "None"))
    .map(([radiusLabel, radiusValue]) => (
        <option key={radiusLabel} value={radiusValue}>
            <Typography variant="body1" fontFamily="barlow">
                {translateText(radiusLabel)}
            </Typography>
        </option>
    ))

    return(
        <Box display="flex" flexDirection="column" p={2} rowGap={1} component="form"  flexGrow={1} minHeight={0}>
            <Typography variant="body1">
                 {translateText("Select surrounding parcels within")}: 
            </Typography>
            <Box display="flex" columnGap={2} alignItems="center" justifyContent="end">
            <CustomStyledTextField 
                select
                id={"radius-type"}
                variant="outlined" 
                fullWidth 
                margin="dense" 
                size="small"
                type="text"
                onChange={(event) => {
                    console.log("radius event: ", event.target.value)
                    setSearchRadius(parseFloat(event.target.value))
                }}
                SelectProps={{
                    native: true,
                  }}
                >
                    {radiusDropdownOptions}
                </CustomStyledTextField>
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