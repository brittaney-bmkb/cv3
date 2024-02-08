/**
 * ResultCard Component
 * 
 * Description:
 * This component represents a card displaying information about a property result.
 * It includes details like PIN (Property Identification Number), address, city/state/zip, and additional property information.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.pin - The Property Identification Number.
 * @param {string} props.address - The address of the property.
 * @param {string} props.city_state_zip - The city, state, and zip code of the property.
 * @returns {JSX.Element} - The JSX markup for the ResultCard component.
 * 
 * @example
 * // Example usage of ResultCard
 * <ResultCard pin="123456789" address="123 Main St" city_state_zip="City, State, 12345" />
 */

import { Box, Card, CardActionArea, CardContent, CardHeader, Divider, Typography } from "@mui/material"
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import UseAppContext from "../../contexts/AppContext"
import { theme } from "../../theme"

const ResultCard = ({pin, address, city_state_zip}) => {

    const { setPanelDisplay, selectResultFromList } = UseAppContext()

    return(
        <Card 
        onClick={() => {
            setPanelDisplay("propertyDetail")
            selectResultFromList(pin)
        }}
        sx={{
            display: "flex", 
            flexDirection:"column", 
            justifyContent:"space-between", 
            alignItems:"center",
            width:"100%",
            p:1
            }}>
            <CardActionArea>

            
            <CardContent>
                <Box display="flex" width="100%" flexDirection="column" justifyContent='center' alignItems="center" rowGap={2}>
                     <Box display="flex" sx={{border:3, borderColor:theme.palette.primary.main }} borderRadius={theme.shape.borderRadius}>
                        <Typography color={theme.palette.primary.main} variant="h5">{pin}</Typography>
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
            </CardActionArea>
        </Card>

    )
}

export default ResultCard