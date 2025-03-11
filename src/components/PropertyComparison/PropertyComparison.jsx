import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const PropertyComparison = () => {

    const { translateText, setComparablePanel,  comparablePanelClosed} = UseAppContext()

    return(
        <CalcitePanel 
            id="comparable-panel" 
            closed={comparablePanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText('Comparable Search')} 
            //description= {translateText("Search for similar properties")}
            calcitePanelClose={() => {
                setComparablePanel(true)
            }}
            style={{display: comparablePanelClosed ? 'none': 'flex'}}
            >
               <CalciteBlock>
                test
               </CalciteBlock>
        </CalcitePanel>
    )
}

export default PropertyComparison