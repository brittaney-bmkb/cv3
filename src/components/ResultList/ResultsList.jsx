import { Box, List, ListItem, Typography } from "@mui/material"
import ResultCard from "../ResultCard/ResultCard"
import { theme } from "../../theme"

const ResultsList = ({results, primaryLableColor, noResultsMessage}) => {

    return(
        <List sx={{
            height:"100%", 
            display: "flex", 
            flexDirection:"column", 
            flex: 1
            }}>
            {results && results.length > 0 ? 
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
            }) : <Box display="flex" width='100%' alignItems="center" justifyContent="center" p={3}>
                    <Typography variant="h6" color={theme.palette.primary.main}>{noResultsMessage}</Typography>
                </Box>}
            
        </List>
    )
}

export default ResultsList