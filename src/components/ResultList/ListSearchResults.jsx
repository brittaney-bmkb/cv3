
import { CalciteLabel, CalciteList, CalciteListItem } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ListSearchResults = () => {
    
    const {
        searchFeatures, 
        selectResultFromList, 
        setSearchBufferGeometry,
        setSearchResultsPanel,
        setInfoPanel,
        setPropertyDetailPanel
    } = UseAppContext()
    
    return(
        <CalciteList
        selectionAppearance="border"
        selectionMode="single"
        >
        {
            searchFeatures?.map(feature => {
                return(
                    <CalciteListItem 
                        key={feature.attributes['PIN14_dash']} 
                        label={feature.attributes['PIN14_dash']}
                        selectionAppearance="border"
                        selectionMode="single"
                        iconEnd="pin"
                        onCalciteListItemSelect={() => {
                            selectResultFromList(feature.attributes['PIN14_dash'])
                            setSearchBufferGeometry(null, null)
                            setSearchResultsPanel(true)
                            setInfoPanel(true)
                            setPropertyDetailPanel(false)

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
            })
        }
        </CalciteList>
    )
}

export default ListSearchResults