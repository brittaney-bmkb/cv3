import "@esri/calcite-components/dist/components/calcite-icon.js";
import { CalciteIcon } from "@esri/calcite-components-react"

import { Fab } from "@mui/material"
import { ListAltOutlined, MapOutlined } from "@mui/icons-material";

const ToggleButton = () => {

    return(
        <Fab 
        color="primary" 
        aria-label="list" 
        sx={{
            postion:"absolute", 
            bottom: 50, 
            left:"calc(45%)", 
            display:{xs:'flex', sm:'none'},
            }}>
            <ListAltOutlined/>
        </Fab>
    )
}

export default ToggleButton