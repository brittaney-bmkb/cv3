import { Box, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, Link, Stack, Switch, TextField, Typography } from "@mui/material"
import { theme } from "../../theme"
import { useEffect, useState } from "react"
import SelectDropdown from "../SelectDropdown/SelectDropdown"
import { config } from "../../data/config"
import { CloseOutlined } from "@mui/icons-material"
import UseAppContext from "../../contexts/AppContext"
import { exportToCsv, exportToExcel, prepareDataForExport } from "../../export/export"
import StyledButtonFilledPrimary from "../Button/Button"
import { printMap } from "../../export/print"
import PrintWidgetCustom from "../Widgets/PrintWidgetCustom"

const ExportDialog = ({open, onClose, dataDescription}) => {

    const { 
        searchFeatures, 
        primaryResultFeature, 
        comparableParcels, 
        secondaryResultFeature, 
        dataDictionary, 
        translateText, 
        mapLayout,
        mapFormat, 
        mapTitle, 
        screenWidth,
        mapView
     } = UseAppContext()
    
    const [isExporting, setIsExporting] = useState(false)
    const [ includeResults, setIncludeResults ] = useState(false)
    const [ printJobs, setPrintJobs ] = useState({})
    const [ includeExcel, setIncludeExcel ] = useState(false)
    const [ includeCsv, setIncludeCsv ] = useState(false)
    const [ includeMap, setIncludeMap ] = useState(false)

    useEffect(() => {
        setPrintJobs({})

        if(!open){
            setIncludeResults(false)
            setIncludeMap(false)
        }
    },[open])

    const featuresToExport = async () => {
        let features;

        //console.log("Export dialog: ", dataDescription)

        if(dataDescription === "Property Results"){
            features = searchFeatures
            
        }

        else if(dataDescription === "Property Detail"){
            features = primaryResultFeature
        }

        else if(dataDescription === "Comparable Results" || dataDescription === "Nearby Results" ){
            features = comparableParcels
        }

        else if(dataDescription === "Comparable Property" || dataDescription === "Nearby Property"){
            features = secondaryResultFeature
        }

        return features
    }

    const performExport = async () => {
        
        let filename = `CookViewer_${translateText(dataDescription).replace(" ","_")}`
        let features = await featuresToExport()

        //console.log("exporting features: ", features)

        if(includeCsv === true){
            //console.log("Include csv: ", includeCsv)
            setIsExporting(true)
            await exportToCsv(features, dataDictionary, filename)
            setIsExporting(false)
        }

        if(includeExcel === true){
            //console.log("Include csv: ", includeCsv)
            setIsExporting(true)
            await exportToExcel(features, dataDictionary, filename)
            setIsExporting(false)
        }

        if(includeMap === true){
            setIsExporting(true)
            let file = await printMap(mapView, mapLayout, mapFormat, mapTitle)
            setIsExporting(false)

            if(file){
                let fileName = `${mapTitle}.${mapFormat}`
                // setPrintFileUrl(file)
                // setPrintFileName(fileName)

                setPrintJobs((prev) => ({
                    ...prev,
                    [fileName]: file
                }))
            }
        }

    }
    
    const exportOptions = (
        <Box display={"flex"} flexDirection="column" >
            <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>{`${translateText("Choose format")}:`}</Typography>
            <Box display="flex" flexDirection="column" pl={1}>
            <Stack direction="row" sx={{alignItems:"center"}}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>{translateText("csv")}</Typography>
                <Switch onClick={() => {setIncludeCsv(!includeCsv)}}/>
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>{translateText("excel")}</Typography>
                <Switch onClick={() => {setIncludeExcel(!includeExcel)}}/>
            </Stack> 
            </Box>
        </Box>
    )

    return(
        <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="print-dialog-title"
        aria-describedby="print-dialog-description"
        fullWidth
        >   <IconButton sx={{position:"absolute", right:8, top:8}} onClick={onClose}><CloseOutlined/></IconButton>
            <DialogTitle id="print-dialog-title" sx={{display:"flex", justifyContent:"center"}}>
                <Box display="flex" bgcolor={theme.main.backgroundColor.grey} p={1} sx={{borderRadius: theme.shape.borderRadius}} width={100} justifyContent="center">
                    <Typography variant="h3" color={theme.main.text.dark} align="center">{translateText("Export")}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" rowGap={1}>
                    <Stack direction="row" sx={{alignItems:"center"}}>
                        <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>{translateText("Include results")}</Typography>
                        <Switch onClick={() => {setIncludeResults(!includeResults)}}/>
                    </Stack> 
                    
                    <Collapse in={includeResults}>{exportOptions}</Collapse>
                </Box>
                <Divider/>
                {screenWidth >= theme.breakpoints.values.sm ?
                <Box display="flex" flexDirection="column" rowGap={1} pt={2}>
                <Stack direction="row" sx={{alignItems:"center"}}>
                    <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>{translateText("Include map")}</Typography>
                    <Switch onClick={() => {setIncludeMap(!includeMap)}}/>
                </Stack> 

                <Collapse in={includeMap}>{<PrintWidgetCustom/>}</Collapse>

                </Box>
                : null}
                { printJobs && Object.entries(printJobs).length > 0 ? 
                <Box display="flex" flexDirection="column" rowGap={1} p={1} pt={2}>
                    <Divider/>
                    <Typography variant="body2">{`${translateText("Print Jobs")}:`}</Typography>
                    {
                        Object.entries(printJobs).map(([filename, fileurl]) => (
                            <Link
                                key={filename}
                                href={fileurl}
                                target="_blank"
                                rel="noopener"
                            >
                                <Typography variant="body2">{filename}</Typography>
                            </Link>
                        ))
                    }
                    
                </Box> : null}
               
            </DialogContent>
            
            <DialogActions>
                <StyledButtonFilledPrimary 
                text={translateText(isExporting ? `${translateText("Exporting")}...` : translateText("Export"))} 
                onClick={performExport}/>
            </DialogActions>
    
        </Dialog>
    )

}

export default ExportDialog