import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalciteLabel,
    CalcitePanel, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";
import ListSearchResults from "../ResultList/ListSearchResults";
import { config } from "../../data/config";


const PanelSearchResults = () => {

    const { searchTerm, searchBufferGeometry, searchFeatures, translateText, searchResultsPanelClosed, setSearchResultsPanel, setInfoPanel } = UseAppContext()

    return (
        <CalcitePanel 
        heading={searchFeatures ? `${searchFeatures.length} Search Results` : `Search for new property`}
        description= {searchBufferGeometry ? `${translateText("Property results include parcels within")} ${config.buffer_distance} ${translateText(config.buffer_unit)} ${translateText("of")} ${searchTerm}`: null}
        overlayPositioning="fixed" 
        scale="m" 
        id="search-results-panel" 
        closeable 
        closed={searchResultsPanelClosed} 
        class='panel-start' 
        calcitePanelClose={() => {
            setSearchResultsPanel(true)
        }}
        style={{display: searchResultsPanelClosed ? 'none': 'flex'}}>
            <div slot="header-actions-end">
                {/* SEARCH RESULT ACTIONS */}
                <CalciteActionBar layout="horizontal" expandDisabled>
                    {/* <CalciteAction text="clear" icon="x-circle"></CalciteAction> */}
                    <CalciteAction text="export data" icon="export" disabled={searchFeatures ? false : true}></CalciteAction>
                    <CalciteAction text="submit feedback" icon="speech-bubble-exclamation" disabled={searchFeatures ? false : true}/>
                </CalciteActionBar>
            </div>
            <CalciteBlock open={true}>
                {/* SEARCH RESULTS */}
                <ListSearchResults/>
                
            </CalciteBlock>
        </CalcitePanel>
    )
}

export default PanelSearchResults;