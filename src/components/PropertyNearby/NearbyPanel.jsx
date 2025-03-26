import { CalciteAction, CalciteActionBar, CalciteBlock, CalciteButton, CalciteDropdown, CalciteDropdownGroup, CalciteDropdownItem, CalciteInputNumber, CalciteLabel, CalcitePanel, CalciteStepper, CalciteStepperItem } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useRef, useState } from "react"
import Inactive from "../Inactive/Inactive"
import ListComparisonResults from "../PropertyComparison/ListComparisonResults"
import ComparisonPropertyDetail from "../PropertyComparison/ComparisonPropertyDetail"

export const linearUnitOptions = {
    "feet": {
        'max': 5280,
        'step': 1
    }, 
    "miles": {
        'max': 1,
        'step': .25
    },
    "meters": {
        'max': 1609.34,
        'step': 1
    },
    "kilometers": {
        'max': 1.60934,
        'step': 1
    }
} 
    


const NearbyPanel = () => {
    const  { 
        nearbyPanelClosed, 
        setNearbyPanel, 
        translateText, 
        searchNearbyProperties, 
        clearResultsComparables,
        comparableParcels,
        secondaryResultFeature,
        primaryResultFeature
     } = UseAppContext()

    const stepperRef = useRef(null)
    const [selectedUnit, setSelectedUnit] = useState(Object.keys(linearUnitOptions)[0])
    const [searchRadius, setSearchRadius] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const [title, setTitle] = useState('Nearby Search')

    const handleSearchRadius = () => {

        searchNearbyProperties(searchRadius, selectedUnit)
        setCurrentStep(1)

    }

    const handleReset = () => {

        clearResultsComparables()
        setSearchRadius(0)
        setSelectedUnit(Object.keys(linearUnitOptions)[0])
    }

    

    const handleStepChange = (event) => {

        const selectedStepIndex = event.target.selectedItem.itemPosition

        console.log("Selected Step Index: ", selectedStepIndex)

        setCurrentStep(selectedStepIndex)
    }

    useEffect(() => {

        if(currentStep===0){
            setTitle('Nearby Search')
        }
        else if(currentStep===1 && comparableParcels){
            setTitle(`Nearby Property Results (${comparableParcels.length})`)
        }
        else if(currentStep===2 && secondaryResultFeature){
            setTitle('Nearby Property Detail')
        }

    }, [currentStep, comparableParcels, secondaryResultFeature])

    useEffect(() => {
        if(secondaryResultFeature && secondaryResultFeature.length > 0){
            setCurrentStep(2)
        }
        
    }, [secondaryResultFeature])

    useEffect(() => {

        if(nearbyPanelClosed){
            clearResultsComparables()
            setCurrentStep(0)
        }

    }, [nearbyPanelClosed])



    return(
        <CalcitePanel 
            id="nearby-panel" 
            closed={nearbyPanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText(title)} 
            //description= {translateText("Search for similar properties")}
            onCalcitePanelClose={() => {
                setNearbyPanel(true)
                clearResultsComparables()
                setCurrentStep(0)
            }}
            style={{display: nearbyPanelClosed ? 'none': 'flex'}}
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
                {/* <CalciteBlock
                    open
                    heading={translateText("Find nearby parcels within a custom distance")}
                    description={translateText("Set the radius to search for parcels around your selected location (maximum of 1 mile).")}
                    >*/}
                        <form id="nearby-search" style={{display:'flex', flexDirection: 'column', gap: '20px'}}> 
                            <div>
                                {translateText("Set the radius to search for parcels around your selected location (maximum of 1 mile).")}
                            </div>
                            <div style={{display:'flex', flexDirection: 'row', justifyContent:'space-between'}}>

                            <CalciteInputNumber
                            form="nearby-search"
                            min={0}
                            max={linearUnitOptions[selectedUnit]['max']}
                            step={linearUnitOptions[selectedUnit]['step']}
                            validationMessage="Radius test"
                            value={searchRadius}
                            onCalciteInputNumberChange={(e) => {setSearchRadius(e.target.value)}}
                            />
                            <CalciteDropdown
                                onCalciteDropdownSelect={(e) => {setSelectedUnit(e.target.selectedItems[0].textContent)}}
                            >
                                <CalciteButton 
                                form="nearby-search"
                                slot="trigger" 
                                className="hyperlink-button"
                                width="full">
                                    {translateText(selectedUnit)}
                                </CalciteButton>
                                <CalciteDropdownGroup selection-mode="single">
                                {Object.keys(linearUnitOptions).map(unitOption => {
                                    return(
                                        <CalciteDropdownItem
                                        key={unitOption}
                                        label={unitOption}>
                                            {unitOption}
                                        </CalciteDropdownItem>
                                    )
                                    
                                })}
                                </CalciteDropdownGroup>
                                
                            </CalciteDropdown>  
                                                            
                            </div>
                        </form>
                        
                    {/* </CalciteBlock>  */}
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

            
            {
            currentStep === 0 ?
                <div slot="footer-end" style={{display: "flex", gap: '20px'}}>
                    <CalciteButton disabled={primaryResultFeature?false:true} iconStart="reset" appearance="outline" onClick={() => {handleReset()}}>
                        Reset
                    </CalciteButton>
                    <CalciteButton disabled={primaryResultFeature?false:true} className='hyperlink-button' onClick={() => handleSearchRadius()}>
                        Search
                    </CalciteButton>
                </div> : null
            }

        </CalcitePanel>
    )
}

export default NearbyPanel