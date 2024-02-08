import { Box, Divider, Typography, useMediaQuery } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"
import { theme } from "../../theme"


const panelContentTitleMain = {
    display:"flex",
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

    const { primaryResultFeature, dataDictionary, panelDisplay, setPanelDisplay, setPanelPrimaryVisibility, setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()

    const [ categories, setCategories ] = useState(null)
    const [mediumScreenOrHigher, setMediumScreenOrHigher] = useState(
        useMediaQuery(theme.breakpoints.up('md'))
      );

    function handleClick(){
        if(mediumScreenOrHigher){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary("comparablePropertySearch")
        }
        else{
            setPanelPrimaryVisibility(true)
            setPanelDisplay("comparablePropertySearch")
            
        }
    }


      useEffect(() => {
        if (!mediumScreenOrHigher && panelDisplay === 'comparablePropertySearch') {
          setPanelPrimaryVisibility(true);
          setPanelDisplay('propertyDetail');
    
          setPanelSecondaryVisibility(true);
          setPanelDisplaySecondary('comparablePropertySearch');
        }
      }, [mediumScreenOrHigher, panelDisplay]);


    useEffect(() => {
        if (dataDictionary) {
            const filteredCategories = [
                ...new Set(
                    dataDictionary
                        .filter(data => data.attributes['category'] !== 'top' && data.attributes['category'] !== null)
                        .sort((a, b) => a.attributes['details_category_order'] > b.attributes['details_category_order'] ? 1:-1)
                        .map(data => data.attributes['category'])
                )
            ];
    
            setCategories(filteredCategories);
        }
    }, [dataDictionary]);
    
    useEffect(() => {
        console.log("categories: ", categories);
    }, [categories]);

    const propertyComparison = (key) => (
        <StyledButtonFilledPrimary 
        key={key}
        text={"Compare Properties"}
        onClick={handleClick}
        />
    )

    const nearbyProperties = (key) =>  (
        <StyledButtonFilledPrimary 
        key={key}
        text={"Nearby Parcels"}
        onClick={handleClick}
        />
    )

    const fetchPropertyDetailData = (category, index) => {
        let filteredData = dataDictionary
        ?.filter((data) => data.attributes['category'] === category)
        .sort((a, b) => a.attributes['category_order'] > b.attributes['category_order'] ? 1:-1)
        .map((data) => data); 

        let data = filteredData?.map((data, subIndex) => {
            return(
                <Box key={data.attributes['FID']} display="flex" flexDirection="column" width="100%">
                <Box 
                display="flex"
                >
                    <Typography variant="h6">
                        {data.attributes['label']}
                    </Typography>
                
                </Box>
                { 
                    data.attributes['field'] === "comparable_properties" ? 
                        propertyComparison(data.attributes['FID']) :

                    data.attributes['field'] === "nearby_properties" ?
                        nearbyProperties(data.attributes['FID']) :

                <Box 
                display="flex"
                sx={index === 0 && subIndex===0 ? panelContentTitleMain : category === 'top' ? panelContentTitleSecondary: null}
                >
                    <Typography variant={category !== "top" ? "h5": subIndex > 0 ? "h5" : "h3"} sx={{color: category === "top" && subIndex==0 ? theme.palette.primary.main: theme.main.text.dark }}>
                        {primaryResultFeature?.attributes[data.attributes['field']]}
                    </Typography>
                
                </Box>}
                    {filteredData.length -1 === subIndex ? <Divider variant="fullWidth" sx={{p: 1}}/> : null}
                </Box>
            
            )
        })

        return(
            <Box display="flex" flexDirection="column" width="100%" pt={1} rowGap={2}>
                {category !== 'top' ? <Typography variant="h2">{category}</Typography> : null}
                <Box display="flex" flexDirection="column" width="100%" pl={category === "top" ? 0 :1} rowGap={category === "top" ? 1 : 2}>
                    {data}
                </Box>
                
            </Box>
        )
    }

    return(
        <Box display="flex" flexDirection="column" width="100%" overflow="clip" >
        <Box display="flex" flexDirection="column" width="100%" justifyContent="center" alignItems="center">
            {fetchPropertyDetailData('top', 0)}
        </Box>
        
        <Box display="flex" flexDirection="column" flex={1} rowGap={2} p={2} sx={{overflowY:"scroll"}}>
        {categories?.map((category, index) => {
            return(
                fetchPropertyDetailData(category, index+1)
            )
            
        })}
        </Box>
        </Box>
        
    )
}

export default PropertyDetail