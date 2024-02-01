import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material"
import UseAppContext from "../contexts/AppContext"
import { useEffect } from "react"

const Result = () => {

    const { primaryResultFeature } = UseAppContext()

    // console.log("result: ", primaryResultFeature ? primaryResultFeature.attributes: null)
    useEffect(() => {

    },[primaryResultFeature])

    return(
        <Box flex={4} p={2}>
        <Card sx={{display: "flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center"}}>
            <CardHeader title="Result">
            </CardHeader>
            <CardContent>
                <Typography>{primaryResultFeature ? primaryResultFeature.attributes['Pin10']: 'Result'}</Typography>
            </CardContent>
        </Card>
        </Box>

    )
}

export default Result