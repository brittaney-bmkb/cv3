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

import { useEffect, useRef, useState } from "react"
import ComparisonForm from "./ComparisonForm"
import ComparisionStepper from "./ComparisonStepper"
import ComparisonResults from "./ComparisonResults"
import ListComparisonResults from "./ListComparisonResults"
import ComparisonPropertyDetail from "./ComparisonPropertyDetail"
import Inactive from "../Inactive/Inactive"

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

    const stepperRef = useRef(null)
    const [ radius, setRadius ] = useState(null)
    const [ queryString, setQueryString] = useState(null)
    const [ sourceParcel, setSourceParcel ] = useState(null)

    const [currentStep, setCurrentStep] = useState(0)

    const handleStepChange = (event) => {

        const selectedStepIndex = event.target.items.filter((item) => item.selected)
                                                .map((item, i) => i)

        console.log("Selected Step Index: ", selectedStepIndex)

        setCurrentStep(selectedStepIndex[0])
    }

    return(
        <CalcitePanel 
            id="comparable-panel" 
            closed={comparablePanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText('Property Comparison')} 
            //description= {translateText("Search for similar properties")}
            onCalcitePanelClose={() => {
                setComparablePanel(true)
                clearResultsComparables()
            }}
            style={{display: comparablePanelClosed ? 'none': 'flex'}}
            >   
             <Inactive/>
            
            <CalciteStepper 
            ref={stepperRef}
            title={translateText('Property Comparison')} 
            numbered 
            layout="horizontal"
            scale="s"
            style={{overflow:"auto"}}
            oncalciteStepperChange = {(event) => {
                handleStepChange(event)
            }}
            >
                <CalciteStepperItem
                selected={currentStep===0}
                heading={translateText("Search")}
                //description={translateText("Search for similar properties")}
                >
                    <ComparisonForm refElement={stepperRef.current} setCurrentStep={setCurrentStep}/>
                </CalciteStepperItem>

                <CalciteStepperItem
                //selected={currentStep===1}
                heading={translateText("Results")}
                //description={translateText("View Results")}
                >
                    <ListComparisonResults/> 
                </CalciteStepperItem>

            <CalciteStepperItem
            //selected={currentStep===2}
            heading={translateText("Property")}
            //description={translateText("View Comparable Property Details")}
            >
                <ComparisonPropertyDetail/> 
            </CalciteStepperItem>

            </CalciteStepper>
            
            {/* <div slot="footer-end" style={{display: "flex", gap: '20px', justifyContent:'end'}}>
            <CalciteButton iconStart="reset" appearance="outline">
                Reset
            </CalciteButton>
            <CalciteButton className='hyperlink-button' onClick={() => handleSetQuery()}>
                Search
            </CalciteButton>
            </div> */}

            {/*  */}


               
        </CalcitePanel>
    )
}

export default PropertyComparison