import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react";
import StyledButtonFilledPrimary from "../Button/Button";
import { CalciteIcon } from "@esri/calcite-components-react";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const descriptions = (state) => {
    switch (state) {
        case 'click':
            return 'Click in the map to select parcels. Click on a selected parcel to deselect';
        case 'draw':
            return 'Click points in the map to draw an area and select parcels.';
        default:
            return 'Use the tools below to select multiple parcels in the map. You can either click to select or deselect individual parcels or draw an area to select all parcels within it';
    }
}




// this lifted from comparable property search and will needed to be updated for this widget
const SelectMultipleParcels = () => {

    const { 
        translateText, 
        setSelectMultiple, 
        selectMultiple, 
        mapView, 
        queryPolygon,
        setPrimaryResultFeature,
        primaryResultFeature,
        setSearchResults
     } = UseAppContext()

    const [ tool, setTool ] = useState(null)
    const [ actionButtonsVisible, setActionButtonsVisible ] = useState(false);
    const [ isTooltipVisible, setTooltipVisible ] = useState(false);
    const [ toolDescription, setToolDescription ] = useState(false);
    const [ sketchPolygon, setSketchPolygon ] = useState(null);
    const [ completeSketch, setCompleteSketch ] = useState(false);

    const sketchVMRef = useRef(null)
    const polygonGraphicsLayer = useRef(null)

    useEffect(() => {

        setActionButtonsVisible(false)
        setSelectMultiple(false)
        
    }, [])


    const handleSelectClick = () => {

        setTool('click')
        setSelectMultiple(!selectMultiple)
        setToolDescription('selectMultiple')
    }

    const handleSelectDraw = async () => {

        //update tool state
        setTool('draw')

        //update state of select multiple to false
        //to prevent clicks from triggering updates
        //to parcel results
        setSelectMultiple(false)

        //update tool description state to show 
        //draw guide text
        setToolDescription('draw')

        //start new sketch view model create session
        await createSketchViewModel()

        

    }

    const createSketchViewModel = async () => {

        console.log("creating new sketch view model")

        if(!polygonGraphicsLayer.current){
            polygonGraphicsLayer.current = new GraphicsLayer({
                title:"selectGraphic"
            })
            mapView.map.add(polygonGraphicsLayer.current)
        }
        
        if(!sketchVMRef.current){
            
            sketchVMRef.current = new SketchViewModel({
                view: mapView,
                layer: polygonGraphicsLayer.current,
                tooltipOptions: {
                    enabled: true,
                    helpMessage: true
                }
            })
            
        }

        sketchVMRef.current.create("polygon", "click")

    }

    const handleComplete = async () => {

        if(tool === "draw"){
            await queryPolygon(sketchPolygon.geometry)

            polygonGraphicsLayer.current.remove(sketchPolygon)
        }

        if(tool === "click"){
            setSelectMultiple(false)
        }
        setTool(null)
        setActionButtonsVisible(false)

    }

    const handleStartNew = async () => {

        if(polygonGraphicsLayer.current && tool==="draw"){
            polygonGraphicsLayer.current.remove(sketchPolygon)
        }

        if(tool==="click"){
            setPrimaryResultFeature(null, true)
            setSearchResults(null, null)
            
        }
        
        
        setActionButtonsVisible(false)
    }

    useEffect(() => {

        const selectParcelsByArea = async () => {

            if(sketchVMRef.current){
                sketchVMRef.current.on("create", async (event) => {
                    console.log("create state: ", event)

                    if(event.state === "active"){
                        setActionButtonsVisible(true)
                    }

                    if(event.state === "complete"){
                        console.log("selecting parcels by polygon: ", event)

                        setSketchPolygon(event.graphic)

                        
                    }
                    
                })
            }
        }

        selectParcelsByArea()
        
    },[sketchVMRef.current])


    useEffect(() => {

        if(tool === 'click' && primaryResultFeature){
            console.log("active tool: ", tool)
            console.log("setting action buttons visible to true")
            setActionButtonsVisible(true)
        }
        if(tool === 'click' && !primaryResultFeature){
            setActionButtonsVisible(false)
        }
        // if(tool && polygonGraphicsLayer.current){
        //     polygonGraphicsLayer.current.remove(sketchPolygon)
        // }

    }, [primaryResultFeature, tool, polygonGraphicsLayer])


    return(
        <Box display="flex" flexDirection="column" rowGap={2}>

            {/* <Tooltip isTooltipVisible={isTooltipVisible} content={"test"}/> */}
            <Typography variant="body1" sx={{height: 80}}>
                {descriptions(toolDescription)}
            </Typography>

            <Stack direction="row" justifyContent="space-around" spacing={1}>

                <Button
                variant="contained"
                color="primary"
                sx={{
                    textTransform:"none", 
                    display:"flex", 
                    flexDirection:"row", 
                    columnGap:1,
                    width: "50%"
                }}
                onClick={handleSelectClick}
                >   
                    <CalciteIcon icon="select"/>
                    <Typography
                    variant="body1"
                    >
                        {translateText("Click")}
                    </Typography>
                </Button>

                <Button
                variant="contained"
                color="primary"
                sx={{textTransform:"none", 
                    display:"flex", 
                    flexDirection:"row", 
                    columnGap:1,
                    width: "50%"}}
                onClick={handleSelectDraw}
                >   
                    <CalciteIcon icon="pencil"/>
                    <Typography
                    variant="body1"
                    >
                        {translateText("Draw")}
                    </Typography>
                </Button>

            </Stack>
            
            {/* {actionButtonsVisible ? 

            <Box display="flex" flexDirection="column" rowGap={2}> */}
                <Divider/>
                <Stack direction="row" justifyContent="flex-end" >
                    <Button 
                        disabled = {!actionButtonsVisible}
                        variant="text"
                        sx={{
                            textTransform:"none", 
                            display:"flex", 
                            flexDirection:"row", 
                            columnGap:1,
                            width: "auto"}}
                        onClick={handleStartNew}
                    >
                        <CalciteIcon icon="reset"/>
                            <Typography
                            variant="body1"
                            >
                                {translateText("Start New")}
                            </Typography>
                    </Button>
                    <Button 
                        disabled = {!actionButtonsVisible}
                        variant="contained"
                        sx={{
                            textTransform:"none", 
                            display:"flex", 
                            flexDirection:"row", 
                            columnGap:1,
                            width: "30%"
                        }}
                        onClick={handleComplete}
                    >
                        <CalciteIcon icon="check-circle"/>
                            <Typography
                            variant="body1"
                            >
                                {translateText("Done")}
                            </Typography>
                    </Button>

                </Stack>
            {/* </Box>
           : <Box></Box> */}
            
            

            

           
        </Box>
        
    )
}

export default SelectMultipleParcels