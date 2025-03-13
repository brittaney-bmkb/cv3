import Portal from "@arcgis/core/portal/Portal.js";
import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-print";
import { config } from "../../data/config";
import { useRef } from "react";


//TODO ADD PRINT TEMPLATES
const Print = () => {

    const { printPanelClosed, setPrintPanel, translateText, arcgisMapRef } = UseAppContext()
    
    const printRef = useRef(null)

    const handleClosePrintPanel = () => {

        if(printRef.current){
            printRef.current.destroy()
        }

        setPrintPanel(true)
    }

    let portal = new Portal({
        url: config.portal// First instance
      });

    return(
        <CalcitePanel
        closed={printPanelClosed}
        closable
        heading={translateText("Print")}
        style={{display: printPanelClosed ? 'none': 'flex'}}
        onCalcitePanelClose={() => {
            handleClosePrintPanel()
        }}
        >
            {
                arcgisMapRef.current ? 
                <CalciteBlock
                open
                //style={{height: '95%', overflow:'clip'}}
                >   
                <arcgis-print
                ref={printRef}
                referenceElement={arcgisMapRef.current}
                portal={portal}
                style={{overflow:'auto', height: '100%'}}
                //showPrintAreaEnabled
                />
            </CalciteBlock> : null
            }
            

        </CalcitePanel>
    )
}

export default Print