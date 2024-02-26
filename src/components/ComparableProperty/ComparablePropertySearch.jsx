import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { theme } from "../../theme";

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
    "Eigth Mile": .125,
}



const ComparablePropertySearch= () => {

    const { searchComparableProperties, primaryResultFeature } = UseAppContext()

    const [ buildingSqFtMin, setBuildingSqFtMin ] = useState(null)
    const [ buildingSqFtMax, setBuildingSqFtMax ] = useState(null)
    const [ buildingSqFtMinError, setBuildingSqFtMinError ] = useState(null)
    const [ buildingSqFtMaxError, setBuildingSqFtMaxError ] = useState(null)

    const [ landSqFtMin, setLandSqFtMin ] = useState(null)
    const [ landSqFtMax, setLandSqFtMax ] = useState(null)
    const [ landSqFtMinError, setLandSqFtMinError ] = useState(null)
    const [ landSqFtMaxError, setLandSqFtMaxError ] = useState(null)

    const [constructionType, setConstructionType] = useState(constructionTypes[0])

    const [ ageMax, setAgeMax ] = useState(null)
    const [ ageMin, setAgeMin ] = useState(null)
    const [ ageMaxError, setAgeMaxError ] = useState(null)
    const [ ageMinError, setAgeMinError ] = useState(null)

    const [radius, setRadius] = useState(null)

    const [errorMessage, setErrorMessage] = useState(false)

    function handleSetQuery(){
        //AND BCLASS = '${bClass}'
        let query =`township_name = '${primaryResultFeature.attributes['township_name']}' AND NBHD = ${primaryResultFeature.attributes['NBHD']} AND BCLASS = '${primaryResultFeature.attributes['BCLASS']}' AND (BLDGSQFT >= ${buildingSqFtMin} AND BLDGSQFT <= ${buildingSqFtMax}) AND (LANDSF >= ${landSqFtMin} AND LANDSF <= ${landSqFtMax} ) AND (BLDGAGE >= ${ageMin} AND BLDGAGE <= ${ageMax} ) AND PIN14 <> '${primaryResultFeature.attributes['PIN14']}'`
        
        query = ['None','Any'].includes(constructionType) ? query :  query + ` AND bldg_const_desc = '${constructionType}'`

        console.log("Comparable query = ", query, radius)

        searchComparableProperties(query,radius)

        return query
    }

    useEffect(() => {
        //set ranges for building, land, and age based on primary parcel

        if(primaryResultFeature){
            let attributes = primaryResultFeature.attributes

            let parcelBldgSqFt = attributes["BLDGSQFT"]
            let buildingRange= parcelBldgSqFt * .1
            setBuildingSqFtMax(parcelBldgSqFt+buildingRange)
            setBuildingSqFtMin(parcelBldgSqFt-buildingRange)

            let parcelLandSqFt = attributes["LANDSF"]
            let landRange= parcelLandSqFt * .1
            setLandSqFtMax(parcelLandSqFt+landRange)
            setLandSqFtMin(parcelLandSqFt-landRange)

            
            let parcelAge = attributes["BLDGAGE"]
            let ageRange = 15
            setAgeMax(parcelAge+ageRange)
            setAgeMin(parcelAge-ageRange)
        }

    }, [primaryResultFeature])

    useEffect(() => {

        if(buildingSqFtMinError){
            setBuildingSqFtMinError(false)
        }

        if(buildingSqFtMaxError && buildingSqFtMax > 0){
            setBuildingSqFtMaxError(false)
        }

        if(landSqFtMinError){
            setLandSqFtMinError(false)
        }

        if(landSqFtMaxError && landSqFtMax > 0){
            setLandSqFtMaxError(false)
        }

        if(ageMinError){
            setAgeMinError(false)
        }

        if(ageMaxError && ageMax > 0){
            setAgeMaxError(false)
        }


    }, [buildingSqFtMin, buildingSqFtMax, landSqFtMin, landSqFtMax, ageMax, ageMin])

    const handleSubmit = () => {

        let messageString = "Please provide values for: "
        let messageErrors = []

        if(!buildingSqFtMin){
            setBuildingSqFtMinError(true)
            messageErrors.push("Building Square Footage minimum")
        }

        if(!buildingSqFtMax || buildingSqFtMax < 0){
            setBuildingSqFtMaxError(true)
            messageErrors.push("Building Square Footage maximum")
        }

        if(!landSqFtMin){
            setLandSqFtMinError(true)
            messageErrors.push("Land Square Footage minimum")
        }

        if(!landSqFtMax || landSqFtMax < 0){
            setLandSqFtMaxError(true)
            messageErrors.push("Land Square Footage maximum")
        }

        if(!ageMin){
            setAgeMinError(true)
            messageErrors.push("Building Age minimum")
        }

        if(!ageMax || ageMax < 0){
            setAgeMaxError(true)
            messageErrors.push("Building Age maximum")
        }

        if(buildingSqFtMin && landSqFtMin && ageMin && buildingSqFtMax > 0 && landSqFtMax > 0 && ageMax > 0){
            handleSetQuery()
        }
        else{
            messageString = messageString + messageErrors.join(", ")
            setErrorMessage(messageString)
        }
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
            <Typography variant="body2">Building Square Feet*</Typography>
            <Box display="flex" flexDirection="row" alignItems="center" columnGap={1}>
                  <CustomStyledTextField
                  id="building-sqft-min"
                  required
                  variant="outlined" 
                  fullWidth 
                  margin="dense" 
                  size="small"
                  type="number"
                  placeholder={0}
                  error={buildingSqFtMinError}
                  value={buildingSqFtMin}
                  onInput={(event) => {
                    setBuildingSqFtMin(event.target.value)
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
                  type="number"
                  placeholder={0}
                  value={buildingSqFtMax}
                  error={buildingSqFtMaxError}
                  onInput={(event) => {
                    setBuildingSqFtMax(event.target.value)
                  }}
                  />
            </Box>

            <Typography variant="body2">Land Square Feet*</Typography>
            <Box display="flex" flexDirection="row" alignItems="center" columnGap={1}>
                  <CustomStyledTextField
                  id="land-sqft-min"
                  required
                  variant="outlined" 
                  fullWidth 
                  margin="dense" 
                  size="small"
                  type="number"
                  placeholder={0}
                  error={landSqFtMinError}
                  value={landSqFtMin}
                  onInput={(event) => {
                    setLandSqFtMin(event.target.value)
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
                  type="number"
                  placeholder={0}
                  error={landSqFtMaxError}
                  value={landSqFtMax}
                  onInput={(event) => {
                    setLandSqFtMax(event.target.value)
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
                    setConstructionType(event.target.value)
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
                        <Typography variant="body2" width={122}>Building Age*</Typography>
                    </Box>
                        <Box display="flex" flexDirection="row" alignItems="center" columnGap={1}>
                        <CustomStyledTextField
                        required
                        id="age-min"
                        variant="outlined" 
                        fullWidth 
                        margin="dense" 
                        size="small"
                        type="number"
                        placeholder={0}
                        value={ageMin}
                        error={ageMinError}
                        onInput={(event) => {
                            setAgeMin(event.target.value)
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
                        type="number"
                        placeholder={0}
                        value={ageMax}
                        error={ageMaxError}
                        onInput={(event) => {
                            setAgeMax(event.target.value)
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
                    console.log("radius event: ", event)
                    setRadius(event.target.value)
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
            
            <Box display="flex" flexDirection="column" width="100%" justifyContent="end" alignItems="center" columnGap={2}>
                {errorMessage ? <Typography variant="h5" color={theme.palette.error.dark}>{errorMessage}</Typography>: null}

                <Stack direction="row" justifyContent="end" alignItems="center"  width="100%">
                <Button variant="text" sx={{textTransform:"none"}}>
                    <Typography variant="body1">Cancel</Typography>
                </Button>
                <StyledButtonFilledPrimary text={"Search"} onClick={handleSubmit} textVarient={"body1"}/>
                </Stack>

            </Box>
            
        </Box>
        
    )
}

export default ComparablePropertySearch