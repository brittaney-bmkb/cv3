import { CalciteAction, CalciteActionPad } from "@esri/calcite-components-react"
import "@esri/calcite-components/dist/components/calcite-action-pad"
import UseAppContext from "../../contexts/AppContext"

const ActionBarMap = () => {

    const { 
        translateText, 
        togglePanel, 
        layersPanelClosed,
        imageryPanelClosed,
        printPanelClosed,
        selectPanelClosed
     } = UseAppContext()

    return(
        <CalciteActionPad
        position="end"
        scale="s"
        expanded={false}
        >
            <CalciteAction 
                active={!layersPanelClosed}
                text={translateText("Layers")} 
                icon="layers" 
                textEnabled 
                scale="s"
                onClick={() => {
                    togglePanel('layers')
                }}>
            </CalciteAction>

            <CalciteAction 
                active={!imageryPanelClosed}
                text={translateText("Imagery")} 
                icon="basemap" 
                textEnabled 
                scale="s"
                onClick={() => {
                    togglePanel('imagery')
                }}>
            </CalciteAction>

            <CalciteAction 
                active={!printPanelClosed}
                text={translateText("Print")} 
                icon="print" 
                textEnabled 
                scale="s"
                onClick={() => {
                    togglePanel('print')
                }}>
            </CalciteAction>

            <CalciteAction 
                active={!selectPanelClosed}
                text={translateText("Select")} 
                icon="select" 
                textEnabled 
                scale="s"
                onClick={() => {
                    togglePanel('select')
                }}>
            </CalciteAction>

            <CalciteAction 
                //active={!selectPanelClosed}
                text={translateText("Measure")} 
                icon="measure" 
                textEnabled 
                scale="s"
                // onClick={() => {
                //     togglePanel('select')
                // }}
                >
            </CalciteAction>
        </CalciteActionPad>
    )
}

export default ActionBarMap