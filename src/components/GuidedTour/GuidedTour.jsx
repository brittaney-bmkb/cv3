import "@esri/calcite-components/dist/components/calcite-popover";

import { CalciteButton, CalcitePopover, CalciteTooltip } from "@esri/calcite-components-react"
import { useContext, useEffect, useRef, useState } from "react"
import UseAppContext from "../../contexts/AppContext"

const GuidedTour = () => {

    const { 
        refSearch,
        searchFeatures,
        setPrimaryResultFeature,
        togglePanel,
        propertyDetailPanelClosed
     } = UseAppContext()

    const [endTour, setEndTour] = useState(false);
    const refPopover = useRef(null)

    const tourRoute = {
       0: {
        id: "translate",
        heading: "Translate",
        description: "some text",
        accessibleLabel: "some text"
       },
       1: {
        id: "search",
        heading: "Search",
        description: "some text",
        accessibleLabel: "some text"
       }, 
       2: {
        id: "search-results-panel",
        heading: "Search Results",
        description: "some text",
        accessibleLabel: "some text"
       },
       3: {
        id: "export-search-results",
        heading: "Export Search Results",
        description: "some text",
        accessibleLabel: "some text"
       },
       4: {
        id: "property-detail-panel",
        heading: "Property Details",
        description: "some text",
        accessibleLabel: "some text"
       },
       5: {
        id: "translate",
        heading: "Translate",
        description: "some text",
        accessibleLabel: "some text"
       },
       6: {
        id: "translate",
        heading: "Translate",
        description: "some text",
        accessibleLabel: "some text"
       },
    }
    const [currentStop, setCurrentStop] = useState(0)

    const nextTourStop = () => {

        setCurrentStop(currentStop+1)

        if(currentStop === 1 && refSearch.current && !refSearch.current.searchTerm){
            //submit a search
            console.log("Setting new search parameter")
            refSearch.current.search("69 w washington")
        }

        if(currentStop === 4 && searchFeatures?.length > 0){
            //submit a search
            setPrimaryResultFeature([searchFeatures[0]])
            
        }

        if(currentStop === 5){
            //submit a search
            togglePanel("imagery")
        }
    }
    
    const stopGuidedTour = () => {

        setEndTour(true)
        refPopover.current.open = false
    }


    useEffect(() => {

        if(!refPopover.current || endTour) return;
        
        if(currentStop === 4 || !propertyDetailPanelClosed){
            console.log("opening popover for current stop:", currentStop)
            setCurrentStop(4)
            refPopover.current.open == true
            togglePanel("property")
        }

    }, [currentStop, endTour, refPopover, propertyDetailPanelClosed])

    return(
        <>
        
            <CalcitePopover 
            ref={refPopover}
            placement="leading"
            overlayPositioning="fixed"
            id={"translate-tooltip"} 
            referenceElement={tourRoute[currentStop].id} 
            open
            // closable
            label={tourRoute[currentStop].accessibleLabel}
            heading={tourRoute[currentStop].heading}
            >   
            <div style={{paddingLeft: 15, paddingRight:15, paddingBottom:15}}>
                <p>{tourRoute[currentStop].description}</p>
                <div style={{textAlign:'end', width: '100%'}}>
                    <CalciteButton
                        appearance="transparent"
                        iconEnd="arrow-right"
                        onClick={stopGuidedTour}
                    >End Tour</CalciteButton>
                    <CalciteButton
                        appearance="outline-fill"
                        iconEnd="arrow-right"
                        onClick={nextTourStop}
                    >Next</CalciteButton>
                </div>
            </div>
            
                
            </CalcitePopover>

        </>
    )
}

export default GuidedTour