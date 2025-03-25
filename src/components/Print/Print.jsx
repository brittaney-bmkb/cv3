import Portal from "@arcgis/core/portal/Portal.js";
import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-print";
import { config } from "../../data/config";
import { useEffect, useRef } from "react";


//TODO ADD PRINT TEMPLATES
const Print = () => {

    const { printPanelClosed, setPrintPanel, translateText, arcgisMapRef } = UseAppContext()
    
    const printRef = useRef(null)

    const handleClosePrintPanel = () => {

        setPrintPanel(true)
    }

    let portal = new Portal({
        url: config.portal// First instance
      });


    useEffect(() => {

        if(printRef.current && printPanelClosed){
            if(printRef.current.showPrintAreaEnabled){
                printRef.current.showPrintAreaEnabled = false
            }
            
        }


    },  [arcgisMapRef, printRef, printPanelClosed])


    // useEffect(() => {

    //     if(arcgisMapRef.current && printRef.current && !printRef.current.referenceElement){
    //         printRef.current.referenceElement = arcgisMapRef.current
    //     }
    // },  [arcgisMapRef.current, printRef.current])

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

                <arcgis-print
                ref={printRef}
                referenceElement={arcgisMapRef.current ? arcgisMapRef.current : null}
                //portal={portal ? portal : null}
                //style={{overflow:'auto', height: '100%'}}
                showPrintAreaEnabled
                />

        </CalcitePanel>
    )
}

export default Print