
import { CalciteLabel, CalciteList, CalciteListItem } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ListComparisonResults = ({refElement, setCurrentStep}) => {
    
    const {
        comparableParcels, 
        setSecondaryResultFeature, 
        secondaryResultFeature
    } = UseAppContext()

    const handleSelect = async (feature) => {

        console.log("selecting feature: ", feature)
        setSecondaryResultFeature(feature)
        //togglePanel('compareDetail')
        if(!refElement) return;
        setCurrentStep(2)
        refElement.nextStep()

    }
    
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
                        onCalciteListItemSelect={() => {handleSelect(feature)}}
                        selected={secondaryResultFeature?.attributes['PIN14_dash'] === feature.attributes['PIN14_dash'] }
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

export default ListComparisonResults