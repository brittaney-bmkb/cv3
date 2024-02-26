import { Box, Divider, Typography, useMediaQuery } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"
import { theme } from "../../theme"
import { returnMunicipality } from "../../arcgis/geoprocessing/geoprocessing"
import { Link } from "react-router-dom"




const prefix = (key) => {
    switch (key) {
        case 'money':
            return "$";
        default:
            return '';
    }
}

function addCommaSeparator(value, type) {
    // Convert the string to a number (if it's not already)
    const numericValue = parseFloat(value);
  
    // Check if the conversion was successful and the value is a number
    if (!isNaN(numericValue) && ["money","int or double"].includes(type)) {
      // Use toLocaleString to add comma separators
      return numericValue.toLocaleString();
    } else {
      // If the value is not a valid number, return the original value
      return value;
    }
  }

const propertyDetail = ({property1, property2, propertyColor1, propertyColor2}) => {

    const {screenWidth, dataDictionary, setPanelDisplay, setPanelPrimaryVisibility, setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()


    const [ categories, setCategories ] = useState(null)
    const [ muni, setMuni ] = useState({})
    const [ zoningMessage, setZoningMessage ] = useState({})
    const [ properties, setProperties ] = useState([])
    const [ textAlignment, setTextAlignment ] = useState("left")
    

    const panelContentTitleMain = {
        display:"flex",
        border: 3,
        padding:"2px",
        borderRadius: theme.shape.borderRadius,
        fontSize: theme.typography.h3.fontSize,
        justifyContent: "center",
        alignItems:"center",
        width:"fit-content",
        height:"fit-content",
        color:"",
        borderColor:""
    }

    function handleClick(display){
        if(screenWidth < theme.breakpoints.values.lg){
            setPanelPrimaryVisibility(true)
            setPanelDisplay(display)
        }
        else if (screenWidth >= theme.breakpoints.values.lg){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary(display)
        }
    }

    useEffect(() => {
        const propertiesToAdd = [property1, property2].filter((prop) => {if(prop){ return prop}})
                                                      .map((prop) => prop)
        
        if (propertiesToAdd.length > 0) {
          setProperties(propertiesToAdd);
        }
      }, [property1, property2]);
      

    useEffect(() => {
        const fetchMuniData = async () => {
            if (properties && properties.length > 0) {
              let muniObj = {};
              let zoningMessage = {}
        
              // Use Promise.all to wait for all asynchronous operations to complete
              await Promise.all(properties.map(async (property) => {
                const muniValue = await returnMunicipality(property);
                const key = property.attributes["PIN14"];
        
                // Set the muniObj with fetched data
                muniObj[key] = muniValue;

             if(muniValue.includes('Incorporated')){

                     zoningMessage[key] =`Please contact municipality`
             }
             else{
                zoningMessage[key] =`Cook County Zone Lookup`

             }
            }));
        
              setMuni(muniObj);
              setZoningMessage(zoningMessage)
            }
          };

          fetchMuniData();
    }, [properties])


    useEffect(() => {
        if (dataDictionary) {

            let categoriesToExclude = !property1 ? ['Property Comparison', 'top', null] : ['top', null] 
            const filteredCategories = [
                ...new Set(
                    dataDictionary
                        .filter(data => !categoriesToExclude.includes(data.attributes['category']))
                        .sort((a, b) => a.attributes['details_category_order'] > b.attributes['details_category_order'] ? 1:-1)
                        .map(data => data.attributes['category'])
                )
            ];

            setCategories(filteredCategories);
        }
    }, [dataDictionary]);

    useEffect(() => {
        if(screenWidth && screenWidth < theme.breakpoints.values.lg && property1 && property2){
            setTextAlignment("center")
        }
        else{
            setTextAlignment("left")
        }
    }, [screenWidth])

    const propertyComparison = (key) => (
        <Box
        pt={1}
        >
        <StyledButtonFilledPrimary 
        key={key}
        text={"Compare Properties"}
        onClick={() => {handleClick("comparablePropertySearch")}}
        variant={"h5"}
        />
        </Box>

    )

    const nearbyProperties = (key) =>  (
        <Box pt={1}>
        <StyledButtonFilledPrimary 
        key={key}
        text={"Nearby Parcels"}
        onClick={() => {handleClick("nearbyProperties")}}
        variant={"h5"}
        />
        </Box>

    )

    const incorp_unincorp = (property) => (
            <Box 
            display="flex"
            >
                <Typography align={textAlignment} variant="h5" sx={{color: theme.main.text.dark }}>
                    {muni[property.attributes["PIN14"]]}
                </Typography>

            </Box>
        )

    const returnHyperlink = (text, params, url, attributes) => {

        let urlFormatted = url
        let paramsValues = params.split(",")

        console.log("url data attributes: ", attributes)

        if(attributes){
            paramsValues.map((param) => {
                console.log("Replacing: ", `{${param}}`)
                urlFormatted = urlFormatted.replace(`{${param}}`, attributes[param])
            })
    
            console.log("url text: ", text, urlFormatted)
        }


        return (
        <Box 
        display="flex"
        >   
        {/* <Link to={urlFormatted} target="_blank"> */}
            <Typography 
            variant="h5"
            align={textAlignment}
            component={Link} 
            to={urlFormatted} 
            target="_blank"
            fontFamily={"barlow"} 
            color={theme.palette.primary.light}>{text}</Typography>
        {/* </Link> */}
        </Box>
    )}

    const fetchpropertyDetailData = (category, index) => {
        let filteredData = dataDictionary
        ?.filter((data) => data.attributes['category'] === category)
        .sort((a, b) => a.attributes['category_order'] > b.attributes['category_order'] ? 1:-1)
        .map((data) => data); 

        let data = filteredData?.map((data, subIndex) => {
            return(
                <Box key={data.attributes['FID']} display="flex" flexDirection="column" width="100%">

                <Box 
                display="flex"
                justifyContent={textAlignment}
                pb={category !== "top" ? 1 :0}
                >
                    <Typography variant="h6">
                        {data.attributes['label']}
                    </Typography>
                </Box>
                
                <Box display="flex" flexDirection="row" columnGap={3} justifyContent={category=="top"? "center" : textAlignment}>
                    {properties.map((property, propIndex) => {
                        let color = property === property1 ? propertyColor1 : propertyColor2
                        panelContentTitleMain["color"] = color
                        panelContentTitleMain["borderColor"] = color
                        return(
                            <Box 
                            key={property.attributes['PIN14']}
                            display="flex" 
                            justifyContent="space-evenly" 
                            alignContent={textAlignment}>
                           { data.attributes['field'] === "comparable_properties"? 
                            propertyComparison(data.attributes['FID']) :

                            data.attributes['field'] === "nearby_properties"? 
                            nearbyProperties(data.attributes['FID']) :

                            data.attributes['field'] === "incorp_unincorp_state" ?
                            incorp_unincorp(property) :

                            data.attributes['field'] === "zoning_info" ?
                            <Box 
                            display="flex"
                            >
                                <Typography align={textAlignment} variant="h5" sx={{color: theme.main.text.dark }}>
                                {zoningMessage[property.attributes["PIN14"]]} 
                                </Typography>
    
                            </Box>: 
    
                        data.attributes['hyperlink_text'] && data.attributes['hyperlink_params'] && data.attributes['hyperlink_url'] ?
                            returnHyperlink(data.attributes['hyperlink_text'], data.attributes['hyperlink_params'], data.attributes['hyperlink_url'], property1?.attributes) :
                            <Box 
                            key={data.attributes["FID"]}
                            id="data-field-container"
                            display="flex"
                            // justifyContent={textAlignment}
                            alignContent="center"
                            sx={{
                                display:"flex",
                                border: category==="top" && subIndex ===0 ? 3: 0,
                                padding:"2px",
                                borderRadius: theme.shape.borderRadius,
                                fontSize: theme.typography.h3.fontSize,
                                justifyContent: "center",
                                alignItems:"center",
                                borderColor:property===property1 ? propertyColor1 : propertyColor2,
                                color:property===property1 ? propertyColor1 : propertyColor2
                            }}
                            >
                                <Typography 
                                    align={textAlignment}
                                    variant="h5" 
                                    sx={{color: category === "top" && subIndex==0 && property===property1 ? propertyColor1 : category === "top" && subIndex==0 && property===property2 ? propertyColor2: theme.main.text.dark }}>
                                        {property?.attributes[data.attributes['field']] ? 
                                        `${prefix(data.attributes['type'])}${addCommaSeparator(property?.attributes[data.attributes['field']], data.attributes['type'])}` :
                                        "Data unavailable"}
                                </Typography>
                                
                            </Box>
                            
                            }
                            {propIndex === 0 && category !== "top" && properties.length > 1? 
                            <Divider flexItem orientation="vertical" sx={{color:theme.palette.info.dark, height:'100%', pl:1, pr:1}}/>
                            : null
                            }
                        </Box> 
                        )
                            
                    })
                    }
                </Box>
                    <Box>
                    {
                        data.attributes['credit'] ? 
                        <Typography variant="h6" align={textAlignment}>
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
            <Box key={category} display="flex" flexDirection="column" width="100%" pt={category !== "top" ? 1: 0} rowGap={category !== "top" ? 1: 0}>
                {category !== "top"? <Typography variant="h2">{category}</Typography> :
                null}
                <Box 
                id={"property-detail-data-container"} 
                width="100%"
                display="flex" flexDirection="column" 
                pl={category === "top" ? 0 :1} 
                rowGap={category === "top" ? 0 : 2}>
                    {data}
                    
                </Box> 
            </Box>
        )
    }

    return(
        <Box display="flex" flexDirection="column" width="100%" flexGrow={1} minHeight={0} p={1}>
            <Box display="flex" flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center" pt={1}>
                {fetchpropertyDetailData('top', 0)}
            </Box>
            
            <Box display="flex" flexDirection="column" rowGap={1} sx={{overflowY:"auto", overflowX:"hidden"}}  flexGrow={1} minHeight={0} pl={1} pr={2} boxSizing="content-box">
            {categories?.map((category, index) => {

                if(category === "Property Comparision" && !property1 ){
                    return null
                }
                else{
                    return fetchpropertyDetailData(category, index+1)
                }

            })}
            </Box>
        </Box>
        
    )
}

export default propertyDetail