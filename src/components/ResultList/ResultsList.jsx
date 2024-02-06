import { List, ListItem } from "@mui/material"
import ResultCard from "../ResultCard/ResultCard"
import UseAppContext from "../../contexts/AppContext"

const ResultsList = () => {

    const { searchFeatures } = UseAppContext()

    return(
        <List>
            {searchFeatures ? 
            searchFeatures.map((result, i) => {
                return(
                    <ListItem key={result.attributes['PIN14']}>
                        <ResultCard 
                        pin={result.attributes['PIN14']}
                        address={result.attributes['street_address']}
                        city_state_zip={result.attributes['city_state_zip']}
                        />
                    </ListItem>
                )
            }) : 'null'}
            
        </List>
    )
}

export default ResultsList