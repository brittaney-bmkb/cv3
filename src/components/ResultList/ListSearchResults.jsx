
import { CalciteLabel, CalciteList, CalciteListItem } from "@esri/calcite-components-react"
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
                    open
                    >
                    <div slot="default">
                        <CalciteLabel>
                        
                        </CalciteLabel>
                        <CalciteLabel>
                            {feature.attributes['street_address']}
                        </CalciteLabel>
                        <CalciteLabel>
                            {feature.attributes['city_state_zip']}
                        </CalciteLabel>
                    </div>
                        
                    </CalciteListItem>
                )
            })
        }
        </CalciteList>
    )
}

export default ListSearchResults