
import { CalciteLabel, CalciteList, CalciteListItem } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"
import { config } from "../../data/config"

const ListSearchResults = () => {
    
    const {
        searchFeatures, 
        selectResultFromList, 
        setSearchBufferGeometry,
        togglePanel,
        primaryResultFeature
    } = UseAppContext()
    
    const [ selectedPIN14, setSelectedPIN14 ] = useState()

    useEffect(() => {

        const pin14 = primaryResultFeature[0].attributes[config.target_layer_display_field]
        setSelectedPIN14(pin14)

    }, [primaryResultFeature])

    return(
        <CalciteList
        selectionAppearance="border"
        selectionMode="single"
        >
        {
            searchFeatures?.map(feature => {

                if(feature.attributes){
                    return(
                        <CalciteListItem 
                            key={feature.attributes['PIN14_dash']} 
                            label={feature.attributes['PIN14_dash']}
                            selectionAppearance="border"
                            selectionMode="single"
                            iconEnd="pin"
                            selected={feature.attributes['PIN14_dash'] === selectedPIN14}
                            onCalciteListItemSelect={() => {
                                selectResultFromList(feature.attributes['PIN14_dash'])
                                setSearchBufferGeometry(null, null)
                                togglePanel('property')
    
                            }}
                        >
                        <div slot="content" className="description" style={{marginLeft:'10px'}}>
                            <CalciteLabel scale="m" >
                                <span>
                                {`PIN: ${feature.attributes['PIN14_dash']}`}
                                </span>
                            </CalciteLabel>
                            <CalciteLabel scale="s" >
                                <span>
                                {feature.attributes['street_address']}<br/>{feature.attributes['city_state_zip']}
                                </span>
                            </CalciteLabel>
    
                            
                        </div>
                            
                            
                        </CalciteListItem>
                    )
                }
                
            })
        }
        </CalciteList>
    )
}

export default ListSearchResults