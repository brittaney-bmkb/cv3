import "@esri/calcite-components/dist/components/calcite-icon.js";
import { CalciteIcon } from "@esri/calcite-components-react"

import { Box, Fab } from "@mui/material"
import { ListAltOutlined, MapOutlined } from "@mui/icons-material";

const ToggleButton = () => {



    return(
        <Fab 
        color="primary" 
        aria-label="list" >
        <ListAltOutlined/>
        </Fab>
    )
}

export default ToggleButton