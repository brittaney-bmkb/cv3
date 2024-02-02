import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material"
import UseAppContext from "../contexts/AppContext"
import { useEffect } from "react"

const Result = ({text}) => {

    return(
        <Box flex={4} p={2}>
        <Card sx={{display: "flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center"}}>
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