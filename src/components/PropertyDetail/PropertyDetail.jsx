import { Box, Divider, Typography, useMediaQuery } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"
import { theme } from "../../theme"
import { returnMunicipality } from "../../arcgis/geoprocessing/geoprocessing"
import { Link } from "react-router-dom"


const panelContentTitleMain = {
    display:"flex",
    border: 3,
    padding:"2px",
    borderColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.main,
    fontSize: theme.typography.h3.fontSize,
    justifyContent: "center",
    alignItems:"center",
    width:"fit-content",
    height:"fit-content",
}

const panelContentTitleSecondary = {
    display:"flex",
    color: theme.main.text.dark,
    fontSize: theme.typography.h5.fontSize,
    justifyContent:"center"
}

const PropertyDetail = () => {

    const { screenWidth, primaryResultFeature, dataDictionary, panelDisplay, setPanelDisplay, setPanelPrimaryVisibility, setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()

    const [ categories, setCategories ] = useState(null)
    const [ muni, setMuni ] = useState(null)


    function handleClick(){
        if(screenWidth < theme.breakpoints.values.lg){
            setPanelPrimaryVisibility(true)
            setPanelDisplay("comparablePropertySearch")
        }
        else if (screenWidth >= theme.breakpoints.values.lg){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary("comparablePropertySearch")
        }
    }


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
        const getMuniValue = async () => {
            let muniValue = await returnMunicipality(primaryResultFeature)
            setMuni(muniValue)
        }

        getMuniValue()
        
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

    const incorp_unincorp = () => (
            <Box 
            display="flex"
            >
                <Typography variant="h5" sx={{color: theme.main.text.dark }}>
                    {muni}
                </Typography>

            </Box>
        )

    const returnHyperlink = (text, params, url, attributes) => {

        let urlFormatted = url
        let paramsValues = params.split(",")

        console.log("url data attributes: ", attributes)

        paramsValues.map((param) => {
            console.log("Replacing: ", `{${param}}`)
            urlFormatted = urlFormatted.replace(`{${param}}`, attributes[param])
        })

        console.log("url text: ", text, urlFormatted)

        return (
        <Box 
        display="flex"
        >   
        {/* <Link to={urlFormatted} target="_blank"> */}
            <Typography 
            component={Link} 
            to={urlFormatted} 
            target="_blank"
            fontFamily={"barlow"} 
            color={theme.palette.primary.light} sx={{color:theme.palette.primary.light}}>{text}</Typography>
        {/* </Link> */}
        </Box>
    )}

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

                    data.attributes['field'] === "incorp_unincorp_state" ?
                        incorp_unincorp(data) :

                    data.attributes['hyperlink_text'] && data.attributes['hyperlink_params'] && data.attributes['hyperlink_url'] ?
                        returnHyperlink(data.attributes['hyperlink_text'], data.attributes['hyperlink_params'], data.attributes['hyperlink_url'], primaryResultFeature?.attributes) :

                <Box 
                width="100%"
                
                display="flex" 
                justifyContent={category === 'top' ? "center" : "left"}>
                <Box 
                id="data-field-container"
                sx={index === 0 && category === 'top' && subIndex ===0 ? panelContentTitleMain : null}
                >
                    <Typography 
                        align="left"
                        variant="h5" 
                        sx={{color: category === "top" && subIndex==0 ? theme.palette.primary.main: theme.main.text.dark }}>
                            {primaryResultFeature?.attributes[data.attributes['field']]}
                    </Typography>
                    
                </Box>
                </Box>

                }

                    <Box>
                    {
                        data.attributes['credit'] ? 
                        <Typography variant="h6">
                            { data.attributes['credit'] }
                        </Typography> :
                        null

                    }
                </Box>
                    {filteredData.length -1 === subIndex ? <Divider variant="fullWidth" sx={{p: 1}}/> : null}
                </Box>
            
            )
        })

        return(
            <Box key={category} display="flex" flexDirection="column" width="100%" pt={1} rowGap={1}>
                {category !== 'top' ? <Typography variant="h2">{category}</Typography> : null}
                <Box 
                id={"property-detail-data-container"} 
                width="100%"
                display="flex" flexDirection="column" 
                pl={category === "top" ? 0 :1} 
                rowGap={category === "top" ? "1px" : 2}>
                    {data}
                    
                </Box>
                
                
            </Box>
        )
    }

    return(
        <Box display="flex" flexDirection="column" width="100%"  flexGrow={1} minHeight={0}>
            <Box display="flex" flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center" pt={1}>
                {fetchPropertyDetailData('top', 0)}
            </Box>
            
            <Box display="flex" flexDirection="column" rowGap={1} sx={{overflowY:"auto", overflowX:"hidden"}}  flexGrow={1} minHeight={0} pl={1} pr={2} boxSizing="content-box">
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