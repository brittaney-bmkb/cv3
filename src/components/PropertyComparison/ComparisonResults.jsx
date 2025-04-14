import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalcitePanel, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";
import ListComparisonResults from "./ListComparisonResults";


//TODO - Update Export dialog and add trigger to export action
//TODO - Update Feedback dialog and add trigger to feedback action

const ComparisonResults = () => {
    const { 
        comparableParcels, 
        translateText, 
        comparisonResultsClosed, 
        setComparisonResultsPanel, 
        clearResultsComparables,
        //setOpenExportDialog
    } = UseAppContext()

    return (
            <CalcitePanel 
                id="comparable-results-panel" 
                closed={comparisonResultsClosed} 
                closable 
                className='panel-start' 
                heading={translateText('Search Results')} 
                description= {'some text'}
                overlayPositioning="fixed"
                onCalcitePanelClose={() => {
                    setComparisonResultsPanel(true)
                }}
                style={{display: comparisonResultsClosed ? 'none': 'flex'}}
                >   
                    {/* SEARCH RESULT ACTIONS */}
                    <CalciteActionBar slot="action-bar" layout="horizontal" expandDisabled> 
                        <CalciteAction 
                            text="clear" 
                            icon="reset" 
                            disabled={comparableParcels ? false : true} 
                            textEnabled 
                            scale="s"
                            onClick={clearResultsComparables}
                        ></CalciteAction>
                        <CalciteAction 
                            text="export" 
                            icon="export" 
                            disabled={comparableParcels ? false : true} 
                            textEnabled 
                            scale="s"
                           //onClick={() => {setOpenExportDialog(true)}}
                        ></CalciteAction>
                        <CalciteAction 
                            text="feedback" 
                            icon="speech-bubble-exclamation" 
                            disabled={comparableParcels ? false : true} 
                            textEnabled 
                            scale="s"
                        />
                    </CalciteActionBar>
        
                    <CalciteBlock open collapsible={false}>
                        {/* SEARCH RESULTS LABEL*/}
                        {comparableParcels && comparableParcels.length > 0 ? <ListComparisonResults/> : 
                        <div slot="content">
                            {translateText(`Search for new property`)}
                        </div>
                        
                        } 
                    </CalciteBlock>
            </CalcitePanel>
    )
}

export default ComparisonResults;