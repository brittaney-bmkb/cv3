import { 
    CalciteAction,
    CalciteActionBar,
    CalciteBlock,
    CalciteFab,
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
        isMobile,
        primaryResultFeature
        } = UseAppContext()

    const stepperRef = useRef(null)

    const [currentStep, setCurrentStep] = useState(0)
    const [title, setTitle] = useState('Property Comparison')

    const handleStepChange = (event) => {
        
        const selectedStepIndex = event.target.selectedItem.itemPosition

        //console.log("Selected Step Index: ", selectedStepIndex)

        setCurrentStep(selectedStepIndex)
    }


    useEffect(() => {
        //reset the steps to 0
        setCurrentStep(0)
    }, [primaryResultFeature])

    useEffect(() => {

        // if(!comparableParcels || comparableParcels.length === 0){
        //     setCurrentStep(0)
        // }

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
            //clearResultsComparables()
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
                //clearResultsComparables()
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
                complete={currentStep > 0}
                >
                    {primaryResultFeature && primaryResultFeature?.length > 0 ?
                        <ComparisonForm refElement={stepperRef.current} setCurrentStep={setCurrentStep}/>
                        : 
                        <Inactive
                        title={translateText("Select a Property to Compare")}
                        message={translateText( "To use the Compare Properties tool, first select a property on the map or from your search results. The selected property will be used as the basis for finding comparable properties.")}
                        />
                    }
                </CalciteStepperItem>

                <CalciteStepperItem
                disabled={comparableParcels?false:true}
                selected={currentStep===1}
                heading={translateText("Results")}
                complete={currentStep > 1 && comparableParcels?.length > 0}
                >
                    {comparableParcels && comparableParcels.length > 0 ? <ListComparisonResults refElement={stepperRef.current} setCurrentStep={setCurrentStep}/> : 
                    
                         currentStep > 0 &&    
                         (<Inactive
                            title={translateText("No Comparable Properties Found")}
                            message={translateText("No comparable properties were found based on the selected criteria. Try increasing the search radius or adjusting the property size and characteristics to broaden your results.")}
                            />)
                            
                            
                            
             
                    }
                </CalciteStepperItem>

                <CalciteStepperItem
                disabled={secondaryResultFeature?false:true}
                selected={currentStep===2}
                heading={translateText("Property")}
                
                >
                    
                    {secondaryResultFeature ? <ComparisonPropertyDetail/> : 
                    
                    currentStep > 0 &&    
                         (<Inactive
                         title={translateText("No Comparable Properties Found")}
                         message={translateText("No comparable properties were found based on the selected criteria. Try increasing the search radius or adjusting the property size and characteristics to broaden your results.")}
                         />)
                         
                    }
                </CalciteStepperItem>

            </CalciteStepper>

               
        </CalcitePanel>
    )
}

export default PropertyComparison