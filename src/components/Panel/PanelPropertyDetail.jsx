'use client'

import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteButton, 
    CalciteLabel, 
    CalciteList, 
    CalciteListItem, 
    CalciteListItemGroup, 
    CalcitePanel,
    CalciteScrim, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";
import { returnMunicipality } from "../../arcgis/geoprocessing/geoprocessing"
import { config } from "../../data/config";
import { useEffect, useState } from "react";
import "@esri/calcite-components/components/calcite-scrim"
import Inactive from "../Inactive/Inactive";



//TODO - Update Export dialog and add trigger to export action
//TODO - Update Feedback dialog and add trigger to feedback action
//Add footer with pagination for parcels
//Scrim when no property is selected

const res_condo_class_list = [299, 399]
const single_multi_improvements_class_list = [202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 218, 219, 224, 225, 234, 236, 278, 295, 297]

//CONDITIONAL LINKS
//ONLY DISPLAY IF PROPERTY CLASSIFICATION BCLASS
//MATCHES CLASS LIST
const conditional_links = {
    'res_condo_chars_link' : res_condo_class_list,
    'hist_sf_mf_imp_chars_link': single_multi_improvements_class_list
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

  const returnHyperlink = (params, url, attributes) => {

    let urlFormatted = url
    let paramsValues = params.split(",")
    let showLink = true

    if(attributes){
        paramsValues.map((param) => {
            ////console.log("Replacing: ", `{${param}}`)
            urlFormatted = urlFormatted.replace(`{${param}}`, attributes[param])
        })

        ////console.log("url text: ", text, urlFormatted)
    }
    return urlFormatted
}



const PanelPropertyDetail = () => {

    const { 
        searchFeatures, 
        translateText, 
        propertyDetailPanelClosed, 
        setPropertyDetailPanel, 
        clearResults,
        dataDictionary,
        primaryResultFeature,
        setComparablePanel,
        setNearbyPanel
    } = UseAppContext()

    const [ categories, setCategories ] = useState(null)
    const [ headerData, setHeaderData] = useState(null)

    const handleClick = (prop) => {

        console.log("Handle click triggered for: ", prop)
        if(calculatedValues[prop] && calculatedValues[prop].onClick){
            console.log("Executing triggered for: ", prop)
            calculatedValues[prop].onClick()
        }
    }
    
    
    //CALCULATED VALUES, LINKS, & BUTTONS
    //TODO ADD ONCLICK FUNCTION TO BUTTONS
    const [ calculatedValues, setCalculatedValues ] = useState({
        incorp_unincorp_state: {
            label: '',
            description: '',
            type: null
        },
        zoning_info: {
            label: '',
            description: '',
            type: null
        },
        comparable_properties: {
            label: '',
            description: '',
            type: 'button',
            onClick: () => {
                setComparablePanel(false)
                setNearbyPanel(true)
            }
        },
        nearby_properties: {
            label: '',
            description: '',
            type: 'button',
            //UPDATE TO NEARBY PANEL
            onClick: () => {
                setNearbyPanel(false)
                setComparablePanel(true)
            }
        }
    })

    //Get Property Data Fields to Display
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
        const calculateFieldValues = async (feature) => {
            if (dataDictionary) {

                const promises = dataDictionary.map(async (data) => {
                    const field = data.attributes['field']
                    const dataType = data.attributes['type']


                    if(data.attributes['category'] === 'top'){

                        setHeaderData(prevState => {
                            const updatedState = { ...prevState };
                    
                            // Dynamically update or add the new field
                            if (!updatedState[field]) {
                                updatedState[field] = '';
                            }
                            updatedState[field] = feature.attributes[field]
                            return updatedState;
                        })

                        console.log("header data: ", headerData)
                    }
                    

                    if (dataType === 'calc' || dataType === 'button') {

                        // Municipality & ZONING
                        if (field === 'incorp_unincorp_state') {
                            let message;
                            const muniValueReturned = await returnMunicipality(feature);
                            const muniValue = muniValueReturned
                                ? `${translateText('Incorporated')} ${muniValueReturned}`
                                : `${translateText('Unincorporated')} ${feature.attributes['township_name']}`;
    
                            if (muniValueReturned) {
                                message = translateText('Please contact municipality');
                            } else {
                                message = translateText('Cook County Zone Lookup');
                            }
    
                            setCalculatedValues(prevState => ({
                                ...prevState,
                                incorp_unincorp_state: {
                                    ...prevState.incorp_unincorp_state,
                                    label: muniValue,
                                    description: translateText('Municipality'),
                                    type: null
                                },
                                zoning_info: {
                                    ...prevState.zoning_info,
                                    label: message,
                                    description: translateText('Zoning Information'),
                                    type: muniValueReturned ? null : 'link'
                                }
                            }));
                        }

                        //PROPERTY COMPARISON
                        if(field === 'comparable_properties'){
                            setCalculatedValues(prevState => ({
                                ...prevState,
                                comparable_properties: {
                                    ...prevState.comparable_properties,
                                    label: translateText("Comparable Properties"),
                                    description:data.attributes['label'],
                                    type: 'button'
                                },
                            }));
                        }

                        if(field === 'nearby_properties'){
                            setCalculatedValues(prevState => ({
                                ...prevState,
                                nearby_properties: {
                                    ...prevState.nearby_properties,
                                    label: translateText("Nearby Parcels"),
                                    description:data.attributes['label'],
                                    type: 'button'
                                }
                            }));
                        }

                        //EXTERNAL LINKS
                        //Determine if links should be shown based on 
                        //property classification
                        if(field.endsWith('_link')){

                            console.log("Link field: ", field)
                            setCalculatedValues(prevState => {
                                const updatedState = { ...prevState };
                        
                                // Dynamically update or add the new field
                                if (!updatedState[field]) {
                                    updatedState[field] = {
                                        label: '',
                                        description: '',
                                        type: null
                                    };
                                }
                        
                                updatedState[field] = {
                                    ...updatedState[field],  // Preserve the existing values if the field exists
                                    label: data.attributes['hyperlink_text'] || updatedState[field].label,
                                    description: data.attributes['credit'] || updatedState[field].description,
                                    type: 'link'  // Adjust as needed
                                };
                        
                                return updatedState;
                            })
                        }

                    }
                });
    
                // Wait for all async operations to complete
                await Promise.all(promises);

                console.log("calculated values use effect: ", calculatedValues)
            }
        };
        
        if(primaryResultFeature){
            calculateFieldValues(primaryResultFeature[0]);
        }
        

    }, [primaryResultFeature, dataDictionary]);
    


    return (
            <CalcitePanel 
                id="property-detail-panel" 
                closed={propertyDetailPanelClosed} 
                closable 
                className='panel-start' 
                
                heading={translateText('Property Detail')}
                overlayPositioning="fixed"
                onCalcitePanelClose={() => {
                    setPropertyDetailPanel(true)
                }}
                //KEEP THIS SO PANELS CANT TAKE UP THE WHOLE SPACE OF THE SHELL
                style={{display: propertyDetailPanelClosed ? 'none': 'flex'}}
                >   
                    
                        
                    
                    {/* SEARCH RESULT ACTIONS */}
                    <CalciteActionBar slot="action-bar" layout="horizontal" expandDisabled> 
                        <CalciteAction 
                            text="clear" 
                            icon="reset" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                            onClick={clearResults}
                        ></CalciteAction>
                        <CalciteAction 
                            text="export" 
                            icon="export" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                           //onClick={() => {setOpenExportDialog(true)}}
                        ></CalciteAction>
                        <CalciteAction 
                            text="feedback" 
                            icon="speech-bubble-exclamation" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                        />
                    </CalciteActionBar>
                    
                        {
                            (primaryResultFeature && categories && headerData) ? 

                            <>   
                            <div slot="content-top">
                            <CalciteLabel scale="l"className='DetailHeader' >
                                { headerData[Object.keys(headerData)[0]]}
                            </CalciteLabel>
                            <CalciteLabel scale="m" class='DetailHeader'>
                                {`${headerData[Object.keys(headerData)[1]]}, ${headerData[Object.keys(headerData)[2]]}`}
                            </CalciteLabel>
                            </div>

                            
                            
                            <CalciteList
                            label={ headerData ? headerData[Object.keys(headerData)[0]]:null}
                            filterEnabled
                            filterPlaceholder={"Filter property details"}
                            interactionMode="static"
                            selectionMode="none"
                            >
                            
                            {categories?.map(category => {
                                return(
                                    <CalciteListItemGroup key={category} heading={translateText(category)}>
                                        {
                                            dataDictionary
                                            ?.filter((data) => data.attributes['category'] === category)
                                            .map((data, i) => {

                                                //check if data type is text and check if value is not null for selected parcel
                                                if(['text' , 'text or int'].includes(data?.attributes['type'])){
                                                    if(primaryResultFeature[0]?.attributes[data?.attributes['field']]){
                                                        return(
                                                            <CalciteListItem
                                                                key={data?.attributes['field']}
                                                                label={primaryResultFeature[0]?.attributes[data?.attributes['field']]}
                                                                description={data?.attributes['label']}
                                                                >
                                                            </CalciteListItem>
                                                        )
                                                    }

                                                    //TODO REMOVE HARD CODED VALUE
                                                    else if(data?.attributes['field'] === 'View District Details'){
                                                        return(
                                                            <CalciteListItem
                                                            key={data?.attributes['field']}
                                                            label={translateText(data?.attributes['field'])}
                                                            >
                                                                <div slot="content">
                                                                    <CalciteButton
                                                                    class='hyperlink-button' 
                                                                    label={translateText(data?.attributes['field'])}
                                                                    iconStart="launch"
                                                                    //href={hyperlink} 
                                                                    target="_blank"
                                                                    scale='m'
                                                                    >
                                                                        {translateText(data?.attributes['field'])}
                                                                    </CalciteButton>
                                                                    <CalciteLabel scale='s' class='description'>
                                                                        {data?.attributes['label']}
                                                                    </CalciteLabel>
                                                                </div>
                                                            </CalciteListItem>
                                                        )
                                                    }
                                                    
                                                }

                                                //check if data type is int or double and check if value is not null for selected parcel
                                                if(data?.attributes['type'] === 'int or double' && primaryResultFeature[0]?.attributes[data?.attributes['field']]){
                                                    return(
                                                        <CalciteListItem
                                                        key={data?.attributes['field']}
                                                        label={addCommaSeparator(primaryResultFeature[0]?.attributes[data?.attributes['field']], data?.attributes['type'])}
                                                        description={data?.attributes['label']}
                                                        >
                                                        </CalciteListItem>
                                                    )
                                                }

                                                //check if data type is money if value is not null for selected parcel
                                                if(data?.attributes['type'] === 'money' && primaryResultFeature[0]?.attributes[data?.attributes['field']]){
                                                    return(
                                                        <CalciteListItem
                                                        key={data?.attributes['field']}
                                                        label={`$${addCommaSeparator(primaryResultFeature[0]?.attributes[data?.attributes['field']], data?.attributes['type'])}`}
                                                        description={data?.attributes['label']}
                                                        >
                                                        </CalciteListItem>
                                                    )
                                                }

                                                //check if data type is money if value is not null for selected parcel
                                                if(data?.attributes['type'] === 'calc' || data?.attributes['type'] === 'button'){

                                                    if(calculatedValues[data?.attributes['field']]){
                                                        if(calculatedValues[data?.attributes['field']]['type']  === 'link'){
                                                            
                                                            if(Object.keys(conditional_links).includes(data?.attributes['field']) && !conditional_links[data?.attributes['field']].includes(parseInt(primaryResultFeature[0].attributes['BCLASS']))){
                                                                //console.log("Open data link to res data: ", data?.attributes['field'])
                                                                return null
                                                            }
                                                            
                                                            else{
                                                                const hyperlink = returnHyperlink(data.attributes['hyperlink_params'], data.attributes['hyperlink_url'], primaryResultFeature[0]?.attributes)
                                                                return(
                                                                    <CalciteListItem
                                                                    key={data?.attributes['field']}
                                                                    label={calculatedValues[data?.attributes['field']]['label']}
                                                                    description={calculatedValues[data?.attributes['field']]['description']}
                                                                    open
                                                                    >
                                                                        <div slot="content">
                                                                            <CalciteButton 
                                                                            class='hyperlink-button' 
                                                                            label={calculatedValues[data?.attributes['field']]['label']}
                                                                            iconStart="launch"
                                                                            href={hyperlink} 
                                                                            target="_blank"
                                                                            scale='m'
                                                                            >
                                                                                {calculatedValues[data?.attributes['field']]['label']}
                                                                            </CalciteButton>
                                                                            <CalciteLabel scale='s' class='description'>
                                                                                {calculatedValues[data?.attributes['field']]['description']}
                                                                            </CalciteLabel>
                                                                        </div>
                                                                    </CalciteListItem>
                                                                )
                                                            }
                                                            
                                                        }
                                                        if(calculatedValues[data?.attributes['field']]['type']  === 'button'){
                                                            return(
                                                                <CalciteListItem
                                                                key={data?.attributes['field']}
                                                                label={calculatedValues[data?.attributes['field']]['label']}
                                                                description={calculatedValues[data?.attributes['field']]['description']}
                                                                open
                                                                >
                                                                    <div slot="content">
                                                                        <CalciteButton 
                                                                        class='hyperlink-button' 
                                                                        label={calculatedValues[data?.attributes['field']]['label']}
                                                                        iconStart="launch"
                                                                        target="_blank"
                                                                        scale='m'
                                                                        onClick={() => {handleClick(data?.attributes['field'])}}
                                                                        >
                                                                            {calculatedValues[data?.attributes['field']]['label']}
                                                                        </CalciteButton>
                                                                        <CalciteLabel scale='s' class='description'>
                                                                            {calculatedValues[data?.attributes['field']]['description']}
                                                                        </CalciteLabel>
                                                                    </div>
                                                                </CalciteListItem>
                                                            )
                                                        }
                                                        else{
                                                            return(
                                                                <CalciteListItem
                                                                key={data?.attributes['field']}
                                                                label={calculatedValues[data?.attributes['field']]['label']}
                                                                description={calculatedValues[data?.attributes['field']]['description']}
                                                                >
                                                                </CalciteListItem>
                                                            )

                                                        }
                                                        
                                                    }

                                                    
                                                    
                                                }

                                                
                                            })
                                        }
                                    </CalciteListItemGroup>
                                )
                            })
                            
                        

                            }
                            </CalciteList>
                            </> 

                : 
                <Inactive/>
                }


            </CalcitePanel>
    )
}

export default PanelPropertyDetail;