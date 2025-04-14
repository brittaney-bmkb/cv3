import { CalciteAction, CalciteActionBar, CalciteActionGroup } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const ActionBarEnd = () => {

    const { 
        translateText, 
        togglePanel, 
        nearbyPanelClosed, 
        layersPanelClosed, 
        imageryPanelClosed, 
        printPanelClosed, 
        selectPanelClosed,
        comparablePanelClosed,
        comparableParcels,
        isMobile
     } = UseAppContext()

    return(
            <CalciteActionBar 
            slot="action-bar" 
            layout={isMobile ? 'horizontal' : 'vertical'}
            expandDisabled = {isMobile}
            scale={isMobile ? 's' :'m'}
            
            expanded>
                <CalciteActionGroup
                layout={isMobile ? 'horizontal' : 'vertical'}
                expandDisabled = {isMobile}
                scale={isMobile ? 's' :'m'}
                expanded
                >
                    {
                        !isMobile ?
                    <>
                    
                    <CalciteAction 
                        active={!comparablePanelClosed}
                        text={translateText("Compare")} 
                        icon="compare" 
                        textEnabled 
                        onClick={() => {
                            togglePanel('compare')
                        }}>

                    </CalciteAction>
                    <CalciteAction 
                        active={!nearbyPanelClosed}
                        text={translateText("Nearby" )}
                        icon="rings-largest" 
                        textEnabled 
                        onClick={() => {
                            togglePanel('nearby')
                        }}>

                    </CalciteAction>
                    </>
                    :null
                    }
                    <CalciteAction 
                        active={!layersPanelClosed}
                        text={translateText("Layers")} 
                        icon="layers" 
                        textEnabled 
                        onClick={() => {
                            togglePanel('layers')
                        }}>
                    </CalciteAction>

                    <CalciteAction 
                        id="imagery"
                        active={!imageryPanelClosed}
                        text={translateText("Imagery")} 
                        icon="basemap" 
                        textEnabled 
                        onClick={() => {
                            togglePanel('imagery')
                        }}>
                    </CalciteAction>

                    <CalciteAction 
                        active={!printPanelClosed}
                        text={translateText("Print")} 
                        icon="print" 
                        textEnabled 
                        onClick={() => {
                            togglePanel('print')
                        }}>
                    </CalciteAction>

                    <CalciteAction 
                        active={!selectPanelClosed}
                        text={translateText("Select")} 
                        icon="select" 
                        textEnabled 
                        onClick={() => {
                            togglePanel('select')
                        }}>
                    </CalciteAction>

                    <CalciteAction 
                        //active={!selectPanelClosed}
                        text={translateText("Measure")} 
                        icon="measure" 
                        textEnabled 
                        // onClick={() => {
                        //     togglePanel('select')
                        // }}
                        >
                    </CalciteAction>

                    
                </CalciteActionGroup>
            </CalciteActionBar>
    )
}
export default ActionBarEnd