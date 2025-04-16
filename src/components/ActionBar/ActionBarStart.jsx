import { CalciteAction, CalciteActionBar, CalciteActionGroup } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ActionBarStart = () => {

    const { 
        translateText, 
        togglePanel, 
        infoPanelClosed, 
        searchResultsPanelClosed, 
        propertyDetailPanelClosed, 
        isMobile,
        comparablePanelClosed,
        nearbyPanelClosed
    } = UseAppContext()

    return(
        <CalciteActionBar 
        slot="action-bar" 
        layout={isMobile ? 'horizontal' : 'vertical'}
        expandDisabled = {isMobile}
        scale={isMobile ? 's' :'m'}
        expanded>
            <CalciteActionGroup  
            slot="actions-end">
                <CalciteAction text={translateText("Info")} icon="information" textEnabled={isMobile ? false : true} active={!infoPanelClosed}
                onClick={() => {
                    togglePanel('info')
                    }}></CalciteAction>
                <CalciteAction text={translateText("Tour")} icon="play" textEnabled={isMobile ? false : true} active={!infoPanelClosed}
                onClick={() => {
                    togglePanel('tour')
                    }}></CalciteAction>
            </CalciteActionGroup>
            <CalciteActionGroup
            className="start-actions"
            >
                <CalciteAction text={translateText("Results")} icon="list-rectangle" textEnabled={isMobile ? false : true} active={!searchResultsPanelClosed}
                onClick={() => {
                    togglePanel('search')
                    }}></CalciteAction>
                <CalciteAction text={translateText("Property")} icon="pin" textEnabled={isMobile ? false : true} active={!propertyDetailPanelClosed}
                onClick={() => {
                    togglePanel('property')
                }}></CalciteAction>

                {
                    isMobile ? 
                <>
                
                <CalciteAction text={translateText("Compare")} icon="compare" textEnabled={isMobile ? false : true} active={!comparablePanelClosed}
                onClick={() => {
                    togglePanel('compare')
                }}></CalciteAction>
                <CalciteAction text={translateText("Nearby")} icon="rings-largest" textEnabled={isMobile ? false : true} active={!nearbyPanelClosed}
                onClick={() => {
                    togglePanel('nearby')
                }}></CalciteAction>

                </>
                :null
            }
            </CalciteActionGroup>
        </CalciteActionBar>
    )
}
export default ActionBarStart