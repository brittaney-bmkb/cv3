import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalcitePanel,
    CalciteScrim, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";
import ListSearchResults from "../ResultList/ListSearchResults";
import { config } from "../../data/config";
import Inactive from "../Inactive/Inactive";


//TODO - add hover highlight

const PanelSearchResults = () => {

    const { 
        searchTerm, 
        searchBufferGeometry, 
        searchFeatures, 
        translateText, 
        searchResultsPanelClosed, 
        setSearchResultsPanel, 
        clearResults,
        setExportOpen,
        setFeedbackDialog,
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
                onCalcitePanelClose={() => {
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
                            onClick={() => {setExportOpen(true, 'search')}}
                        ></CalciteAction>
                        <CalciteAction 
                            text="feedback" 
                            icon="speech-bubble-exclamation" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                            onClick={() => {setFeedbackDialog(true, 'search')}}
                        />
                    </CalciteActionBar>
                    {searchFeatures ? 
                    <CalciteBlock open collapsible={false}>
                        {/* SEARCH RESULTS LABEL*/}
                        <ListSearchResults/>
                    </CalciteBlock>
                    : 
                    <Inactive/>
                    }
            </CalcitePanel>
    )
}

export default PanelSearchResults;