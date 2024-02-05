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
                    <ListItem key={i}>
                        <Result text={result.attributes['PIN14_dash']}/>
                    </ListItem>
                )
            }) : 'null'}
            
        </List>
    )
}

export default ResultsList