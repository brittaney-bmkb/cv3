import { CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const NearbyPanel = () => {
    const  { nearbyPanelClosed, setNearbyPanel, translateText } = UseAppContext()
    return(
        <CalcitePanel 
            id="nearby-panel" 
            closed={nearbyPanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText('Nearby Search')} 
            //description= {translateText("Search for similar properties")}
            onCalcitePanelClose={() => {
                setNearbyPanel(true)
            }}
            style={{display: nearbyPanelClosed ? 'none': 'flex'}}
            >  
        </CalcitePanel>
    )
}

export default NearbyPanel