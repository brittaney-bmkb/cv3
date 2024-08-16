import { Box, Typography, Stack, TextField, MenuItem, Select, Divider, Link } from "@mui/material"
import SelectDropdown from "../SelectDropdown/SelectDropdown"
import { useEffect, useState } from "react"
import { config } from "../../data/config"
import UseAppContext from "../../contexts/AppContext"
import StyledButtonFilledPrimary from "../Button/Button"
import { printMap } from "../../export/print"

const outputFormats = [
    "pdf",
    "png32",
    "png8",
    "jpg",
    "gif",
    "eps",
    "svg",
    "svgz"
]
const layoutOptions = [
    "a3-landscape",
    "a3-portrait",
    "a4-landscape",
    "a4-portrait",
    "letter-ansi-a-landscape",
    "letter-ansi-a-portrait",
    "tabloid-ansi-b-landscape",
    "tabloid-ansi-b-portrait"
]

const PrintWidgetCustom = () => {

    const { translateText, setMapPrintProps } = UseAppContext()

    const [mapTitle, setMapTitle] = useState("")
    const [ layoutValue, setLayoutValue ] = useState(layoutOptions[0])
    const [ formatValue, setFormatValue ] = useState(outputFormats[0])

    const handleLayoutOptionChange = (event) => {
        setLayoutValue(event.target.value)
    }

    const handleFormatOptionChange = (event) => {
        setFormatValue(event.target.value)
    }

    const handleInput = (e) => {
        let input = e.target.value
        setMapTitle(input)
    }

    useEffect(() => {

        setMapPrintProps(layoutValue, formatValue, mapTitle)

    }, [mapTitle, layoutValue, formatValue])

    const formatDropdownOptions = outputFormats.map((format) => (
        <MenuItem key={format} value={format}>
            {translateText(format)}
        </MenuItem>
    ))

    const formatLayoutOptions = layoutOptions.map((layout) => (
        <MenuItem key={layout} value={layout}>
            {translateText(layout)}
        </MenuItem>
    ))


    return(
        <Box display="flex" flexDirection="column"  rowGap={1}>
            <Typography variant="h5" sx={{display:"flex", flexGrow:1, pt:1, pb:1}}>{`${translateText("Map settings")}:`}</Typography>
            <Box display="flex" flexDirection="column" pl={1} rowGap={2}>
            {/* Choose Formats */}
            <Stack direction="row" sx={{alignItems:"center"}} spacing={2}>
                <Typography variant="body2" sx={{display:"flex", flexGrow:1}}>{translateText("Map title")}</Typography>
                <TextField 
                    id="print-title" 
                    //label="Title" 
                    variant="outlined" 
                    inputProps={{ "id" : "map-title",  "aria-label": "map-title" }} 
                    size="small"
                    value={mapTitle}
                    placeholder="Title"
                    onChange={handleInput}
                    sx={{width: 'auto', height:40}}
                />
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}  spacing={2}>
                <Typography variant="body2" sx={{display:"flex", flexGrow:1}}>{translateText("Layout orientation")}</Typography>
                <Select
                    value={layoutValue}
                    onChange={handleLayoutOptionChange}
                    inputProps={{ "id" : "layout-orientation",  "aria-label": "layout-orientation", "aria-labelledby":"layout-orientation"}} 
                    sx={{width: 'auto', height:40}}
                >
                    {formatLayoutOptions}
                </Select>
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}  spacing={2}>
                <Typography variant="body2" sx={{display:"flex", flexGrow:1}}>{translateText("Output format")}</Typography>
                <Select
                    inputProps={{ "id" : "map-title",  "aria-label": "map-title", "aria-labelledby":"map-title" }}
                    value={formatValue}
                    onChange={handleFormatOptionChange}
                    sx={{width: 'auto', height:40}}
                >
                    {formatDropdownOptions}
                </Select>
            </Stack> 
            </Box>
        </Box>
    )
}


export const PrintWidgetPane = () => {

    const { mapLayout, mapFormat, mapTitle, translateText, mapView } = UseAppContext()

    const [isPrinting, setIsPrinting] = useState(false)
    const [ printJobs, setPrintJobs ] = useState({})


    useEffect(() => {
        setPrintJobs({})
    },[])

    const executePrint = async () => {
        
        setIsPrinting(true)

        let file = await printMap(mapView, mapLayout, mapFormat, mapTitle)
        setIsPrinting(false)

        if(file){
            let fileName = `${mapTitle}.${mapFormat}`
            
             // Check if the file name already exists in printJobs
            if (printJobs.hasOwnProperty(fileName)) {
                let count = 1;
                let newFileName;
                // Increment the count until a unique file name is found
                do {
                    newFileName = `${mapTitle}_${count}.${mapFormat}`;
                    count++;
                } while (printJobs.hasOwnProperty(newFileName));
                fileName = newFileName;
            }

            setPrintJobs((prev) => ({
                ...prev,
                [fileName]: file
            }))
        }
    }

    return (

        <Box display="flex" flexDirection="column" rowGap={2}>
            <PrintWidgetCustom/>

            <Box width="100%" display="flex" justifyContent="end">
                <StyledButtonFilledPrimary text={isPrinting ? `${translateText("Printing")}...` : translateText("Print")} onClick={executePrint}/>
            </Box>

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
        </Box>
    )


}

export default PrintWidgetCustom