import { Box, Button, TextField, Typography } from "@mui/material"
import { CustomStyledTextField, radiusTypes } from "./ComparablePropertySearch"
import { useEffect, useState } from "react"
import UseAppContext from "../../contexts/AppContext"
import StyledButtonFilledPrimary from "../Button/Button"
import { theme } from "../../theme"
//import { linearUnitOptions } from "../Widgets/Measure/MeasureViewModelWidget"

export const linearUnitOptions = [
    "feet", "miles", "meters", "kilometers"
]

const CompareNearby = () => {

    const { setComparableType, searchNearbyProperties, screenWidth, setPanelPrimaryVisibility, setPanelDisplay, setPanelSecondaryVisibility, setPanelDisplaySecondary, translateText } = UseAppContext()

    const [ searchRadius, setSearchRadius ] = useState('0')
    const [ searchRadiusError, setSearchRadiusError ] = useState(false)
    const [ searchRadiusHelperText, setSearchRadiusHelperText ] = useState(false)
    const [ searchUnit, setSearchUnit ] = useState(linearUnitOptions[0])

    useEffect(() => {
        const validateSearchRadius = () => {
            if(searchUnit === "miles" && parseFloat(searchRadius) > 1){
                setSearchRadiusError(true)
                setSearchRadiusHelperText(translateText("Please enter a search radius less than or equal to 1 mile"))
            }
            else if(searchUnit === "us-feet" && parseFloat(searchRadius) > 5280){
                setSearchRadiusError(true)
                setSearchRadiusHelperText(translateText("Please enter a search radius less than or equal to 5280 feet"))
            }
            else if(searchUnit === "kilometers" && parseFloat(searchRadius) > 1.60934){
                setSearchRadiusError(true)
                setSearchRadiusHelperText(translateText("Please enter a search radius less than or equal to 1.60934 kilometers"))
            }
            else if(searchUnit === "meters" && parseFloat(searchRadius) > 1609.34){
                setSearchRadiusError(true)
                setSearchRadiusHelperText(translateText("Please enter a search radius less than or equal to 1609.34 meters"))
            }
            else if(searchUnit === "yards" && parseFloat(searchRadius) > 1760){
                setSearchRadiusError(true)
                setSearchRadiusHelperText(translateText("Please enter a search radius less than or equal to 1760 yards"))
            }
            else{
                setSearchRadiusError(false)
                setSearchRadiusHelperText("")
            }
        }

        validateSearchRadius()
    }, [searchRadius, searchUnit])

    function handleInput(event){
        //console.log("nearby value: ", event)
        setSearchRadius(event.target.value)
    }

    function handleSearchRadius(){

        setComparableType("nearby")
        
        //console.log("nearby value: ", searchRadius)

        if(!searchRadiusError){
            searchNearbyProperties(searchRadius, searchUnit)
        }
        

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
            <Typography variant="body1">
                {translateText(radiusLabel)}
            </Typography>
        </option>
    ))

    const units = linearUnitOptions
    .map((unit) => (
        <option key={unit} value={unit}>
            <Typography variant="body1">
                {translateText(unit)}
            </Typography>
        </option>
    ))

    return(
        <Box display="flex" flexDirection="column" p={2} rowGap={1} component="form" flexGrow={1} minHeight={0} alignItems="center">
            <Typography variant="body1">
                 {translateText("Select surrounding parcels within")}: 
            </Typography>
            <Box display="flex" columnGap={2} alignItems="start" justifyContent="end">
            <CustomStyledTextField
            id="search-radius"
            required
            variant="outlined" 
            fullWidth 
            margin="dense" 
            size="small"
            type="text"
            defaultValue={'0'}
            error={searchRadiusError}
            helperText={searchRadiusHelperText}
            value={searchRadius}
            onInput={handleInput}
            />
                    {/* {radiusDropdownOptions}
                </CustomStyledTextField> */}
            {/* <Typography variant="body1">
                 {translateText("miles")} 
            </Typography> */}
            <CustomStyledTextField 
                select
                id={"radius-type"}
                variant="outlined" 
                fullWidth 
                margin="dense" 
                size="small"
                type="text"
                onChange={(event) => {
                    //console.log("search unit: ", event.target.value)
                    setSearchUnit(event.target.value)
                }}
                SelectProps={{
                    native: true,
                  }}
                >
                    {units}
                </CustomStyledTextField>
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