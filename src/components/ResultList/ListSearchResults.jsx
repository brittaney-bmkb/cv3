
import { CalciteList, CalciteListItem } from "@esri/calcite-components-react"
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
                    selectionMode="none"
                    />
                )
            })
        }
        </CalciteList>
    )
}

export default ListSearchResults