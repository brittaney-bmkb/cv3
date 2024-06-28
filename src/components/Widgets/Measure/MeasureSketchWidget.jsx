
import { Box, Button, Typography, Stack, Divider, InputLabel , FormControl, NativeSelect   } from "@mui/material"
import UseAppContext from "../../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import { CalciteIcon } from "@esri/calcite-components-react";
import { theme } from "../../../theme";
import StyledButtonFilledPrimary from "../../Button/Button";
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import SquareFootOutlinedIcon from '@mui/icons-material/SquareFootOutlined';


export const measurementUnitOptions = {
    linear: [
        { key: 'feet',              value: 'ft', type: 'polyline', label: "feet"  },
        { key: 'yards',             value: 'yd', type: 'polyline', label: "yards" },
        { key: 'miles',             value: 'mi', type: 'polyline', label: "miles" },
        { key: 'meters',            value: 'm',  type: 'polyline', label: "meters" },
        { key: 'kilometers',        value: 'km', type: 'polyline', label: "kilometers" }
    ],
    area: [
        { key: 'acres',             value: 'ac', type: 'polygon', label: "acres" },
        { key: 'square-feet',       value: 'ft', type: 'polygon', label: "square feet",       superscript: <sup>2</sup> },
        { key: 'square-meters',     value: 'm',  type: 'polygon', label: "square meters",     superscript: <sup>2</sup> },
        { key: 'square-yards',      value: 'yd', type: 'polygon', label: "square yards",      superscript: <sup>2</sup> },
        { key: 'square-kilometers', value: 'km', type: 'polygon', label: "square kilometers", superscript: <sup>2</sup> },
        { key: 'square-miles',      value: 'mi', type: 'polygon', label: "square miles",      superscript: <sup>2</sup> }    
    ]
};

