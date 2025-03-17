import { CalciteAction, CalciteActionBar, CalciteActionGroup } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ActionBarStart = () => {

    const { translateText, togglePanel, infoPanelClosed, searchResultsPanelClosed, propertyDetailPanelClosed } = UseAppContext()

    return(
        <CalciteActionBar slot="action-bar" expanded>
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