import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalciteBlockSection,
    CalciteList,
    CalciteListItem,
    CalciteListItemGroup,
    CalciteLink,
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
                id="search-results-panel" 
                closed={searchResultsPanelClosed} 
                closable 
                class='panel-start' 
                heading={translateText('Search Results')} 
                description= {searchBufferGeometry ? `${translateText("Property results include parcels within")} ${config.buffer_distance} ${translateText(config.buffer_unit)} ${translateText("of")} ${searchTerm}`: null}
                overlayPositioning="fixed"
                calcitePanelClose={() => {
                    setSearchResultsPanel(true)
                }}
                style={{display: searchResultsPanelClosed ? 'none': 'flex'}}
                >   
                    {/* SEARCH RESULT ACTIONS */}
                    <CalciteActionBar slot="action-bar" layout="horizontal" expandDisabled> 
                        <CalciteAction text="clear" icon="reset" disabled={searchFeatures ? false : true} textEnabled scale="s"></CalciteAction>
                        <CalciteAction text="export" icon="export" disabled={searchFeatures ? false : true} textEnabled scale="s"></CalciteAction>
                        <CalciteAction text="feedback" icon="speech-bubble-exclamation" disabled={searchFeatures ? false : true} textEnabled scale="s"/>
                    </CalciteActionBar>
        
                    <CalciteBlock open collapsible={false}>
                        {/* SEARCH RESULTS LABEL*/}
                        {searchFeatures ? <ListSearchResults/> : `Search for new property`} 
                    </CalciteBlock>
                </CalcitePanel>
        // <CalcitePanel 
        // id="search-results-panel" 
        // closed={searchResultsPanelClosed} 
        // closeable
        // class='panel-start' 
        // heading={searchFeatures ? `${searchFeatures.length} Search Results` : `Search for new property`}
        // description= {searchBufferGeometry ? `${translateText("Property results include parcels within")} ${config.buffer_distance} ${translateText(config.buffer_unit)} ${translateText("of")} ${searchTerm}`: null}
        // overlayPositioning="fixed" 
        // calcitePanelClose={() => {
        //     setSearchResultsPanel(true)
        // }}
        // style={{display: searchResultsPanelClosed ? 'none': 'flex'}}
        // >


        //     <CalciteBlock open={true} >
        //         {/* SEARCH RESULTS */}
        //         <ListSearchResults/>
                
        //     </CalciteBlock>
        // </CalcitePanel>
    )
}

export default PanelSearchResults;