import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalciteLabel, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";
import ListSearchResults from "../ResultList/ListSearchResults";


const PanelSearchResults = () => {

    const { searchFeatures } = UseAppContext()

    return (
        <CalciteBlock open>
            {/* SEARCH RESULTS LABEL*/}
            <CalciteLabel alignment="start" scale="l" layout="inline-space-between">
                {searchFeatures ? `${searchFeatures.length} Search Results` : `Search for new property`}
                {/* SEARCH RESULT ACTIONS */}
                <CalciteActionBar layout="horizontal" expandDisabled>
                    {/* <CalciteAction text="clear" icon="x-circle"></CalciteAction> */}
                    <CalciteAction text="export data" icon="export" disabled={searchFeatures ? false : true}></CalciteAction>
                    <CalciteAction text="submit feedback" icon="speech-bubble-exclamation" disabled={searchFeatures ? false : true}/>
                </CalciteActionBar>
            </CalciteLabel>
            {/* SEARCH RESULTS */}
            <ListSearchResults/>
            
        </CalciteBlock>
    )
}

export default PanelSearchResults;