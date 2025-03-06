import { CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const PanelPropertyDetail = () => {
    const { translateText, propertyDetailPanelClosed, setPropertyDetailPanel } = UseAppContext()
    return(
         <CalcitePanel 
            heading={translateText('Property Detail')}
            overlayPositioning="fixed" 
            scale="m" 
            id="search-results-panel" 
            closeable 
            closed={propertyDetailPanelClosed} 
            class='panel-start' 
            calcitePanelClose={() => {
                setPropertyDetailPanel(true)
            }}
            style={{display: propertyDetailPanelClosed ? 'none': 'flex'}}>

        </CalcitePanel>
    )
}

export default PanelPropertyDetail