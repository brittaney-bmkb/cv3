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
                        <ResultCard text={result.attributes['PIN14']}/>
                    </ListItem>
                )
            }) : 'null'}
            
        </List>
    )
}

export default ResultsList