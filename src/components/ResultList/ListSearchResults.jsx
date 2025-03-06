
import { CalciteChip, CalciteIcon, CalciteLabel, CalciteList, CalciteListItem } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ListSearchResults = () => {
    
    const {searchFeatures} = UseAppContext()
    
    return(
        <CalciteList>
        {
            searchFeatures?.map(feature => {
                return(
                    <CalciteListItem 
                    key={feature.attributes['PIN14_dash']} 
                    label={feature.attributes['PIN14_dash']}
                    selectionAppearance="border"
                    selectionMode="multiple"
                    
                    >
                    <div slot="content" style={{display: "flex",}}>
                    <CalciteIcon icon="pin"/>
                        <div>
                        
                        <CalciteLabel scale="l">
                            {feature.attributes['PIN14_dash']}
                        </CalciteLabel>

                            <CalciteLabel>
                                {feature.attributes['street_address']}
                            </CalciteLabel>
                            <CalciteLabel>
                                {feature.attributes['city_state_zip']}
                            </CalciteLabel>
                        </div>
                        
     
                        
                    </div>
                        
                    </CalciteListItem>
                )
            })
        }
        </CalciteList>
    )
}

export default ListSearchResults