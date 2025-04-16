import Portal from "@arcgis/core/portal/Portal.js";
import { Box, MenuItem, Select, Typography, Stack, TextField } from "@mui/material"
import { CalciteBlock, CalcitePanel, CalciteButton  } from "@esri/calcite-components-react";
import UseAppContext from "../../contexts/AppContext";
import "@arcgis/map-components/components/arcgis-area-measurement-2d";
import "@arcgis/map-components/components/arcgis-distance-measurement-2d";
import { config } from "../../data/config";
import { useEffect, useRef, useState  } from "react";


//TODO ADD PRINT TEMPLATES
const Measure = () => {

    const { measurePanelClosed, setMeasurePanel, translateText, arcgisMapRef, setMeasureWidgetState, measureWidgetState } = UseAppContext()
    const [showMeasurement, setShowMeasurement] = useState(false);
    
    const measureAreaRef = useRef(null)
    const measureDistanceRef = useRef(null)

    const handleClosePrintPanel = () => {
        setMeasurePanel(true)
    }

    // useEffect(() => {
    //     if(measureRef.current && measurePanelClosed){
    //         if(measureRef.current.showPrintAreaEnabled){
    //             measureRef.current.showPrintAreaEnabled = false
    //         }
    //     }
    // },  [arcgisMapRef, measureRef, measurePanelClosed])


    // useEffect(() => {

    //     if(arcgisMapRef.current && measureRef.current && !measureRef.current.referenceElement){
    //         measureRef.current.referenceElement = arcgisMapRef.current
    //     }
    // },  [arcgisMapRef.current, measureRef.current])

    // useEffect( () => {
    //     () => measureAreaRef.current?.viewModel?.active,
    //     (active) => {
    //         if (active) {
    //             console.log("MEASUREMENT TRUE measureAreaRef: ", measureAreaRef.current?.viewModel?.active)
    //             console.log("MEASUREMENT CURRENT NEST TRUE measureAreaRef: ", measureAreaRef)
    //             setMeasureWidgetState(true)
    //         } else {
    //             console.log("MEASUREMENT FALSE measureAreaRef: ", measureAreaRef.current?.viewModel?.active)
    //             console.log("MEASUREMENT CURRENT NEST FALSE measureAreaRef: ", measureAreaRef)
    //             setMeasureWidgetState(false)
    //         }
    //     }
        
    //     () => measureDistanceRef.current?.viewModel?.active,
    //     (active) => {
    //         if (active){
    //         console.log("MEASUREMENT measureDistanceRef: ", measureDistanceRef.current?.viewModel?.active)
    //         console.log("MEASUREMENT CURRENT NEST measureDistanceRef: ", measureDistanceRef)
    //     }   else {
    //         setMeasureWidgetState(false)
    //     }     

    // }})
    useEffect( () => {

        // console.log("MEASUREMENT TRUE measureAreaRef: ", measureAreaRef.current?.viewModel?.active)
        // console.log("MEASUREMENT CURRENT NEST TRUE measureAreaRef: ", measureAreaRef)
        // console.log("MEASUREMENT measureDistanceRef: ", measureDistanceRef.current?.viewModel?.active)
        // console.log("MEASUREMENT CURRENT NEST measureDistanceRef: ", measureDistanceRef)

                if (measureAreaRef.current?.viewModel?.active || measureDistanceRef.current?.viewModel?.active) {
        // console.log("MEASUREMENT ACTIVE: ", );
            console.log("MEASUREMENT measureAreaRef: ", measureAreaRef.current?.viewModel?.active)
            // console.log("MEASUREMENT CURRENT NEST measureAreaRef: ", measureAreaRef)
            console.log("MEASUREMENT measureDistanceRef: ", measureDistanceRef.current?.viewModel?.active)
            // console.log("MEASUREMENT CURRENT NEST measureDistanceRef: ", measureDistanceRef)            
            setMeasureWidgetState(true);
        } else {
            // console.log("MEASUREMENT measureAreaRef: ", measureAreaRef.current?.viewModel?.active)
            // console.log("MEASUREMENT CURRENT NEST measureAreaRef: ", measureAreaRef)
            // console.log("MEASUREMENT measureDistanceRef: ", measureDistanceRef.current?.viewModel?.active)
            // console.log("MEASUREMENT CURRENT NEST measureDistanceRef: ", measureDistanceRef)  
            setMeasureWidgetState(false);
        }
    
    })
    // useEffect( () => {
    //     const areaActive = measureAreaRef.current?.viewModel?.active;
    //     const distanceActive = measureDistanceRef.current?.viewModel?.active;
    //     // console.log("MEASUREMENT areaActive: ", measureAreaRef.current?.viewModel?.active)
    //     // console.log("MEASUREMENT distanceActive: ", measureAreaRef.current?.viewModel?.active)
    //     console.log("MEASUREMENT areaActive: ", areaActive)
    //     console.log("MEASUREMENT distanceActive: ", distanceActive)

    //     // if (areaActive || distanceActive) {
    //     // // console.log("MEASUREMENT ACTIVE: ", );
    //     //     console.log("MEASUREMENT measureAreaRef: ", measureAreaRef.current?.viewModel?.active)
    //     //     // console.log("MEASUREMENT CURRENT NEST measureAreaRef: ", measureAreaRef)
    //     //     console.log("MEASUREMENT measureDistanceRef: ", measureDistanceRef.current?.viewModel?.active)
    //     //     // console.log("MEASUREMENT CURRENT NEST measureDistanceRef: ", measureDistanceRef)            
    //     //     setMeasureWidgetState(true);
    //     // } else {
    //     //     // console.log("MEASUREMENT measureAreaRef: ", measureAreaRef.current?.viewModel?.active)
    //     //     // console.log("MEASUREMENT CURRENT NEST measureAreaRef: ", measureAreaRef)
    //     //     // console.log("MEASUREMENT measureDistanceRef: ", measureDistanceRef.current?.viewModel?.active)
    //     //     // console.log("MEASUREMENT CURRENT NEST measureDistanceRef: ", measureDistanceRef)  
    //     //     setMeasureWidgetState(false);
    //     // }

    //     // console.log("Area ViewModel:", measureAreaRef.current?.viewModel);
    //     // console.log("Distance ViewModel:", measureDistanceRef.current?.viewModel);
    

    // } , [])


    return(
        <CalcitePanel
            closed={measurePanelClosed}
            closable
            heading={translateText("Measure")}
            style={{display: measurePanelClosed ? 'none': 'flex'}}
            onCalcitePanelClose={() => { handleClosePrintPanel() }}
        >
            <CalciteBlock
                open
                heading={translateText("Area")}
                description={translateText("Calculate and display the area and perimeter of a polygon. Start a new measurement in order to clear.")}
                // style={{height: '50%', overflow:'clip', display: 'flex', flexDirection: "column", gap: '5px',}}
                collapsible = "true"
                iconStart = "measure-area"
                label = "Measure Area in order to calculate and display the area and perimeter of a polygon. "
            >   
                <arcgis-area-measurement-2d
                    ref={measureAreaRef}
                    referenceElement={arcgisMapRef.current ? arcgisMapRef.current : null}
                    unit = "square-us-feet"
                />

            </CalciteBlock>

            <CalciteBlock
                open
                heading={translateText("Distance")}
                description={translateText("Calculate the distance between two or more points. Start a new measurement in order to clear.")}
                // style={{height: '40%', overflow:'clip', display: 'flex', flexDirection: "column", gap: '5px',}}
                collapsible ="true"
                iconStart = "measure-line"
                label = "Measure distance in order to calculate and display the area and perimeter of a polygon. "
                    
            >   
                <arcgis-distance-measurement-2d
                    ref={measureDistanceRef}
                    referenceElement={arcgisMapRef.current ? arcgisMapRef.current : null}
                    unit = "us-feet"
                />
            </CalciteBlock>
        </CalcitePanel>
    )
}

export default Measure