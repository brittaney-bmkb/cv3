import { CalcitePanel } from "@esri/calcite-components-react"


const ComparisonPanel = ({panelContent, panelHeading, id, closed, setClose}) => {

    return(
            <CalcitePanel 
            id={id} 
            closed={closed} 
            closable 
            className='panel-start' 
            heading={translateText(panelHeading)} 
            //description= {translateText("Search for similar properties")}
            onCalcitePanelClose={() => {
                setClose(true)
            }}
            style={{display: closed ? 'none': 'flex'}}
            >
                {panelContent}
            </CalcitePanel>
    )
}

export default ComparisonPanel