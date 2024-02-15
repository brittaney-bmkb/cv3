import { Box, Button, Divider, TextField, Typography } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import styled from "@emotion/styled";
import { useState } from "react";

const textFieldWidth = 175

export const CustomStyledTextField = styled(TextField)({
    '& .MuiInputBase-input': {
      height: 22,
      padding: 2,
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
    "Property Class": "BCLASS"
}

const constructionTypes = [
    "Any",
    "None",
    "Frame",
    "Masonry",
    "Frame and Masonry",
    "Stucco"
]

const radiusTypes = {
    "None": "None",
    "Mile": 1,
    "Half Mile": .5,
    "Quarter Mile": .25,
    "Eigth Mile": 125,
}



const ComparablePropertySearch= () => {

    const { searchComparableProperties, primaryResultFeature } = UseAppContext()

    const [ buildingSqFtMin, setBuildingSqFtMin ] = useState(0)
    const [ buildingSqFtMax, setBuildingSqFtMax ] = useState(0)

    const [ landSqFtMin, setLandSqFtMin ] = useState(0)
    const [ landSqFtMax, setLandSqFtMax ] = useState(0)

    const [constructionType, setConstructionType] = useState(constructionTypes[0])

    const [ ageMax, setAgeMax ] = useState(0)
    const [ ageMin, setAgeMin ] = useState(0)

    const [radiusType, setRadiusType] = useState(Object.keys(radiusTypes)[0])

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
            case "construction type":
                let constructionValue = event.target.value 
                setConstructionType(constructionValue);    
            case "age min":
                setAgeMin(value);
            case "age max":
                setAgeMax(value); 
            case "radius type":
                let radiusValue = event.target.value 
                setRadiusType(radiusValue); 
            default:
                null;
        } 
    }

    function handleClick(){
        searchComparableProperties()
    }

    function handleSetQuery(){
        let constructionTypeSelect = constructionType === 'Any' ? '*': constructionType
        let bClass = '200'
        let query =`township_name = '${primaryResultFeature.attributes['township_name']}' AND
        NBHD = '${primaryResultFeature.attributes['NBHD']}' AND BCLASS = '${bClass}'
                    AND (BLDGSQFT >= ${buildingSqFtMin} AND BLDGSQFT <= ${buildingSqFtMax} ) 
                    AND (LANDSF >= ${landSqFtMin} AND LANDSF <= ${landSqFtMax} )  
                    AND (BLDGAGE >= ${ageMin} AND BLDGAGE <= ${ageMax} )
                    AND PIN14 <> '${primaryResultFeature.attributes['PIN14']}'`
        
        query = constructionTypeSelect !== 'None' ? query + `AND bldg_const_desc = '${constructionTypeSelect}'`: query

        console.log("Comparable query = ", query)

        searchComparableProperties(query, searchDistance)
        return query
    }

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2} component="form" sx={{overflowY:"scroll"}} flex={1} minHeight={0} pb="100px"> 
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
                  required
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
                  required
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
                  required
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
                  required
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
            <Box display="flex" flexDirection="column" rowGap={1}>
            <Box id="characteristics" display="flex" height={20} alignItems="center" pt={1} columnGap={2} >
                <Box display="flex" flex={1}>
                    <Typography variant="body2" width={122}>Construction Type</Typography>
                </Box>
                <CustomStyledTextField 
                select
                required
                id={"construction-type"}
                variant="outlined" 
                fullWidth 
                margin="dense" 
                size="small"
                type="text"
                onChange={(event) => {
                    handleInput("construction type", event)
                }}
                SelectProps={{
                    native: true,
                  }}
                >
                    {constructionTypes.map((constructionType) => (
                        <option key={constructionType} value={constructionType}>
                            <Typography variant="body1" fontFamily="barlow">
                                {constructionType}
                            </Typography>
                        </option>
                    ))}
                </CustomStyledTextField>
                </Box>
                <Box id="building-age" display="flex" flexDirection="column" pt={1} columnGap={2} >
                    <Box display="flex" flex={1}>
                        <Typography variant="body2" width={122}>Building Age</Typography>
                    </Box>
                        <Box display="flex" flexDirection="row" alignItems="center" columnGap={1}>
                        <CustomStyledTextField
                        required
                        id="age-min"
                        variant="outlined" 
                        fullWidth 
                        margin="dense" 
                        size="small"
                        type="text"
                        value={ageMin ? `${ageMin} years`:  `${0} years`}
                        onInput={(event) => {
                            handleInput("age min", event)
                        }}
                        />
                        <Typography variant="body2">to</Typography>
                        <CustomStyledTextField
                        required
                        id="age-max"
                        variant="outlined" 
                        fullWidth 
                        margin="dense" 
                        size="small"
                        type="text"
                        value={ageMax ? `${ageMax} years`: `${0} years`}
                        onInput={(event) => {
                            handleInput("age max", event)
                        }}
                        />
                    </Box>
                </Box>
                
            </Box>
            <Box display="flex" flexDirection="column">
            <Box display="flex" flex={1}>
                    <Typography variant="body2" width={122}>Search Radius</Typography>
                </Box>
                <CustomStyledTextField 
                select
                id={"radius-type"}
                variant="outlined" 
                fullWidth 
                margin="dense" 
                size="small"
                type="text"
                onChange={(event) => {
                    handleInput("radius type", event)
                }}
                SelectProps={{
                    native: true,
                  }}
                >
                    {Object.entries(radiusTypes).map(([radiusLabel, radiusValue]) => (
                        <option key={radiusLabel} value={radiusValue}>
                            <Typography variant="body1" fontFamily="barlow">
                                {radiusLabel}
                            </Typography>
                        </option>
                    ))}
                </CustomStyledTextField>

            </Box>

            <Divider/>
            
            <Box display="flex" width="100%" justifyContent="end" alignItems="center" columnGap={2}>
                <Button variant="text" sx={{textTransform:"none"}}>
                    <Typography variant="body1">Cancel</Typography>
                </Button>
                <StyledButtonFilledPrimary text={"Search"} onClick={handleSetQuery} textVarient={"body1"}/>
            </Box>
            
        </Box>
        
    )
}

export default ComparablePropertySearch