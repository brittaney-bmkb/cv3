import { 
    CalciteBlock, 
    CalciteBlockGroup, 
    CalciteBlockSection, 
    CalciteButton, 
    CalciteDropdown, 
    CalciteDropdownGroup, 
    CalciteDropdownItem, 
    CalciteInput, 
    CalciteInputNumber, 
    CalciteInputText, 
    CalciteLabel, 
    CalcitePanel, 
    CalciteStepper,
    CalciteStepperItem
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

import "@esri/calcite-components/dist/components/calcite-input-text"
import "@esri/calcite-components/dist/components/calcite-input-number"
import "@esri/calcite-components/dist/components/calcite-dropdown"
import "@esri/calcite-components/dist/components/calcite-dropdown-group"
import "@esri/calcite-components/dist/components/calcite-dropdown-item"

import "@esri/calcite-components/dist/components/calcite-stepper";
import "@esri/calcite-components/dist/components/calcite-stepper-item";

import { useEffect, useState } from "react"
import ComparisonForm from "./ComparisonForm"
import ComparisionStepper from "./ComparisonStepper"
import ComparisonResults from "./ComparisonResults"
import ListComparisonResults from "./ListComparisonResults"
import ComparisonPropertyDetail from "./ComparisonPropertyDetail"

const constructionTypes = [
    "Any",
    "None",
    "Frame",
    "Masonry",
    "Frame and Masonry",
    "Stucco"
]

export const radiusTypes = {
    "Eighth Mile": .125,
    "Quarter Mile": .25,
    "Half Mile": .5,
    "Mile": 1,
    "None": "None",
}

const PropertyComparison = () => {

    const { 
        clearResultsComparables, 
        searchComparableProperties, 
        translateText, 
        setComparablePanel,  
        comparablePanelClosed, 
        primaryResultFeature} = UseAppContext()

    const [ radius, setRadius ] = useState(null)
    const [ queryString, setQueryString] = useState(null)
    const [ sourceParcel, setSourceParcel ] = useState(null)




    return(
        <CalcitePanel 
            id="comparable-panel" 
            closed={comparablePanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText('Comparable Search')} 
            //description= {translateText("Search for similar properties")}
            onCalcitePanelClose={() => {
                clearResultsComparables()
            }}
            style={{display: comparablePanelClosed ? 'none': 'flex'}}
            >   

            <CalciteStepper numbered layout="horizontal">
                <CalciteStepperItem
                selected
                heading={translateText("Search")}
                //description={translateText("Search for similar properties")}
                >
                    <ComparisonForm/>
            </CalciteStepperItem>
            <CalciteStepperItem
            heading={translateText("Results")}
            //description={translateText("View Results")}
            >
                <ListComparisonResults/> 
            </CalciteStepperItem>

            <CalciteStepperItem
            heading={translateText("Property")}
            //description={translateText("View Comparable Property Details")}
            >
                <ComparisonPropertyDetail/> 
            </CalciteStepperItem>

            </CalciteStepper>

            {/*  */}


               
        </CalcitePanel>
    )
}

export default PropertyComparison