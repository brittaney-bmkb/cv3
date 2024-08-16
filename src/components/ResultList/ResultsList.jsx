import { Box, List, ListItem, Stack, Typography } from "@mui/material"
import ResultCard from "../ResultCard/ResultCard"
import { theme } from "../../theme"
import UseAppContext from "../../contexts/AppContext"
import { CalciteLoader } from "@esri/calcite-components-react";
import { config } from "../../data/config";

const ResultsList = ({results, primaryLableColor, noResultsMessage}) => {

    const { isQuerying, translateText, searchBufferGeometry, searchTerm } = UseAppContext()

    return(
        <Box id="results-list-container">
            {searchBufferGeometry?.length > 0 ? 
                <Box id="results-message-container" p={2}>
                    <Typography variant="h6">
                        {`${translateText("Property results include parcels within")} ${config.buffer_distance} ${translateText(config.buffer_unit)} ${translateText("of")} ${searchTerm}`}
                    </Typography>
                </Box>
                : null
            }
            
        <List sx={{
            height:"100%", 
            display: "flex", 
            flexDirection:"column", 
            flex: 1
            }}>
            {
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
        </Box>

    )
}

export default ResultsList