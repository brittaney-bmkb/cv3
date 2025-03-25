import { 
    CalciteAction,
    CalciteActionBar,
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

import "@esri/calcite-components/dist/components/calcite-stepper";
import "@esri/calcite-components/dist/components/calcite-stepper-item";

import { useEffect, useRef, useState } from "react"
import ComparisonForm from "./ComparisonForm"
import ComparisionStepper from "./ComparisonStepper"
import ComparisonResults from "./ComparisonResults"
import ListComparisonResults from "./ListComparisonResults"
import ComparisonPropertyDetail from "./ComparisonPropertyDetail"
import Inactive from "../Inactive/Inactive"


const PropertyComparison = () => {

    const { 
        clearResultsComparables, 
        translateText, 
        setComparablePanel,  
        comparablePanelClosed,
        comparableParcels,
        secondaryResultFeature ,
        setFeedbackDialog,
        setExportOpen,
        exportOpen,
        feedbackOpen
        } = UseAppContext()

    const stepperRef = useRef(null)

    const [currentStep, setCurrentStep] = useState(0)
    const [title, setTitle] = useState('Property Comparison')

    const handleStepChange = (event) => {

        const selectedStepIndex = event.target.selectedItem.itemPosition

        console.log("Selected Step Index: ", selectedStepIndex)

        setCurrentStep(selectedStepIndex)
    }

    useEffect(() => {

        if(currentStep===0){
            setTitle('Property Comparison')
        }
        else if(currentStep===1 && comparableParcels){
            setTitle(`Property Comparison Results (${comparableParcels.length})`)
        }
        else if(currentStep===2 && secondaryResultFeature){
            setTitle('Property Comparison Detail')
        }

    }, [currentStep, comparableParcels, secondaryResultFeature])

    useEffect(() => {
        setCurrentStep(0)
    }, [])

    useEffect(() => {
        setCurrentStep(2)
    }, [secondaryResultFeature])

    return(
        <CalcitePanel 
            id="comparable-panel" 
            closed={comparablePanelClosed} 
            closable 
            className='panel-end' 
            heading={translateText(title)} 

            onCalcitePanelClose={() => {
                setComparablePanel(true)
                clearResultsComparables()
            }}
            style={{display: comparablePanelClosed ? 'none': 'flex'}}
            >   

            {
                currentStep > 0 ?
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
                        onClick={() => {
                            setExportOpen(true, currentStep === 1  ? 'comparable-search' : 'comparable-property')
                            if(feedbackOpen){
                                setFeedbackDialog(false)
                            }
                        }}
                    ></CalciteAction>
                    <CalciteAction 
                        text="feedback" 
                        icon="speech-bubble-exclamation" 
                        disabled={comparableParcels ? false : true} 
                        textEnabled 
                        scale="s"
                        onClick={() => {
                            setFeedbackDialog(true, 'general')
                            if(exportOpen){
                                setExportOpen(false)
                            }
                        }}
                    />
                </CalciteActionBar> : null
            }
             <Inactive/>
            
            <CalciteStepper 
            ref={stepperRef}
            title={translateText('Property Comparison')} 
            numbered 
            layout="horizontal"
            scale="s"
            onCalciteStepperChange={(event) => {
                handleStepChange(event)
            }}
            >
                <CalciteStepperItem
                selected={currentStep===0}
                heading={translateText("Search")}
                >
                    <ComparisonForm refElement={stepperRef.current} setCurrentStep={setCurrentStep}/>
                </CalciteStepperItem>

                <CalciteStepperItem
                selected={currentStep===1}
                heading={translateText("Results")}
                >
                    {comparableParcels ? <ListComparisonResults refElement={stepperRef.current} setCurrentStep={setCurrentStep}/> : <Inactive/>}
                </CalciteStepperItem>

            <CalciteStepperItem
            selected={currentStep===2}
            heading={translateText("Property")}
            >
                
                {secondaryResultFeature ? <ComparisonPropertyDetail/> : <Inactive/>}
            </CalciteStepperItem>

            </CalciteStepper>

               
        </CalcitePanel>
    )
}

export default PropertyComparison