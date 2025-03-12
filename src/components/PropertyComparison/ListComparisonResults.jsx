
import { CalciteLabel, CalciteList, CalciteListItem } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ListComparisonResults = () => {
    
    const {
        comparableParcels, 
        setSecondaryResultFeature, 
        setComparisonResultsPanel,
        setNearbyPanel
    } = UseAppContext()
    
    return(
        <CalciteList
        selectionAppearance="border"
        selectionMode="single"
        >
        {
            comparableParcels?.map(feature => {
                return(
                    <CalciteListItem 
                        key={feature.attributes['PIN14_dash']} 
                        label={feature.attributes['PIN14_dash']}
                        selectionAppearance="border"
                        selectionMode="single"
                        iconEnd="pin"
                        onCalciteListItemSelect={() => {
                            setSecondaryResultFeature(feature.attributes['PIN14_dash'])
                            setComparisonResultsPanel(true)
                            setNearbyPanel(true)
                        }}
                    >
                    <div slot="content" class="description" style={{marginLeft:'10px'}}>
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

export default ListComparisonResults