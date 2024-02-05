import { List, ListItem } from "@mui/material"
import Result from "./Result"
import UseAppContext from "../contexts/AppContext"

const ResultsList = () => {

    const { searchFeatures } = UseAppContext()

    return(
        <List>
            {searchFeatures ? 
            searchFeatures.map((result, i) => {
                return(
                    <ListItem key={result.attributes['PIN14']}>
                        <Result text={result.attributes['PIN14']}/>
                    </ListItem>
                )
            }) : 'null'}
            
        </List>
    )
}

export default ResultsList