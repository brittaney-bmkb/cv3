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
        exportOpen,
        feedbackOpen,
        clearResultsComparables
    } = UseAppContext()

    const handleClearResults = () => {

        clearResults()
        clearResultsComparables()
    }

    return (
            <CalcitePanel 
                id="search-results-panel" 
                closed={searchResultsPanelClosed} 
                closable 
                className='panel-start' 
                heading={`${translateText('Search Results')} (${searchFeatures ? searchFeatures?.length : 0})`} 
                //description= {searchFeatures?.length > 0 && searchBufferGeometry ? `${translateText("Property results include parcels within")} ${config.buffer_distance} ${translateText(config.buffer_unit)} ${translateText("of")} ${searchTerm}`: null}
                overlayPositioning="fixed"
                onCalcitePanelClose={() => {
                    setSearchResultsPanel(true)
                }}
                style={{display: searchResultsPanelClosed ? 'none': 'flex'}}
                >  
                    <CalciteAction 
                    slot="header-actions-start" 
                    icon="question" 
                    text="help" 
                    onClick={() => {
                        window.open(`${config.hub_site_url_resources}#${config.hub_site_resources_bookmarks["search-results"]}`, '_blank')
                    }}>
        </CalciteAction>  
                    {/* SEARCH RESULT ACTIONS */}
                    <CalciteActionBar slot="action-bar" layout="horizontal" expandDisabled> 
                        <CalciteAction 
                            id="clear-search-results"
                            text={translateText('Clear')} 
                            icon="reset" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                            onClick={handleClearResults}
                        ></CalciteAction>
                        <CalciteAction 
                            id="export-search-results"
                            text={translateText('Export')} 
                            icon="export" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                            onClick={() => {
                                setExportOpen(true, 'search')
                                if(feedbackOpen){
                                    setFeedbackDialog(false)
                                }
                            }}
                        ></CalciteAction>
                        <CalciteAction 
                            id="submit-search-feedback"
                            text={translateText('Feedback')} 
                            icon="speech-bubble-exclamation" 
                            disabled={searchFeatures ? false : true} 
                            textEnabled 
                            scale="s"
                            onClick={() => {
                                setFeedbackDialog(true, 'search')
                                if(exportOpen){
                                    setExportOpen(false)
                                }
                            }}
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