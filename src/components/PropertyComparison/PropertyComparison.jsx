import { 
    CalciteAction,
    CalciteActionBar,
    CalcitePanel, 
    CalciteStepper,
    CalciteStepperItem
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

import "@esri/calcite-components/dist/components/calcite-stepper";
import "@esri/calcite-components/dist/components/calcite-stepper-item";

import { useEffect, useRef, useState } from "react"
import ComparisonForm from "./ComparisonForm"
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
        feedbackOpen,
        isMobile
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
            setTitle('Comparable Property Search')
        }
        else if(currentStep===1 && comparableParcels){
            setTitle(`Comparable Property Results (${comparableParcels.length})`)
        }
        else if(currentStep===2 && secondaryResultFeature){
            setTitle('Comparable Property Detail')
        }

    }, [currentStep, comparableParcels, secondaryResultFeature])

    useEffect(() => {
        if(secondaryResultFeature && secondaryResultFeature.length > 0){
            setCurrentStep(2)
        }
        
    }, [secondaryResultFeature])


    useEffect(() => {

        if(comparablePanelClosed){
            clearResultsComparables()
            setCurrentStep(0)
        }

    }, [comparablePanelClosed])

    return(
        <CalcitePanel 
            id="comparable-panel" 
            closed={comparablePanelClosed} 
            closable 
            className={isMobile ? 'panel-end' : 'panel-start' }
            heading={translateText(title)} 

            onCalcitePanelClose={() => {
                setComparablePanel(true)
                clearResultsComparables()
                setCurrentStep(0)
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
                disabled={comparableParcels?false:true}
                selected={currentStep===1}
                heading={translateText("Results")}
                >
                    {comparableParcels ? <ListComparisonResults refElement={stepperRef.current} setCurrentStep={setCurrentStep}/> : <Inactive/>}
                </CalciteStepperItem>

                <CalciteStepperItem
                disabled={secondaryResultFeature?false:true}
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