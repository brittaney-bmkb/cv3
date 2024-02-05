import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material"
import UseAppContext from "../contexts/AppContext"
import { useEffect } from "react"

const Result = ({text}) => {

    const { setPanelDisplay, selectResultFromList } = UseAppContext()

    return(
        <Box flex={4} p={2}>
        <Card 
        onClick={() => {
            setPanelDisplay("propertyDetail")
            selectResultFromList(text)
        }}
        sx={{display: "flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center"}}>
            <CardHeader title="Result">
            </CardHeader>
            <CardContent>
                <Typography>{text ? text: 'No Results'}</Typography>
            </CardContent>
        </Card>
        </Box>

    )
}

export default Result