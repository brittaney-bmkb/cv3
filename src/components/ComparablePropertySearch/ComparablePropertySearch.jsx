import { Box, Divider, TextField, Typography } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import styled from "@emotion/styled";
import { useState } from "react";

const textFieldWidth = 175

const CustomStyledTextField = styled(TextField)({
    '& .MuiInputBase-input': {
      height: 20,
      padding: 5,
      paddingLeft: 10
    },
    display: 'flex',
    width: "100%",
    maxWidth: 150 // You can set the width as per your requirements
  });

const presetTextFields = {
    "Source Pin":"PIN14",
    "Township": "township_name",
    "Neighborhood": "NBHD",
    "Property Class": "class_info_display"
}

const constructionTypes = [
    "Any",
    "None",
    "Frame",
    "Masonry",
    "Frame and Masonry",
    "Stucco"
]


const ComparablePropertySearch= () => {

    const { searchComparableProperties, primaryResultFeature } = UseAppContext()

    const [ buildingSqFtMin, setBuildingSqFtMin ] = useState(null)
    const [ buildingSqFtMax, setBuildingSqFtMax ] = useState(null)

    const [ landSqFtMin, setLandSqFtMin ] = useState(null)
    const [ landSqFtMax, setLandSqFtMax ] = useState(null)

    function handleInput(inputType, event){

        let value = event.target.text
        console.log("handling new input: ", event)

        switch (inputType) {
            case "building sqft min":
                setBuildingSqFtMin(value);
            case "building sqft max":
                setBuildingSqFtMax(value);
            case "land sqft min":
                setLandSqFtMin(value);
            case "land sqft max":
                setLandSqFtMax(value);          
            default:
                null;
        } 
    }

    function handleClick(){
        searchComparableProperties()
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2} component="form" sx={{overflowY:"scroll"}} flex={1} minHeight={0} pb="150px"> 
            <Typography variant="h4">
                Source Property
            </Typography>
            {Object.entries(presetTextFields).map(([key, value]) => (
                <Box key={value} id={value} display="flex" height={20} alignItems="center" pt={1} columnGap={2} >
                <Box display="flex" flex={1}>
                    <Typography variant="body2">{key}</Typography>
                </Box>
                <CustomStyledTextField 
                id={value}
                variant="outlined" 
                fullWidth 
                margin="dense" 
                size="small"
                type="text"
                InputProps={{
                    readOnly: true,
                  }}
                value={primaryResultFeature.attributes[value] ?? ""}
                />
                </Box>
            ))}
            <Divider/>
            <Typography variant="h4">Property Size</Typography>
            <Box display="flex" flexDirection="column">
            <Typography variant="body2">Building Square Feet</Typography>
            <Box display="flex" flexDirection="row" alignItems="center" columnGap={1}>
                  <CustomStyledTextField
                  id="building-sqft-min"
                  variant="outlined" 
                  fullWidth 
                  margin="dense" 
                  size="small"
                  type="text"
                  value={buildingSqFtMin ? `${buildingSqFtMin} sqft` :  `${0} sqft`}
                  onInput={(event) => {
                    handleInput("building sqft min", event)
                  }}
                  />
                  <Typography variant="body2">to</Typography>
                  <CustomStyledTextField
                  id="building-sqft-max"
                  variant="outlined" 
                  fullWidth 
                  margin="dense" 
                  size="small"
                  type="text"
                  value={buildingSqFtMax ? `${buildingSqFtMax} sqft`:  `${0} sqft`}
                  onInput={(event) => {
                    handleInput("building sqft max", event)
                  }}
                  />
            </Box>

            <Typography variant="body2">Land Square Feet</Typography>
            <Box display="flex" flexDirection="row" alignItems="center" columnGap={1}>
                  <CustomStyledTextField
                  id="land-sqft-min"
                  variant="outlined" 
                  fullWidth 
                  margin="dense" 
                  size="small"
                  type="text"
                  value={landSqFtMin ? `${landSqFtMin} sqft`:  `${0} sqft`}
                  onInput={(event) => {
                    handleInput("land sqft min", event)
                  }}
                  />
                  <Typography variant="body2">to</Typography>
                  <CustomStyledTextField
                  id="land-sqft-max"
                  variant="outlined" 
                  fullWidth 
                  margin="dense" 
                  size="small"
                  type="text"
                  value={landSqFtMax ? `${landSqFtMax} sqft`: `${0} sqft`}
                  onInput={(event) => {
                    handleInput("land sqft max", event)
                  }}
                  />
            </Box>
            </Box>
            <Divider/>
            <Typography variant="h4">Characteristics</Typography>
            <Box>
            <Box id="characteristics" display="flex" height={20} alignItems="center" pt={1} columnGap={2} >
                <Box display="flex" flex={1}>
                    <Typography variant="body2" width={122}>Construction Type</Typography>
                </Box>
                <CustomStyledTextField 
                select
                id={"construction-type"}
                variant="outlined" 
                fullWidth 
                margin="dense" 
                size="small"
                type="text"
                SelectProps={{
                    native: true,
                  }}
                >
                    {constructionTypes.map((constructionType) => (
                        <option key={constructionType} value={constructionType}>
                            <Typography variant="body1">
                                {constructionType}
                            </Typography>
                        </option>
                    ))}
                </CustomStyledTextField>
                </Box>
            </Box>
            
            
            <StyledButtonFilledPrimary text={"Search"} onClick={handleClick} />
        </Box>
        
    )
}

export default ComparablePropertySearch