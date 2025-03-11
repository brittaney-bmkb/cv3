'use client'

import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalciteButton, 
    CalciteLabel, 
    CalciteLink, 
    CalciteList, 
    CalciteListItem, 
    CalciteListItemGroup, 
    CalcitePanel, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";
import { returnMunicipality } from "../../arcgis/geoprocessing/geoprocessing"
import { config } from "../../data/config";
import { useEffect, useState } from "react";
import { ListItem } from "@mui/material";


//TODO - Update Export dialog and add trigger to export action
//TODO - Update Feedback dialog and add trigger to feedback action

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


const PanelSearchResults = () => {

    const { 
        searchTerm, 
        searchBufferGeometry, 
        searchFeatures, 
        translateText, 
        propertyDetailPanelClosed, 
        setPropertyDetailPanel, 
        clearResults,
        dataDictionary,
        primaryResultFeature
    } = UseAppContext()

    const [ categories, setCategories ] = useState(null)
    
    const [ calculatedValues, setCalculatedValues ] = useState({
        incorp_unincorp_state: {
            label: '',
            description: '',
            button: false
        },
        zoning_info: {
            label: '',
            description: '',
            button: true
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
                // Create an array of promises for all the async tasks
                const promises = dataDictionary.map(async (data) => {
                    if (data.attributes['type'] === 'calc') {
                        if (data.attributes['field'] === 'incorp_unincorp_state') {
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
                                    button: false
                                },
                                zoning_info: {
                                    ...prevState.zoning_info,
                                    label: message,
                                    description: translateText('Zoning Information'),
                                    button: muniValueReturned ? false : true
                                }
                            }));

                            
                        }
                    }
                });
    
                // Wait for all async operations to complete
                await Promise.all(promises);

                console.log("calculated values use effect: ", calculatedValues)
            }
        };
    
        calculateFieldValues(primaryResultFeature[0]);

    }, [primaryResultFeature, dataDictionary]);
    


    return (
            <CalcitePanel 
                id="property-detail-panel" 
                closed={propertyDetailPanelClosed} 
                closable 
                class='panel-start' 
                heading={translateText('Property Detail')} 
                overlayPositioning="fixed"
                calcitePanelClose={() => {
                    setPropertyDetailPanel(true)
                }}
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
        
                    <CalciteBlock open collapsible={false}>
                    {!searchFeatures ?  translateText(`Search for new property`)
                    
                        : 

                        //Property Details
                        <CalciteList
                         filterEnabled
                         filterPlaceholder={"Filter property details"}
                         interactionMode="static"
                         selectionMode="none"
                        >
                            {
                                primaryResultFeature && categories?.map( category => {
                                    return(
                                        <CalciteListItemGroup heading={translateText(category)}>
                                            {
                                                dataDictionary
                                                ?.filter((data) => data.attributes['category'] === category)
                                                .map((data, i) => {

                                                    //check if data type is text and check if value is not null for selected parcel
                                                    if(data?.attributes['type'] === 'text' && primaryResultFeature[0]?.attributes[data?.attributes['field']]){
                                                        return(
                                                            <CalciteListItem
                                                            key={data?.attributes['field']}
                                                            label={primaryResultFeature[0]?.attributes[data?.attributes['field']]}
                                                            description={data?.attributes['label']}
                                                            >
                                                            </CalciteListItem>
                                                        )
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
                                                    if(data?.attributes['type'] === 'calc'){

                                                        if(calculatedValues[data?.attributes['field']]){
                                                            if(calculatedValues[data?.attributes['field']]['button']){
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
                                                                            label={calculatedValues[data?.attributes['field']]['label']}
                                                                            iconStart="launch"
                                                                            href={hyperlink} 
                                                                            target="_blank"
                                                                            scale='m'>
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
                    }
                    
                    

                    </CalciteBlock>
            </CalcitePanel>
    )
}

export default PanelSearchResults;