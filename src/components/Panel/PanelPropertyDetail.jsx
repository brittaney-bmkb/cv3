'use client'

import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
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
    const [ muni, setMuni ] = useState({})

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

    const calculateFieldValues = async (feature, field) => {
            if(field === 'incorp_unincorp_state'){
                let message
                const muniValueReturned = await returnMunicipality(feature);
                const muniValue = muniValueReturned ? 
                `${translateText('Incorporated')} ${muniValueReturned}` : 
                `${translateText('Unincorporated')} ${feature.attributes['township_name']}`

                if(muniValueReturned){
                    message = translateText('Please contact municipality')
                }
                else{
                    message = translateText('Cook County Zone Lookup')
                }
                console.log("muni: ", muniValue, message)
                return(
                    <CalciteListItem 
                    key={field}
                    label={muniValue}
                    description={message}
                    />
                )
            }
            else{
                return null
                
            }
        }



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
                                                        calculateFieldValues(primaryResultFeature[0], data?.attributes['field'])
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