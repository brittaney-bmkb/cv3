import { Box, Typography, Stack, TextField, MenuItem, Select } from "@mui/material"
import SelectDropdown from "../SelectDropdown/SelectDropdown"
import { useEffect, useState } from "react"
import { config } from "../../data/config"
import UseAppContext from "../../contexts/AppContext"

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
            {format}
        </MenuItem>
    ))

    const formatLayoutOptions = layoutOptions.map((layout) => (
        <MenuItem key={layout} value={layout}>
            {layout}
        </MenuItem>
    ))

  

    return(
        <Box display={"flex"} flexDirection="column"  rowGap={1}>
            <Typography variant="h5" sx={{display:"flex", flexGrow:1, pt:1, pb:1}}>{`${translateText("Map settings")}:`}</Typography>
            <Box display="flex" flexDirection="column" pl={1} rowGap={2}>
            {/* Choose Formats */}
            <Stack direction="row" sx={{alignItems:"center"}} spacing={2}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1}}>{translateText("Map title")}</Typography>
                <TextField 
                    id="print-title" 
                    //label="Title" 
                    variant="outlined" 
                    size="small"
                    value={mapTitle}
                    placeholder="Title"
                    onChange={handleInput}
                    sx={{width: 200, height:40}}
                />
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}  spacing={2}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1, width: 150}}>{translateText("Layout orientation")}</Typography>
                <Select
                value={layoutValue}
                onChange={handleLayoutOptionChange}
                sx={{width: 200, height:40}}
                >
                    {formatLayoutOptions}
                </Select>
            </Stack> 
            <Stack direction="row" sx={{alignItems:"center"}}  spacing={2}>
                <Typography variant="h5" sx={{display:"flex", flexGrow:1, width: 150}}>{translateText("Output format")}</Typography>
                <Select
                value={formatValue}
                onChange={handleFormatOptionChange}
                sx={{width: 200, height:40}}
                >
                    {formatDropdownOptions}
                </Select>
            </Stack> 
            </Box>
        </Box>
    )
}

export default PrintWidgetCustom