import { CalciteAction, CalciteActionBar, CalciteActionGroup } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ActionBarStart = () => {

    const { 
        translateText, 
        togglePanel, 
        infoPanelClosed, 
        searchResultsPanelClosed, 
        propertyDetailPanelClosed, 
        isMobile 
    } = UseAppContext()

    return(
        <CalciteActionBar 
        slot="action-bar" 
        layout={isMobile ? 'horizontal' : 'vertical'}
        expandDisabled = {isMobile}
        scale={isMobile ? 's' :'m'}
        expanded>
            <CalciteActionGroup>
                <CalciteAction text={translateText("Info")} icon="information" textEnabled active={!infoPanelClosed}
                onClick={() => {
                    togglePanel('info')
                    }}></CalciteAction>
                <CalciteAction text={translateText("Results")} icon="list-rectangle" textEnabled active={!searchResultsPanelClosed}
                onClick={() => {
                    togglePanel('search')
                    }}></CalciteAction>
                <CalciteAction text={translateText("Property")} icon="pin" textEnabled active={!propertyDetailPanelClosed}
                onClick={() => {
                    togglePanel('property')
                }}></CalciteAction>
            </CalciteActionGroup>
        </CalciteActionBar>
    )
}
export default ActionBarStart