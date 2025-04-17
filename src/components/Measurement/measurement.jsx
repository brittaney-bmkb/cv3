import Portal from "@arcgis/core/portal/Portal.js";
import { Box, MenuItem, Select, Typography, Stack, TextField } from "@mui/material"
import { CalciteBlock, CalcitePanel, CalciteButton  } from "@esri/calcite-components-react";
import UseAppContext from "../../contexts/AppContext";
import "@arcgis/map-components/components/arcgis-area-measurement-2d";
import "@arcgis/map-components/components/arcgis-distance-measurement-2d";
import { config } from "../../data/config";
import { useEffect, useRef, useState  } from "react";


const Measure = () => {

    const { 
        measurePanelClosed, 
        setMeasurePanel, 
        translateText, 
        arcgisMapRef, 
        setMeasureWidgetState, 
        measureWidgetState 
    } = UseAppContext()
    
    const measureAreaRef = useRef(null)
    const measureDistanceRef = useRef(null)


    useEffect(() => {
        if (measurePanelClosed){
            console.log("Cleaning up measurement tools...");
            if (measureAreaRef.current?.viewModel?.clear) {
                console.log("Cleaning up AREA TOOL ");
                measureAreaRef.current.viewModel.clear();
            }
            if (measureDistanceRef.current?.viewModel?.clear) {
                console.log("Cleaning up DISTANCE TOOL ");
                measureDistanceRef.current.viewModel.clear();
            }
        }
    }, [measurePanelClosed]);


    return(
        <CalcitePanel
            closed={measurePanelClosed}
            closable
            heading={translateText("Measure")}
            style={{display: measurePanelClosed ? 'none': 'flex'}}
            onCalcitePanelClose={() => { setMeasurePanel(true) }}
        >
            <CalciteBlock
                open
                heading={translateText("Area")}
                description={translateText("Calculate and display the area and perimeter of a polygon. Start a new measurement in order to clear.")}
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