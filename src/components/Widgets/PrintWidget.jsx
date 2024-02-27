import { Box } from "@mui/material"
import Print from "@arcgis/core/widgets/Print.js";
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef } from "react";
import { view } from "../../arcgis/webmap/webmap";
import Portal from "@arcgis/core/portal/Portal.js";
import { config } from "../../data/config";


// this lifted from comparable property search and will needed to be updated for this widget
const MeasureWidget = () => {

    const { setPanelSecondaryVisibility, setPanelDisplaySecondary } = UseAppContext()

    const printDiv = useRef()
    const printWidget = useRef()

    useEffect(() => {
        
        const initializePrintWidget = () => {
            if(printDiv.current){
                if(!printWidget.current){
                    printWidget.current = new Print({
                        view: view,
                        container: printDiv.current,
                        source: new Portal({url: config.portal}),
                        label:"print"
                    })
                }
            }
        }

        initializePrintWidget();
        
    
    },[view, printWidget, printDiv])

    return(
        <Box ref={printDiv} display="flex" flexDirection="column" rowGap={2}>

        </Box>
        
    )
}

export default MeasureWidget