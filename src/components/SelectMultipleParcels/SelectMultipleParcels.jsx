import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react";
import { CalciteIcon } from "@esri/calcite-components-react";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { theme } from "../../theme";
import { removeLayer } from "../../arcgis/layers/layers";
import { useSearchParams } from "react-router-dom";

const descriptions = (state) => {
    switch (state) {
        case 'click':
            return 'Click in the map to select parcels. Click on a selected parcel to deselect';
        case 'draw':
            return 'Click points in the map to draw an area and select parcels';
        default:
            return 'Use the tools below to select multiple parcels in the map. You can either click to select or deselect individual parcels or draw an area to select all parcels within it';
    }
}

// Get the element you want to change the cursor for
const element = document.querySelector('.element-class');

function hexToRgba(hex, alpha = 1) {
    // Remove the leading # if it's there
    hex = hex.replace(/^#/, '');
  
    // Parse the r, g, b values
    let r, g, b;
  
    if (hex.length === 3) {
      // If the hex code is in the shorthand format (e.g. #F00)
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      // If the hex code is in the full format (e.g. #FF0000)
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      throw new Error('Invalid hex color code');
    }
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
        setSearchResults,
     } = UseAppContext()

    const [ tool, setTool ] = useState(null)
    const [ actionButtonsVisible, setActionButtonsVisible ] = useState(false);
    const [ toolDescription, setToolDescription ] = useState(false);
    const [ sketchPolygon, setSketchPolygon ] = useState(null);
    const [ sketchActive, setSketchActive ] = useState(false);
    const [routeParams, setSearchParams] = useSearchParams();

    const tooltipRef = useRef(null);

    const sketchVMRef = useRef(null)
    const polygonGraphicsLayer = useRef(null)

    useEffect(() => {

        setActionButtonsVisible(false)
        setSelectMultiple(false)
        setSketchActive(false)

    }, [])


    const handleSelectClick = () => {

        if(tool !== "click"){
            setTool('click')
            setToolDescription('click')
            setSelectMultiple(true)
        }
        else{
            setTool(null)
            setToolDescription(null)
            setSelectMultiple(false)
        }
    }

    const handleSelectDraw = async () => {

        setSelectMultiple(false)

        if(tool !== "draw"){
            //update tool state
            setTool('draw')
            //update tool description state to show 
            //draw guide text
            setToolDescription('draw')

            //start new sketch view model create session
            await createSketchViewModel()

            if(tooltipRef.current){
                tooltipRef.current.innerHTML = translateText(`set first point`)
            }
        }
        else{
            setTool(null)
            setToolDescription(null)
            clearGraphic()
        }

    }

    const createSketchViewModel = async () => {

        //console.log("creating new sketch view model")

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
            })
            
        }

        sketchVMRef.current.create("polygon", "click")

        

    }

    const clearGraphic = () => {
        if(polygonGraphicsLayer.current){

            polygonGraphicsLayer.current.remove(sketchPolygon)

            setSketchPolygon(null)

            const map = mapView.map
            removeLayer(map, "selectGraphic")

            polygonGraphicsLayer.current = null
        }
    }

    const handleComplete = async () => {

        if(tool === "draw"){
            await queryPolygon(sketchPolygon.geometry)

            clearGraphic()
            // polygonGraphicsLayer.current.remove(sketchPolygon)

            // setSketchPolygon(null)

            // const map = mapView.map
            // removeLayer(map, "selectGraphic")

            // polygonGraphicsLayer.current = null
            
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
            //start new sketch view model create session
            await createSketchViewModel()
        }

        //if(tool==="click"){
            setPrimaryResultFeature(null, true)
            setSearchResults(null, null)

            // console.log("Removing all search parameters")
            setSearchParams({})
            
        //}
        // handleSelectDraw
        
        setActionButtonsVisible(false)
    }

    useEffect(() => {

        const selectParcelsByArea = async () => {

            if(sketchVMRef.current){


                sketchVMRef.current.on("create", async (event) => {
                    console.log("create state: ", event)

                    if(event.state === "active"){
                        //console.log("tool is active: ", event)
                        setActionButtonsVisible(true)

                        if(tooltipRef.current){
                            tooltipRef.current.innerHTML = translateText(`double click to complete`)
                        }

                    }

                    if(event.state === "complete"){
                        //console.log("selecting parcels by polygon: ", event)

                        setSketchPolygon(event.graphic)
                        

                        
                    }
                    
                })
            }
        }

        selectParcelsByArea()
        
    },[sketchVMRef.current])


    useEffect(() => {

        if(tool === 'click' && primaryResultFeature){
            //console.log("active tool: ", tool)
            //console.log("setting action buttons visible to true")
            setActionButtonsVisible(true)
            
            
        }
        if(tool === 'click' && !primaryResultFeature){
            setActionButtonsVisible(false)

        }
        if(tool !== 'draw'){
            if(sketchVMRef.current){
                sketchVMRef.current.destroy()
                sketchVMRef.current = null
            }
        }

    }, [primaryResultFeature, tool, polygonGraphicsLayer])


    const handleMouseMove = (event) => {

        if(tooltipRef.current){
            const x = event.clientX 
            const y = event.clientY
    
            tooltipRef.current.style.left = x + 15 + 'px';
            tooltipRef.current.style.top = y - 30 + 'px';
            //tooltipRef.current.innerHTML = `select/deselect parcel`;
            //tooltipRef.current.style.textWrap = 'wrap'
            tooltipRef.current.style.backgroundColor = hexToRgba(theme.palette.secondary.light, .75)
            //tooltipRef.current.style.opacity = "80%"
            tooltipRef.current.padding = '10px'
            tooltipRef.current.style.borderRadius = '15px'
            tooltipRef.current.style.borderColor = 'transparent'
            tooltipRef.current.style.width = '150px'
            tooltipRef.current.style.display = 'flex';
            tooltipRef.current.style.minHeight = "30px"
            // Flexbox styles to center content vertically and horizontally
            tooltipRef.current.style.textAlign = 'center';
            tooltipRef.current.style.display = 'flex';
            tooltipRef.current.style.alignItems = 'center';
            tooltipRef.current.style.justifyContent = 'center';
            tooltipRef.current.style.fontWeight = 600
            
            if(tool === "click"){
                mapView.container.style.cursor = "pointer"
            }
            if(tool === "draw"){
                mapView.container.style.cursor = "auto"
            }
        }

      };

      const handleMouseLeave = () => {
        if(tooltipRef.current){
            tooltipRef.current.style.display = 'none';
            mapView.container.style.cursor = "auto"
        }
      };

    useEffect(() => {

        const createTooltip = () => {

            if(!tooltipRef.current){
                // Create the tooltip element
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.style.position = 'absolute';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.display = 'none'

                tooltipRef.current = tooltip;
            }

            else{
                console.log("tool is: ", tool)
                if (tool) {
                    
                    const mapContainer = mapView.container;
                    const existingTooltip = mapContainer.querySelector('.tooltip-class');
                    if(!existingTooltip){
                        mapContainer.appendChild(tooltipRef.current);
                    }
                    
                    if (tool === "click") {
                        tooltipRef.current.innerHTML = translateText(`select / deselect parcel`)
                    }
                    if (tool === "draw") {
                        if(sketchPolygon){
                            tooltipRef.current.innerHTML = translateText(`click done to select parcels`)
                        }
                        
                    }
                  }

            }

        }
        
        if(mapView && tool){

            const mapContainer = mapView.container;
            
            createTooltip()

            mapContainer.addEventListener('mousemove', handleMouseMove);
            mapContainer.addEventListener('mouseleave', handleMouseLeave);
                        
        }
        
        

        return () => {
            if(mapView && tool && tooltipRef.current){
                const mapContainer = mapView.container;
                mapContainer.removeEventListener('mousemove', handleMouseMove);
                mapContainer.removeEventListener('mouseleave', handleMouseLeave);
                mapView.container.removeChild(tooltipRef.current); // Clean up tooltip
            }
            
          };

      }, [tool, mapView, actionButtonsVisible, sketchPolygon]);


    return(
        <Box display="flex" flexDirection="column" rowGap={2}>

            <div ref={tooltipRef} style={{position:"absolute", zIndex:100}}></div>

            <Typography variant="body1" sx={{minHeight: 80}}>
                {translateText(descriptions(toolDescription))}
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
                    width: "50%",
                    backgroundColor: tool === 'click' ? 'primary.dark' : 'primary.main',
                    border: tool === 'click' ? '2px solid' : 'none',
                    borderColor: tool === 'click' ? 'primary.dark' : 'transparent',
                    boxShadow: tool === 'click' ? 'inset 0 3px 5px rgba(0, 0, 0, 0.2)' : 'none',
                    transform: tool === 'click' ? 'translateY(2px)' : 'none',
                }}
                onClick={handleSelectClick}
                >   
                    <CalciteIcon icon="touch" scale="s"/>
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
                    width: "50%",
                    backgroundColor: tool === 'draw' ? 'primary.dark' : 'primary.main',
                    border: tool === 'draw' ? '2px solid' : 'none',
                    borderColor: tool === 'draw' ? 'primary.dark' : 'transparent',
                    boxShadow: tool === 'draw' ? 'inset 0 3px 5px rgba(0, 0, 0, 0.2)' : 'none',
                    transform: tool === 'draw' ? 'translateY(2px)' : 'none',
                }}
                onClick={handleSelectDraw}
                >   
                    <CalciteIcon icon="pencil" scale="s"/>
                    <Typography
                    variant="body1"
                    >
                        {translateText("Draw")}
                    </Typography>
                </Button>

            </Stack>

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
                    disabled = {!actionButtonsVisible || (tool === "draw" && !sketchPolygon)}
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
        </Box>
        
    )
}

export default SelectMultipleParcels