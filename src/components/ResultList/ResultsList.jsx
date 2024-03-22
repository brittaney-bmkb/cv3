import { Box, List, ListItem, Stack, Typography } from "@mui/material"
import ResultCard from "../ResultCard/ResultCard"
import { theme } from "../../theme"
import UseAppContext from "../../contexts/AppContext"
import LinearProgress from '@mui/material/LinearProgress';
import { CalciteLoader } from "@esri/calcite-components-react";

const ResultsList = ({results, primaryLableColor, noResultsMessage}) => {

    const { isQuerying, translateText } = UseAppContext()
    return(
        <List sx={{
            height:"100%", 
            display: "flex", 
            flexDirection:"column", 
            flex: 1
            }}>
            {
            // isQuerying === true ? 
            //     <Box display="flex" width='100%' alignItems="center" justifyContent="center" p={1}>
                    
            //     </Box>
            //     : 
            results && results.length > 0 ? 
            results.map((result, i) => {
                return(
                    <ListItem key={result.attributes['PIN14_dash']}>
                        <ResultCard 
                        pin={result.attributes['PIN14_dash']}
                        address={result.attributes['street_address']}
                        city_state_zip={result.attributes['city_state_zip']}
                        primaryColor={primaryLableColor}
                        feature={result}
                        />
                    </ListItem>
                )
            }) : <Box display="flex" width='100%' alignItems="center" justifyContent="center" flexDirection="column" p={1} sx={{boxSizing:"border-box"}}>
                    {isQuerying === true ? 
                    <Stack direction="column" >
                    <CalciteLoader/>
                    <Typography variant="h6" color={theme.palette.primary.main}>{translateText("Querying parcels")}</Typography>
                    </Stack>
                    :
                    <Typography align="center" variant="h6" color={theme.palette.primary.main}>{translateText(noResultsMessage)}</Typography>
                    }
                    
                </Box>}
            
        </List>
    )
}

export default ResultsList