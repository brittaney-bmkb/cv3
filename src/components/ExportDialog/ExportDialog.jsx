import { Box, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Input, Stack, Switch, TextField, Typography } from "@mui/material"
import { theme } from "../../theme"
import { useState } from "react"
import SelectDropdown from "../SelectDropdown/SelectDropdown"
import { config } from "../../data/config"
import { CloseOutlined } from "@mui/icons-material"
import UseAppContext from "../../contexts/AppContext"
import { prepareDataForExport } from "../../export/export"
import StyledButtonFilledPrimary from "../Button/Button"

const ExportDialog = ({open, onClose}) => {

    const { primaryResultFeature, dataDictionary, translateText } = UseAppContext()
    const [isExporting, setIsExporting] = useState(false)
    const [ includeResults, setIncludeResults ] = useState(false)
    const [ includePdf, setIncludePdf ] = useState(false)
    const [ includeExcel, setIncludeExcel ] = useState(false)
    const [ includeCsv, setIncludeCsv ] = useState(false)

    const [ includeMap, setIncludeMap ] = useState(false)

    const [ layoutValue, setLayoutValue ] = useState(config.print_orientation_options[0])
    function handleLayoutOptionChange(event){
        setLayoutValue(event.target.value)
    }

    const performExport = async () => {
        setIsExporting(true)
        await prepareDataForExport(primaryResultFeature, dataDictionary, "CookviewerResults")
        setIsExporting(false)
    }
    
    const exportOptions = (
        <Box display={"flex"} flexDirection="column" >
            <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>Choose format:</Typography>
            <Box display="flex" flexDirection="column" pl={1}>
            {/* Choose Formats */}
            <Stack direction="row" sx={{alignItems:"center"}}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>pdf</Typography>
                <Switch onClick={() => {setIncludePdf(!includePdf)}}/>
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>csv</Typography>
                <Switch onClick={() => {setIncludeCsv(!includeCsv)}}/>
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>excel</Typography>
                <Switch onClick={() => {setIncludeExcel(!includeExcel)}}/>
            </Stack> 
            </Box>
        </Box>
    )

    const printOptions = (
        <Box display={"flex"} flexDirection="column"  rowGap={1}>
            <Divider/>
            <Typography variant="h5" sx={{display:"flex", flexGrow:1, pt:1, pb:1}}>Map settings:</Typography>
            <Box display="flex" flexDirection="column" pl={1} rowGap={2}>
            {/* Choose Formats */}
            <Stack direction="row" sx={{alignItems:"center"}} spacing={2}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>Map title</Typography>
                <TextField id="print-title" label="Title" variant="outlined" size="small"/>
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}  spacing={2}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>Layout orientation</Typography>
                <SelectDropdown 
                labelId={'print_layout'} 
                id={"print_layout"} 
                value={layoutValue} 
                handleChange={handleLayoutOptionChange}
                items={config.print_orientation_options}
                />
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
        >   <IconButton sx={{position:"absolute", right:8, top:8}} onClick={onClose}><CloseOutlined/></IconButton>
            <DialogTitle id="print-dialog-title" sx={{display:"flex", justifyContent:"center", minWidth:300}}>
                <Box display="flex" bgcolor={theme.main.backgroundColor.grey} p={1} sx={{borderRadius: theme.shape.borderRadius}} width={100} justifyContent="center">
                    <Typography variant="h3" color={theme.main.text.dark} align="center">Export</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" rowGap={1}>
                    <Stack direction="row" sx={{alignItems:"center"}}>
                        <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>Include results</Typography>
                        <Switch onClick={() => {setIncludeResults(!includeResults)}}/>
                    </Stack> 
                    <Divider/>
                    <Collapse in={includeResults}>{exportOptions}</Collapse>
                </Box>

                <Box display="flex" flexDirection="column" rowGap={1}>
                <Stack direction="row" sx={{alignItems:"center"}}>
                    <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>Include map</Typography>
                    <Switch onClick={() => {setIncludeMap(!includeMap)}}/>
                </Stack> 
                
                <Collapse in={includeMap}>{printOptions}</Collapse>
                </Box>
            </DialogContent>
            
            <DialogActions>
                <StyledButtonFilledPrimary 
                text={translateText(isExporting ? "Exporting..." : "Export")} 
                onClick={performExport}/>
            </DialogActions>
    
        </Dialog>
    )

}

export default ExportDialog