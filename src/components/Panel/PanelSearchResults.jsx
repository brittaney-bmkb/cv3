import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalcitePanel, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";
import ListSearchResults from "../ResultList/ListSearchResults";
import { config } from "../../data/config";


//TODO - Update Export dialog and add trigger to export action
//TODO - Update Feedback dialog and add trigger to feedback action

const PanelSearchResults = () => {

    const { 
        searchTerm, 
        searchBufferGeometry, 
        searchFeatures, 
        translateText, 
        searchResultsPanelClosed, 
        setSearchResultsPanel, 
        clearResults,
        //setOpenExportDialog
    } = UseAppContext()

    return (
            <CalcitePanel 
                id="search-results-panel" 
                closed={searchResultsPanelClosed} 
                closable 
                className='panel-start' 
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
                        <CalciteAction 
                            text="clear" 
                            icon="reset" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                            onClick={clearResults}
                        ></CalciteAction>
                        <CalciteAction 
                            text="export" 
                            icon="export" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                           //onClick={() => {setOpenExportDialog(true)}}
                        ></CalciteAction>
                        <CalciteAction 
                            text="feedback" 
                            icon="speech-bubble-exclamation" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                        />
                    </CalciteActionBar>
        
                    <CalciteBlock open collapsible={false}>
                        {/* SEARCH RESULTS LABEL*/}
                        {searchFeatures ? <ListSearchResults/> : translateText(`Search for new property`)} 
                    </CalciteBlock>
            </CalcitePanel>
    )
}

export default PanelSearchResults;