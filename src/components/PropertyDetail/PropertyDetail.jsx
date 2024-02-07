import { Box, Divider, Typography } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"
import { theme } from "../../theme"


const panelContentTitleMain = {
    display:"flex",
    padding: 1,
    border: 3,
    borderColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.main,
    fontSize: theme.typography.h3.fontSize,
    justifyContent:"center"
}

const panelContentTitleSecondary = {
    display:"flex",
    color: theme.main.text.dark,
    fontSize: theme.typography.h4.fontSize,
    justifyContent:"center"
}

const panelContentSubtitle = {
    display:"flex",
    color: theme.main.text.light,
    fontSize: theme.typography.h4.fontSize,
    justifyContent:"center"
}

const PropertyDetail = () => {

    const { dataDictionary, setPanelSecondaryVisibility, setPanelDisplaySecondary, loadDataDictionary } = UseAppContext()

    const [ categories, setCategories ] = useState(null)

    function handleClick(){
        setPanelSecondaryVisibility(true)
        setPanelDisplaySecondary("comparablePropertySearch")
    }

    useEffect( () => {
      loadDataDictionary()
    },[])

    useEffect(() => {

        let propertyDetailCategories

        if(dataDictionary){
            propertyDetailCategories = [...new Set(dataDictionary.map((data) => data.attributes['category']))]
        }

        setCategories(propertyDetailCategories)
        console.log(categories)

    },[dataDictionary])

    const fetchPropertyDetailData = (category, index) => {
        let filteredData =  dataDictionary?.filter((data) => data.attributes['category']===category && category !== null)
        return filteredData.map((data, subIndex) => {
            return(
                <Box key={data.attributes['FID']}>
                <Box 
                sx={index === 0 && subIndex===0 ? panelContentTitleMain : category === 'top' ? panelContentTitleSecondary: null}
                
                >
                {data.attributes['field']}
                </Box>

            { filteredData.length === subIndex+1 ? <Divider/> : null}
                </Box>
            
            )
        })
    }

    

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2} sx={{overflowY:"scroll"}}>
        {categories?.map((category, index) => {
            return(
                fetchPropertyDetailData(category, index)
            )
            
        })}
        <StyledButtonFilledPrimary 
        text={"Compare Properties"}
        onClick={handleClick}
        />
        </Box>
        
    )
}

export default PropertyDetail