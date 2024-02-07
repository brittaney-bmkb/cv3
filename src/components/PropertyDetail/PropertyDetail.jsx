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

    const fetchPropertyDetailData = (category) => {
        return dataDictionary?.filter((data) => data.attributes['category']===category)
        .map((filteredData, i) => {
            return(
            <Box 
            sx={i === 0 ? panelContentTitleMain : panelContentTitleSecondary}
            key={filteredData.attributes['FID']}
            >
            {filteredData.attributes['field']}
            </Box>
            )
        })
    }

    

    const propertyDetailHeader = dataDictionary?.filter((data) => data.attributes['category']==='top')
                                                .map((filteredData, i) => {
                                                    return(
                                                    <Box 
                                                    sx={i === 0 ? panelContentTitleMain : panelContentTitleSecondary}
                                                    key={filteredData.attributes['FID']}
                                                    >
                                                    {filteredData.attributes['field']}
                                                    </Box>
                                                    )
                                                })

    const propertyLocation =  dataDictionary?.filter((data) => data.attributes['category']==='Location')
    .map((filteredData, i) => {
        return(
        <Box 
        // sx={i === 0 ? panelContentTitleMain : panelContentTitleSecondary}
        key={filteredData.attributes['FID']}
        >
        {filteredData.attributes['field']}
        </Box>
        )
    })

    return(
        <Box display="flex" flexDirection="column" rowGap={2} p={2}>
        {categories?.map((category) => {
            return(
                fetchPropertyDetailData(category)
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