const MeasureSketchWidget = () => {
    
    const { mapView, translateText  } = UseAppContext()

    
    const graphicsLayer = useRef(null) // ESRI graphics
    let sketchVM = useRef(null) //ESRI sketchVM

    let [sketchState, setSketchState ] = useState(null) // functionality for complete button
    let [userGeometry, setUserGeometry ] = useState(null); // user created geom in props

    const [activeTool, setActiveTool] = useState(null) // active tool plyline or polygon 

    let [areaMeasurement, setAreaMeasurement] = useState(0) //polygon unit area
    let [linearMeasurement, setLinearMeasurement] = useState(0) // line unit length 

    let [selectedValue, setSelectedValue ] = useState(null); //drop down menu 

    let [selectedValueArea, setSelectedValueArea ] = useState(measurementUnitOptions.area[0].key); //drop down menu     
    let [selectedValueLinear, setSelectedValueLinear ] = useState(measurementUnitOptions.linear[0].key); //drop down menu 



    const unitMeasurementAbbrev = (stringToCheck) => {
        // Combine linear and area options into a single array
        const allOptions = [...measurementUnitOptions.linear, ...measurementUnitOptions.area];

        const matchedOption = allOptions.find(option => 
            stringToCheck === option.key
        );

        // console.log("matchedOption", matchedOption)
    
        if (matchedOption) {
            return(<span> {matchedOption.value} {matchedOption.superscript ? matchedOption.superscript : ''} </span>)
        } 
        
    }


    const handleChange = (e) => {
        //TODO this breaks it
        console.log("Value passed to area caluculations: ", e.target.value)
        
        if (activeTool==='polygon'){
            setSelectedValueArea(e.target.value)
            if (userGeometry){
                getArea(userGeometry, e.target.value)
            }
            
        } else{
            setSelectedValueLinear(e.target.value)
            if (userGeometry){
                getLength(userGeometry, e.target.value)
            }
            
        }
    }    

    const DropDownUnitMeasurement = () => {

    
        const getOptionsByType = (type) => {
            return type === 'polygon' ?  measurementUnitOptions.area : measurementUnitOptions.linear;
        };
    
        return(            
            activeTool === null ? (null) : (
                <Stack direction="column" spacing={2}>
                    <Box component="section" >
                        {/* This is the diplay above the drop down */}
                        {activeTool === "polygon" ? 
                            <span><Typography variant="h3"> {translateText("Area")}: {areaMeasurement} {unitMeasurementAbbrev(selectedValueArea)}</Typography> </span> :
                            <span><Typography variant="h3"> {translateText("Distance")}: {linearMeasurement} {unitMeasurementAbbrev(selectedValueLinear)}</Typography> </span>  }   
                    </Box>
                    <FormControl size='small'>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            <Typography variant="subtitle2">{translateText("Unit of Measurement")}</Typography>
                        </InputLabel>
                            
                            <NativeSelect
                                inputProps={{
                                name: 'unitType',
                                id: 'unit-measure-select',
                                }}
                                value={activeTool === "polygon" ? selectedValueArea : selectedValueLinear}
                                onChange={handleChange}
                            >
                            
                                {getOptionsByType(activeTool).map((measureUnitOption) => (
                                    <option key={measureUnitOption.key} value={measureUnitOption.key}>
                                        {translateText(measureUnitOption.label)}
                                    </option>
                                ))}
                            </NativeSelect>            
                    </FormControl>        
                </Stack>
            )
        )
    }


    const getPositiveNumber = (negativeNumber) => {
        const positiveNumber = (negativeNumber < 0) ? -negativeNumber : negativeNumber;
        return positiveNumber.toFixed(2)
    }
    
    const getArea = (polygon, unitType) => {
        // console.log("Get area: ", polygon, unitType)
        const planarArea = geometryEngine.planarArea(polygon, unitType);
        const planarAreaPositive = getPositiveNumber(planarArea);
        setAreaMeasurement(planarAreaPositive) 
        return planarAreaPositive
    }
    
    const getLength= (line, unitType) =>{
        // console.log("Get length: ", line, unitType)
        const planarLength = geometryEngine.planarLength(line, unitType);
        const planarLengthPositive = getPositiveNumber(planarLength)
        setLinearMeasurement(planarLengthPositive) 
        return planarLengthPositive
    }

    const switchType = (geom) => {
        switch (geom.type) {
            
            case "polygon":
                setActiveTool(geom.type);
                setUserGeometry(geom)
                getArea(geom, selectedValueArea);
                break;
            case "polyline":
                setActiveTool(geom.type);
                setUserGeometry(geom)
                getLength(geom, selectedValueLinear);
                break;
            default:
                console.log("No value found");
        }

    }
    
    
    const createGraphicLayer = async () => {
        //creates the graphic needed to be added in the map. 
        graphicsLayer.current = new GraphicsLayer({
            title:"measureGraphic" // makes is searchable for WebMapComponentBeta to clear when widget not in use and for hittest to not occur
        })
        mapView.map.add(graphicsLayer.current)
    }

    const removeAllGraphics = async () => {
        //removes all graphics and set props to null as if in a new session 
        graphicsLayer.current.removeAll();
        setActiveTool(null)       
        setAreaMeasurement(0)
        setLinearMeasurement(0)
        // setSelectedValue(null)
        setSelectedValueArea(measurementUnitOptions.area[0].key)  
        setSelectedValueLinear(measurementUnitOptions.linear[0].key)  
        setUserGeometry(null)        
        // setSelectedValue(null)
        setSketchState(null)
    }

    const completeAllGraphics = async () => {
        //completes all graphics with the done button
        sketchVM.current.complete();
        setSketchState("complete")
    }

    useEffect(() => {

        const settingUnitTypes = () =>{
            if (sketchVM.current){

                sketchVM.current.on("create", (e) => {
                    if (e.graphic){
                        let geometry =  e.graphic.geometry;
                        setUserGeometry(geometry)
                        
                        if (e.state === "active") {
                            // complete method before you start another one. clear method 
                            // setUserGeometry(e.graphic.geometry)
                            switchType(geometry);
                            setSketchState("active")
                        }
                        if (e.state === "complete") {
                            setUserGeometry(e.graphic.geometry) 
                            setSketchState("complete")
                        }
                        if (
                            e.toolEventInfo &&
                            (e.toolEventInfo.type === "scale-stop" ||
                            e.toolEventInfo.type === "reshape-stop" ||
                            e.toolEventInfo.type === "move-stop")
                            
                        ) {
                            switchType(geometry);
                            setSketchState("edit")
                        }
                    }
                });

                sketchVM.current.on("update", (e) => {
                    const geometry =  e.graphics[0].geometry;
                    if (e.state === "start") {
                        switchType(geometry);
                        setSketchState("update")
                    }
                    if (
                        e.toolEventInfo &&
                        (e.toolEventInfo.type === "scale-stop" ||
                        e.toolEventInfo.type === "reshape-stop" ||
                        e.toolEventInfo.type === "move-stop")
                        
                    ) {
                        switchType(geometry);
                        setSketchState("edit")
                    }
                });
            }
        }
        settingUnitTypes()

    }, [sketchVM.current, selectedValueArea, selectedValueLinear])


    const startMeasuring = async (geom_type) => {
        // heart of the widget, controls all creation and update of a polyline/polygon
        // from here the majority of functions are altered. 
        if(!graphicsLayer.current){ await createGraphicLayer() }
        await initializeSketchVM()


        if (sketchVM.current.state ==='active'){
            sketchVM.current.cancel()
            // sketchVM.current.create(geom_type); // polygon || polyline
            // sketchVM.current.delete()
            // sketchVM.current.complete()
        } 

        sketchVM.current.create(geom_type); // polygon || polyline

        if(userGeometry){
            // console.log('ELSE statement for current state')
            removeAllGraphics()
        }

        //allows the select drop down to appear
        if (activeTool==='polygon'){
            setActiveTool(geom_type);
        } else {
            setActiveTool(geom_type);
        }   

    }    

    const initializeSketchVM = async () =>{
        //initializes the ESRI sketch View Model. 
        if(!sketchVM.current){
            sketchVM.current = new SketchViewModel({
                view: mapView,
                layer: graphicsLayer.current, 
                creationMode:"continuous",
                polylineSymbol: {
                    type: "simple-line",
                    color: theme.measureGraphics.line.color,
                    width: theme.measureGraphics.line.width
                },
                polygonSymbol: {
                    type: "simple-fill",
                    color: theme.measureGraphics.polygon.color,
                    outline: {
                        color: theme.measureGraphics.polygonOutline.color,
                        width: theme.measureGraphics.polygonOutline.width,
                    },
                },         
                defaultCreateOptions: { hasZ: false },
                snappingOptions: { // autocasts to SnappingOptions()
                    distance:5, // snapping tolerance by pixels
                    enabled: true, // global snapping is turned on
                    featureEnabled: false,
                    selfEnabled: true,
                    // assigns a collection of FeatureSnappingLayerSource() and enables feature snapping on this layer
                    // featureSources: [{ layer: graphicsLayer.current, enabled: true }]
                }        
            }) 
        }
    }

    return (
        <Box display="flex" flexDirection="column"  rowGap={1}>

            <Divider />

            <Stack 
                direction="row" spacing={2}
                useFlexGap 
                sx={{  
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    
                    <StyledButtonFilledPrimary
                        color="primary"
                        startIcon={<StraightenOutlinedIcon/>}
                        text={translateText('Distance')}
                        textVarient={"body2"}
                        active={activeTool === "polyline" ? true: false}
                        onClick={() => startMeasuring("polyline")}
                    /> 

                    <StyledButtonFilledPrimary
                        variant={activeTool === 'polygon' ? 'contained' : 'outlined'}
                        color="primary"
                        startIcon={<SquareFootOutlinedIcon/>}
                        text={translateText('Area')}
                        textVarient={"body2"}
                        active={activeTool === "polygon" ? true: false}
                        onClick={() => startMeasuring("polygon")}
                    /> 

                { (activeTool === "polyline" ) ? 
                    <Box>
                        <Divider /> 
                        <Typography variant="body1">
                            {translateText("To measure distance, click on the map to anchor the first point and double-click on the map or click the Done button to finish.")}
                        </Typography>
                    </Box>
                    : ''}


                { (activeTool === "polygon" ) ? 
                    <Box>
                        <Divider /> 
                        <Typography variant="body1">
                            {translateText("To measure area, click on the map to anchor the first point, then hover over the first point and double-click or click the Done button to finish.")}
                        </Typography>
                    </Box>
                : ''}

            </Stack>
            
            <Divider />
            <DropDownUnitMeasurement/>

            { (activeTool) ? <Divider /> : ''}
            { (activeTool) ? 
                <Stack 
                direction="row" spacing={2}
                useFlexGap 
                sx={{  
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>

                { (sketchState !=="complete") ?                     
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{textTransform:"none", 
                        display:"flex", 
                        flexDirection:"row", 
                        columnGap:1,
                        width: "40%",
                    }}

                        onClick={completeAllGraphics}>   
                            <CalciteIcon icon="check-square"/>
                            <Typography variant="body1">
                                {translateText("Done")}
                            </Typography>
                    </Button>    : '' }

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{textTransform:"none", 
                        display:"flex", 
                        flexDirection:"row", 
                        columnGap:1,
                        width: "40%",
                    }}
                        onClick={removeAllGraphics}>   
                            <CalciteIcon icon="trash"/>
                            <Typography variant="body1">
                                {translateText("Remove")}
                            </Typography>
                    </Button> 
                </Stack>
        : ''}
        </Box>        
    )      
}

export default MeasureSketchWidget
