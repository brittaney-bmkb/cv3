import { Box, Card, CardActionArea, CardContent, CardHeader, Divider, Typography } from "@mui/material"
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import UseAppContext from "../../contexts/AppContext"
import { useEffect } from "react"
import { theme } from "../../theme"

const ResultCard = ({pin, address, city_state_zip}) => {

    const { setPanelDisplay, selectResultFromList } = UseAppContext()

    return(
        <Card 
        onClick={() => {
            setPanelDisplay("propertyDetail")
            selectResultFromList(text)
        }}
        sx={{
            display: "flex", 
            flexDirection:"column", 
            justifyContent:"space-between", 
            alignItems:"center",
            width:"100%",
            p:1
            }}>
            <CardContent>
                <Box display="flex" width="100%" flexDirection="column" justifyContent='center' alignItems="center" rowGap={2}>
                     <Box display="flex" sx={{border:3, borderColor:theme.palette.primary.main }} borderRadius={theme.shape.borderRadius}>
                        <Typography p={1} color={theme.palette.primary.main} variant="h3">{pin}</Typography>
                     </Box>
                     <Box display="flex" flexDirection="column" alignItems="center">
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <LocationOnOutlinedIcon fontSize="small" sx={{color:theme.main.text.dark}}/>
                            <Typography align="center" variant="h4" color={theme.main.text.dark}>{address}</Typography>
                        </Box>
                        <Typography align="center" variant="subtitle2" color={theme.palette.info.dark}>{city_state_zip}</Typography>
                     </Box>
                </Box>
                 
            </CardContent>
            <Divider flexItem={true} variant="fullWidth" sx={{color:theme.main.text.grey}}/>   
            <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" justifyContent="center" pt={1}>
                <Typography align="center" variant="subtitle2" color={theme.palette.info.dark}>Total Value</Typography>
                <Typography align="center" variant="subtitle2" color={theme.palette.info.dark}>Classification</Typography>
                <Typography align="center" variant="subtitle2" color={theme.palette.info.dark}>Building Sq Ft</Typography>
            </Box>
        </Card>

    )
}

export default ResultCard