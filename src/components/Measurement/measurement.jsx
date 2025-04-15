import Portal from "@arcgis/core/portal/Portal.js";
import { CalciteBlock, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import "@arcgis/map-components/components/arcgis-area-measurement-2d";
import { config } from "../../data/config";
import { useEffect, useRef } from "react";


//TODO ADD PRINT TEMPLATES
const Measure = () => {

    const { measurePanelClosed, setMeasurePanel, translateText, arcgisMapRef } = UseAppContext()
    
    const printRef = useRef(null)

    const handleClosePrintPanel = () => {

        setMeasurePanel(true)
    }

    // let portal = new Portal({
    //     url: config.portal// First instance
    //   });


    useEffect(() => {

        if(printRef.current && measurePanelClosed){
            if(printRef.current.showPrintAreaEnabled){
                printRef.current.showPrintAreaEnabled = false
            }
            
        }


    },  [arcgisMapRef, printRef, measurePanelClosed])


    // useEffect(() => {

    //     if(arcgisMapRef.current && printRef.current && !printRef.current.referenceElement){
    //         printRef.current.referenceElement = arcgisMapRef.current
    //     }
    // },  [arcgisMapRef.current, printRef.current])

    return(
        <CalcitePanel
        closed={measurePanelClosed}
        closable
        heading={translateText("Measure")}
        style={{display: measurePanelClosed ? 'none': 'flex'}}
        onCalcitePanelClose={() => {
            handleClosePrintPanel()
        }}
        >

                <arcgis-area-measurement-2d
                ref={printRef}
                referenceElement={arcgisMapRef.current ? arcgisMapRef.current : null}
                //portal={portal ? portal : null}
                //style={{overflow:'auto', height: '100%'}}
                // showPrintAreaEnabled
                />

        </CalcitePanel>
    )
}

export default Measure