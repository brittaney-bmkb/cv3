import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material"

const Result = () => {
    return(
        <Box flex={4} p={2}>
        <Card sx={{display: "flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center"}}>
            <CardHeader title="Result">
            </CardHeader>
            <CardContent>
                <Typography>Result</Typography>
            </CardContent>
        </Card>
        </Box>

    )
}

export default Result