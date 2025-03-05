
import UseAppContext from "../../contexts/AppContext"
import ListItem from "../ListItem/ListItem"

const ListSearchResults = () => {
    
    const {searchFeatures} = UseAppContext()
    
    return(
        <>
        {
            searchFeatures?.map(feature => {
                return(
                    <ListItem key={feature.attributes['PIN14_dash']} label={feature.attributes['PIN14_dash']}/>
                )
            })
        }
        </>
    )
}

export default ListSearchResults