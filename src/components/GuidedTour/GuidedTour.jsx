import "@esri/calcite-components/dist/components/calcite-popover";
import "@esri/calcite-components/dist/components/calcite-checkbox";

import { CalciteButton, CalciteCheckbox, CalciteDialog, CalciteLabel, CalcitePopover, CalciteTooltip } from "@esri/calcite-components-react"
import { useContext, useEffect, useRef, useState } from "react"
import UseAppContext from "../../contexts/AppContext"

const GuidedTour = () => {

    const { 
        refSearch,
        searchFeatures,
        setPrimaryResultFeature,
        togglePanel,
        propertyDetailPanelClosed,
        translateText
     } = UseAppContext()

    const [openTour, setOpenTour] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(true);
    const refPopover = useRef(null)

    const tourRoute = {
       0: {
        id: "translate",
        heading: "Select a Language",
        description: <div><p>{translateText("CookViewer is now available in multiple languages. Use the Translate button in the top-right corner to switch between English and Spanish.")}</p>
        <p>{translateText("Click the button now to open the language menu and choose your preferred language. Your selection will update the interface text throughout the application.")}</p></div>,
        accessibleLabel: "some text"
       },
       1: {
        id: "search",
        heading: "Search for a Property",
        description:<div>
            <p>{translateText("Use the Search bar to find properties across Cook County. You can search by:")}
            </p>
                <ul>
                    <li>{translateText("Street address")}</li>
                    <li>{translateText("10-digit or 14-digit Property Index Number (PIN)")}</li>
                    <li>{translateText("Street intersection")}</li>
                </ul>
            
            <p>{translateText("Start typing in the search bar to see suggestions and select a result to zoom directly to that location on the map.")}</p>
        </div>,
        accessibleLabel: "some text"
       }, 
       2: {
        id: "search-results-panel",
        heading: "Search Results Panel",
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

        setOpenTour(true)
        refPopover.current.open = false
    }


    // useEffect(() => {

    //     if(!refPopover.current || !openTour) return;
        
    //     if(currentStop === 4 || !propertyDetailPanelClosed){
    //         console.log("opening popover for current stop:", currentStop)
    //         setCurrentStop(4)
    //         refPopover.current.open == true
    //         togglePanel("property")
    //     }

    // }, [currentStop, openTour, refPopover, propertyDetailPanelClosed])

    return(
        <>
        <CalciteDialog
        heading="Welcome to CookViewer 3.1"
        description="some text"
        open={dialogOpen}
        >
            <div>
                <p>{translateText("CookViewer has been updated with a redesigned layout and new features to improve usability. The interface now includes flexible panels that allow you to view and switch between search results and property details. These panels can be expanded, collapsed, or closed to give you more control over how much space is available for the map.")}</p>
                <p>{translateText("To help you get started, you can take a brief guided tour that introduces the new layout and tools.")}</p>
                <p>{translateText("Your feedback is appreciated and helps us continue to improve the application.")}</p>
                <p><b>{translateText("Would you like to start the tour now?")}</b></p>
            </div>
            <CalciteLabel layout="inline" slot="footer-start">
                <CalciteCheckbox label={translateText("Do not show this again")}></CalciteCheckbox>
                {translateText("Do not show this again")}
            </CalciteLabel>
            <CalciteButton 
                slot="footer-end"
                label="start-tour"
                onClick={()=>{
                    setOpenTour(true)
                    setDialogOpen(false)
                }
                }
                >{translateText("Start tour")} 
            </CalciteButton>
            <CalciteButton 
                slot="footer-end"
                appearance="outline"
                label="skip-tour"
                onClick={()=>{
                    setOpenTour(false)
                    setDialogOpen(false)
                }
                }
                >{translateText("Skip")}
            </CalciteButton>


        </CalciteDialog>
        
            <CalcitePopover 
            ref={refPopover}
            placement="leading"
            overlayPositioning="fixed"
            id={"translate-tooltip"} 
            referenceElement={tourRoute[currentStop].id} 
            open={openTour}
            // closable
            label={tourRoute[currentStop].accessibleLabel}
            heading={tourRoute[currentStop].heading}
            focusTrapOptions={{"allowOutsideClick":true}}
            triggerDisabled
            scale="s"
            
            >   
            <div style={{paddingLeft: 15, paddingRight:15, paddingBottom:15, width:300}}>
                {tourRoute[currentStop].description}
                <div style={{textAlign:'end', width: '100%'}}>
                    <CalciteButton
                        appearance="transparent"
                        onClick={stopGuidedTour}
                    >{translateText("End Tour")}</CalciteButton>
                    <CalciteButton
                        iconEnd="arrow-right"
                        onClick={nextTourStop}
                    >{translateText("Next")}</CalciteButton>
                </div>
            </div>
            
                
            </CalcitePopover>

        </>
    )
}

export default GuidedTour