import { Box, Pagination } from "@mui/material"
import UseAppContext from "../../contexts/AppContext"
import { useState } from "react"
import { theme } from "../../theme"

const PropertyPagniation = () => {

    const { screenWidth, comparableParcels, setSecondaryResultFeature } = UseAppContext()

    const [ property, setProperty ] = useState(1)

    const handleChange = (event, value) => {
        setProperty(value)
        setSecondaryResultFeature(comparableParcels[value-1])
    }
     
    return(
        <Box display="flex" justifyContent="center" flexGrow={1}
        height={screenWidth <= theme.breakpoints.values.sm ? 350: "fit-content"}
        >
        <Pagination 
        count={comparableParcels ? comparableParcels.length : 0}
        defaultValue={1}
        page={property}
        size="medium"
        // boundaryCount={0}
        siblingCount={0}
        onChange={handleChange}

        />

        </Box>

    )
}

export default PropertyPagniation