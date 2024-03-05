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

    const { searchComparableProperties, primaryResultFeature, translateText } = UseAppContext()

    const [ sourceParcel, setSourceParcel ] = useState(null)
    const [ buildingSqFtMin, setBuildingSqFtMin ] = useState(0)
    const [ buildingSqFtMax, setBuildingSqFtMax ] = useState(0)
    const [ buildingSqFtMinError, setBuildingSqFtMinError ] = useState(false)
    const [ buildingSqFtMaxError, setBuildingSqFtMaxError ] = useState(false)

    const [ landSqFtMin, setLandSqFtMin ] = useState(0)
    const [ landSqFtMax, setLandSqFtMax ] = useState(0)
    const [ landSqFtMinError, setLandSqFtMinError ] = useState(false)
    const [ landSqFtMaxError, setLandSqFtMaxError ] = useState(false)

    const [constructionType, setConstructionType] = useState(constructionTypes[0])

    const [ ageMax, setAgeMax ] = useState(0)
    const [ ageMin, setAgeMin ] = useState(0)
    const [ ageMaxError, setAgeMaxError ] = useState(false)
    const [ ageMinError, setAgeMinError ] = useState(false)

    const [radius, setRadius] = useState(0)

    const [errorMessage, setErrorMessage] = useState(false)

    useEffect(() => {

        if(primaryResultFeature){
            let features = Array.isArray(primaryResultFeature) ? primaryResultFeature[0] : primaryResultFeature
            setSourceParcel(features)
        }

    },[primaryResultFeature])

    function handleSetQuery(){
        //AND BCLASS = '${bClass}'
        let query =`township_name = '${sourceParcel.attributes['township_name']}' AND NBHD = ${sourceParcel.attributes['NBHD']} AND BCLASS = '${sourceParcel.attributes['BCLASS']}' AND (BLDGSQFT >= ${buildingSqFtMin} AND BLDGSQFT <= ${buildingSqFtMax}) AND (LANDSF >= ${landSqFtMin} AND LANDSF <= ${landSqFtMax} ) AND (BLDGAGE >= ${ageMin} AND BLDGAGE <= ${ageMax} ) AND PIN14 <> '${sourceParcel.attributes['PIN14']}'`
        
        query = ['None','Any'].includes(constructionType) ? query :  query + ` AND bldg_const_desc = '${constructionType}'`

        console.log("Comparable query = ", query, radius)

        searchComparableProperties(query,radius)

        return query
    }

    useEffect(() => {
        //set ranges for building, land, and age based on primary parcel

        if(sourceParcel){
            let attributes = sourceParcel.attributes

            let parcelBldgSqFt = attributes["BLDGSQFT"]
            let buildingRange= parcelBldgSqFt * .1
            setBuildingSqFtMax(parcelBldgSqFt+buildingRange)
            setBuildingSqFtMin(parcelBldgSqFt-buildingRange  > 0 ? 0 : parcelBldgSqFt-buildingRange)

            let parcelLandSqFt = attributes["LANDSF"]
            let landRange= parcelLandSqFt * .1
            setLandSqFtMax(parcelLandSqFt+landRange)
            setLandSqFtMin(parcelLandSqFt-landRange > 0 ? 0 : parcelLandSqFt-landRange)

            
            let parcelAge = attributes["BLDGAGE"]
            let ageRange = 15
            setAgeMax(parcelAge+ageRange)
            setAgeMin(parcelAge-ageRange > 0 ? 0 : parcelAge-ageRange )
        }

    }, [sourceParcel])

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

        if(!buildingSqFtMin && buildingSqFtMin <0){
            setBuildingSqFtMinError(true)
            messageErrors.push("Building Square Footage minimum")
        }

        if(!buildingSqFtMax || buildingSqFtMax < 0){
            setBuildingSqFtMaxError(true)
            messageErrors.push("Building Square Footage maximum")
        }

        if(!landSqFtMin && landSqFtMin <0){
            setLandSqFtMinError(true)
            messageErrors.push("Land Square Footage minimum")
        }

        if(!landSqFtMax || landSqFtMax < 0){
            setLandSqFtMaxError(true)
            messageErrors.push("Land Square Footage maximum")
        }

        if(!ageMin && ageMin <0){
            setAgeMinError(true)
            messageErrors.push("Building Age minimum")
        }

        if(!ageMax || ageMax < 0){
            setAgeMaxError(true)
            messageErrors.push("Building Age maximum")
        }

        if(buildingSqFtMin >=0 && landSqFtMin >=0  && ageMin >=0  && buildingSqFtMax > 0 && landSqFtMax > 0 && ageMax > 0){
            handleSetQuery()
        }
        else{
            messageString = messageString + messageErrors.join(", ")
            setErrorMessage(messageString)
        }
    }
    


    const constructionTypeDropdownOption = constructionTypes.map((constructionType) => (
        <option key={constructionType} value={constructionType}>
            <Typography variant="body1" fontFamily="barlow">
                {translateText(constructionType)}
            </Typography>
        </option>
    ))

    const radiusDropdownOptions = Object.entries(radiusTypes).map(([radiusLabel, radiusValue]) => (
        <option key={radiusLabel} value={radiusValue}>
            <Typography variant="body1" fontFamily="barlow">
                {translateText(radiusLabel)}
            </Typography>
        </option>
    ))


    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2} component="form" sx={{overflowY:"scroll"}} flex={1} minHeight={0} pb="100px"> 
            <Typography variant="h4">
                {translateText("Source Property")}
            </Typography>
            {sourceParcel ? Object.entries(presetTextFields).map(([key, value]) => (
                <Box key={value} id={value} display="flex" height={20} alignItems="center" pt={1} columnGap={2} >
                <Box display="flex" flex={1}>
                    <Typography variant="body2">{translateText(key)}</Typography>
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
                value={sourceParcel.attributes[value] ?? ""}
                />
                </Box>
            )): null }
            <Divider/>
            <Typography variant="h4">{translateText("Property Size")}</Typography>
            <Box display="flex" flexDirection="column">
            <Typography variant="body2">{`${translateText("Building Square Feet")}*`}</Typography>
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
                  <Typography variant="body2">{translateText("to")}</Typography>
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

            <Typography variant="body2">{`${translateText("Land Square Feet")}*`}</Typography>
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
                  <Typography variant="body2">{translateText("to")}</Typography>
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
            <Typography variant="h4">{translateText("Characteristics")}</Typography>
            <Box display="flex" flexDirection="column" rowGap={1}>
            <Box id="characteristics" display="flex" height={20} alignItems="center" pt={1} columnGap={2} >
                <Box display="flex" flex={1}>
                    <Typography variant="body2" width={122}>{translateText("Construction Type")}</Typography>
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
                    {constructionTypeDropdownOption}
                </CustomStyledTextField>
                </Box>
                <Box id="building-age" display="flex" flexDirection="column" pt={1} columnGap={2} >
                    <Box display="flex" flex={1}>
                        <Typography variant="body2" width={122}>{`${translateText("Building Age")}*`}</Typography>
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
                        <Typography variant="body2">{translateText("to")}</Typography>
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
                    <Typography variant="body2" width={122}>{translateText("Search Radius")}</Typography>
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
                    {radiusDropdownOptions}
                </CustomStyledTextField>

            </Box>

            <Divider/>
            
            <Box display="flex" flexDirection="column" width="100%" justifyContent="end" alignItems="center" columnGap={2}>
                {errorMessage ? <Typography variant="h5" color={theme.palette.error.dark}>{errorMessage}</Typography>: null}

                <Stack direction="row" justifyContent="end" alignItems="center"  width="100%">
                <Button variant="text" sx={{textTransform:"none"}}>
                    <Typography variant="body1">{translateText("Cancel")}</Typography>
                </Button>
                <StyledButtonFilledPrimary text={translateText("Search")} onClick={handleSubmit} textVarient={"body1"}/>
                </Stack>

            </Box>
            
        </Box>
        
    )
}

export default ComparablePropertySearch