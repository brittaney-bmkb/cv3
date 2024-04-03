import { Box, CircularProgress, Divider, Typography, useMediaQuery } from "@mui/material"
import StyledButtonFilledPrimary from "../Button/Button"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"
import { theme } from "../../theme"
import { returnMunicipality } from "../../arcgis/geoprocessing/geoprocessing"
import { Link } from "react-router-dom"
import { CalciteLoader } from "@esri/calcite-components-react"


const prefix = (key) => {
    switch (key) {
        case 'money':
            return "$";
        default:
            return '';
    }
}

const res_condo_class_list = [299, 399]
const single_multi_improvements_class_list = [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 218, 219, 224, 225, 234, 236, 278, 295, 297]

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

    const { clearResultsComparables, panelWidgetVisible, setPanelWidgetVisibility, screenWidth, dataDictionary, setPanelDisplay, setPanelPrimaryVisibility, setPanelSecondaryVisibility, setPanelDisplaySecondary, translateText, language } = UseAppContext()


    const [ categories, setCategories ] = useState(null)
    const [ muni, setMuni ] = useState({})
    const [muniLoading, setMuniLoading] = useState(false)
    const [ zoningMessage, setZoningMessage ] = useState({})
    const [ properties, setProperties ] = useState([])
    const [ textAlignment, setTextAlignment ] = useState("left")
    //const [ zoningInfo, setZoningInfo ] = useState()
    

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

        clearResultsComparables()

        if(screenWidth < theme.breakpoints.values.lg){
            setPanelPrimaryVisibility(true)
            setPanelDisplay(display)
        }
        else if (screenWidth >= theme.breakpoints.values.lg){
            setPanelSecondaryVisibility(true)
            setPanelDisplaySecondary(display)

            if(panelWidgetVisible === true){
                setPanelWidgetVisibility(false)
            }
        }
    }

    useEffect(() => {
        const propertiesToAdd = [property1, property2].filter((prop) => {if(prop){ return prop}})
                                                      .map((prop) => Array.isArray(prop) ? prop[0] : prop )
        
        if (propertiesToAdd.length > 0) {
          setProperties(propertiesToAdd);
        }
      }, [property1, property2]);
      

    useEffect(() => {
        const fetchMuniData = async () => {
            if (properties && properties.length > 0) {
                setMuniLoading(true)
                let muniObj = {};
                let zoningMessage = {}
        
                // Use Promise.all to wait for all asynchronous operations to complete
                await Promise.all(properties.map(async (property) => {
                    const muniValueReturned = await returnMunicipality(property);
                    const muniValue = muniValueReturned ? `${translateText('Incorporated')} ${muniValueReturned}` : `${translateText('Unincorporated')} ${property.attributes['township_name']}`
                    const key = property.attributes["PIN14"];
            
                    // Set the muniObj with fetched data
                    muniObj[key] = muniValue;

                if(muniValueReturned){

                        zoningMessage[key] = `Please contact municipality`
                }
                else{
                    zoningMessage[key] = `Cook County Zone Lookup`

                }
                setMuniLoading(false)
            }));
        
              setMuni(muniObj);
              setZoningMessage(zoningMessage)
            }
          };

          fetchMuniData();
    }, [properties, language])


    useEffect(() => {
        if (dataDictionary) {

            let categoriesToExclude =  ['top', null] 
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
        //width={200}
        text={translateText("Comparable Properties")}
        onClick={() => {handleClick("comparablePropertySearch")}}
        variant={"h5"}
        />
        </Box>

    )

    const nearbyProperties = (key) =>  (
        <Box pt={1}>
        <StyledButtonFilledPrimary 
        key={key}
        //width={200}
        text={translateText("Nearby Parcels")}
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

    const returnHyperlink = (text, params, url, field, attributes) => {

        let urlFormatted = url
        let paramsValues = params.split(",")
        let showLink = true

        if(attributes){
            paramsValues.map((param) => {
                //console.log("Replacing: ", `{${param}}`)
                urlFormatted = urlFormatted.replace(`{${param}}`, attributes[param])
            })
    
            //console.log("url text: ", text, urlFormatted)
        }
        return (
        
        <Box 
        id={field}
        display="flex"
        >   

            <Typography 
            variant="h5"
            align={textAlignment}
            component={Link} 
            to={urlFormatted} 
            target="_blank"
            color={theme.palette.primary.light}>{translateText(text)}</Typography>
        </Box>
        
    )}


    const zoningInfo = (property, data) => {

        let msg = zoningMessage[property.attributes["PIN14"]]
        //console.log("muni message ", msg)

        if(msg === "Cook County Zone Lookup"){
            return returnHyperlink(data.attributes['hyperlink_text'], data.attributes['hyperlink_params'], data.attributes['hyperlink_url'], property?.attributes)
        }
        else{
            return(
            <Typography align={textAlignment} variant="h5" sx={{color: theme.main.text.dark }}>
               {translateText(zoningMessage[property.attributes["PIN14"]])}
            </Typography>
            )
        }

    }
    
    const fetchpropertyDetailData = (category, index) => {
        //filter out historical sf mf characteristics and res condo characteristics if 
        //propert bclass not in class list
        let excludeFields = []

        const propIsResCondo = properties.every(property => {
            return res_condo_class_list.includes(parseInt(property?.attributes["BCLASS"]));
        })


        const propIsResSfMf = properties.every(property => {
            return single_multi_improvements_class_list.includes(parseInt(property?.attributes["BCLASS"]));
        })

        if (!propIsResCondo){
            
            excludeFields.push("res_condo_chars_link")
        }
        if (!propIsResSfMf){
            excludeFields.push("hist_sf_mf_imp_chars_link")
        }

        let filteredData = dataDictionary
        ?.filter((data) => data.attributes['category'] === category && !excludeFields.includes(data.attributes['field']))
        .sort((a, b) => a.attributes['category_order'] > b.attributes['category_order'] ? 1:-1)
        .map((data) => data); 

        let data = filteredData?.map((data, subIndex) => {
            return(
                <Box id={`${data.attributes['field']}-BOX`} key={data.attributes['field']} display="flex" flexDirection="column" width="100%">
                {
                index !== 0 ? 
                <Box 
                display="flex"
                justifyContent={textAlignment}
                pb={category !== "top" ? 1 :0}
                >
                    <Typography variant="h6">
                        {translateText(data.attributes['label'])}
                    </Typography>
                </Box>: 
                null
                }
                
                <Box id="propertyDetailsBox" display="flex" flexDirection="row" columnGap={3} justifyContent={category==="top"? "space-around" : textAlignment}>
                    {properties.map((property, propIndex) => {
                        ////console.log("property details for: ", property)
                        let color = property === property1 ? propertyColor1 : propertyColor2
                        panelContentTitleMain["color"] = color
                        panelContentTitleMain["borderColor"] = color

                        //conditional links based on 
                        let field = data.attributes['field']

                        return(
                            <Box 
                            id={`property-${propIndex}`}
                            key={property.attributes['PIN14']}
                            display="flex" 
                            justifyContent="center" 
                            alignContent={textAlignment}>
                           
                           { 
                           
                            data.attributes['field'] === "comparable_properties"? 
                            propertyComparison(data.attributes['field']) :

                            data.attributes['field'] === "nearby_properties"? 
                            nearbyProperties(data.attributes['field']) :

                            data.attributes['field'] === "incorp_unincorp_state" ?
                            incorp_unincorp(property) :

                            data.attributes['field'] === "zoning_info"?
                            
                            <Box 
                            id="zoning-info"
                            display="flex"
                            >
                                {/* <Typography align={textAlignment} variant="h5" sx={{color: theme.main.text.dark }}> */}
                                    { muniLoading ? <CircularProgress size={5}/> :  zoningInfo(property, data)} 
                                {/* </Typography> */}
    
                            </Box>: 

                        data.attributes['field'].endsWith("_link") ?
                        // data.attributes['hyperlink_text'] && data.attributes['hyperlink_params'] && data.attributes['hyperlink_url'] ?
                            returnHyperlink(data.attributes['hyperlink_text'], data.attributes['hyperlink_params'], data.attributes['hyperlink_url'], data.attributes['field'], property?.attributes) :   
       
                        <Box 
                            key={data.attributes["field"]}
                            id={data.attributes['field']}
                            display="flex"
                            sx={{
                                border: category==="top" && subIndex ===0 ? 3: 0,
                                padding:"2px",
                                boxSizing:"border-box",
                                borderRadius: theme.shape.borderRadius,
                                fontSize: theme.typography.h3.fontSize,
                                // justifyContent: "center",
                                // alignItems:"center",
                                borderColor:property===property1 ? propertyColor1 : propertyColor2,
                                color:property===property1 ? propertyColor1 : propertyColor2
                            }}
                            >
                                {property ? 

                                <Typography 
                                    id={data.attributes['field']}
                                    align={textAlignment}
                                    variant="h5" 
                                    sx={{
                                        width:"100%",
                                        color: category === "top" && subIndex==0 && property===property1 ? propertyColor1 : category === "top" && subIndex==0 && property===property2 ? propertyColor2: theme.main.text.dark 
                                        }}>
                                        {
                                            property?.attributes[data.attributes['field']] && data.attributes['type'] === "text" ? 
                                            translateText(property?.attributes[data.attributes['field']]) : 
                                            property?.attributes[data.attributes['field']] ? 
                                            `${prefix(data.attributes['type'])}${addCommaSeparator(property?.attributes[data.attributes['field']], data.attributes['type'])}` :

                                            
                                            translateText("Data unavailable")
                                        }
                                </Typography> 

                                : null
                                }
  
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
                        data.attributes['credit']? 
                        <Typography variant="h6" align={textAlignment}>
                            { translateText(data.attributes['credit']) }
                        </Typography> :
                        null
                    }
                </Box>
                    {filteredData.length -1 === subIndex ? <Divider variant="fullWidth" sx={{p: 1}}/> : null}
                </Box>
            
            )
        })

        return(
            <Box id={category} key={category} display="flex" flexDirection="column" width="100%" pt={category !== "top" ? 1: 0} rowGap={category !== "top" ? 1: 0}>
                {category !== "top"? <Typography variant="h2">{translateText(category)}</Typography> :
                null}
                <Box 
                id={"property-detail-data-container"} 
                width="100%"
                display="flex" 
                flexDirection="column" 
                pl={category === "top" ? 0 :1} 
                rowGap={category === "top" ? 0 : 2}
                >
                    {data}
                    
                </Box> 
            </Box>
        )
    }

    return(
        <Box 
        display="flex" 
        flexDirection="column" 
        width="100%" 
        flexGrow={1} 
        minHeight={0} 
        p={1} 
        // pb={screenWidth <= theme.breakpoints.values.sm ? 6 : 0}
        sx={{boxSizing:"border-box"}}>
            <Box id="Top-Details" display="flex" flexDirection="column" flexGrow={1} justifyContent="center" alignItems="center" pt={1}>
                {fetchpropertyDetailData('top', 0)}
            </Box>
            
            <Box display="flex" flexDirection="column" rowGap={1} sx={{overflowY:"auto", overflowX:"hidden"}}  flexGrow={1} minHeight={0} pl={1} pr={2} boxSizing="content-box">
            {categories?.map((category, index) => {

                if(category === "Property Comparision" && !property1 ){
                    return null
                }
                else if(category === "Property Comparision" && property1 && property2){
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