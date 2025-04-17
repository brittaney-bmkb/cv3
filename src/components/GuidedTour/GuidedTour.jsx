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
    const [currentStop, setCurrentStop] = useState(0)
    const [disableNextStop, setDisableNextStop] = useState(false)

    const popoverRefs = useRef([]); // array of refs for each popover

    const nextTourStop = (index) => {
        if (index < Object.keys(tourRoute).length - 1) {

            if(index === 1 & searchFeatures?.length === 1){

                setCurrentStop(index + 3)
            }
            else{
                setCurrentStop(index + 1);
            }
          
        } else {
          setOpenTour(false);
        }
      };
      
    const stopGuidedTour = () => {

        setOpenTour(false)
        refPopover.current.open = false
    }


    const tourRoute = {
       0: {
        id: "translate",
        heading: "Select a Language",
        description: <div ><p>{translateText("CookViewer is now available in multiple languages. Use the Translate button in the top-right corner to switch between English and Spanish.")}</p>
        <p>{translateText("Click the button now to open the language menu and choose your preferred language. Your selection will update the interface text throughout the application.")}</p></div>,
        accessibleLabel: "some text",
        div: document.getElementById("translate")
       },
       1: {
        id: "search-bar",
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
        accessibleLabel: "some text",
        div: document.getElementById("search-bar")
       }, 
       2: {
        id: "search-results-panel",
        heading: "Search Results Panel",
        description:<div>
            <p>{translateText("The Search Results Panel displays the number of properties returned by your search. From here, you can:")}</p>
            <ul>
                <li>{translateText("Clear your search to start a new one")}</li>
                <li>{translateText("Export the results to CSV or Excel")}</li>
                <li>{translateText("Submit feedback using the toolbar at the top of the panel")}</li>
                <li>{translateText("Select a property from the list to view detailed information")}</li>
            </ul>
            <p>{translateText("New in CookViewer 3.1: You can now collapse or close this panel to give yourself more space to explore the map.")}</p>
            <p>{translateText("Try selecting a result or using the toolbar options to explore these features.")}</p>
        </div>,
        accessibleLabel: "some text",
        div: document.getElementById("search-results-panel")
       },
       3: {
        id: "export-search-results",
        heading: "Export Search Results",
        description: "some text",
        accessibleLabel: "some text"
       },
       4: {
        id: "property-detail-panel",
        heading: "Property Details Panel",
        description: <div>
            <p>{translateText("The Property Details Panel provides comprehensive information about a selected property. It includes:")}</p>
            <ul>
                <li>{translateText("Location and tax details")}</li>
                <li>{translateText("Assessed value")}</li>
                <li>{translateText("Building characteristics and imagery")}</li>
                <li>{translateText("Data and resources")}</li>
                <li>{translateText("Political and taxing district information")}</li>
                <li>{translateText("Tools for comparing properties for appeals")}</li>
            </ul>
            <p>{translateText("The top toolbar also lets you clear, export, or submit feedback.")}</p>
            <p>{translateText('New in CookViewer 3.1: Use the built-in search bar to quickly find key information. Type in terms like "total assessed value" or "district" to filter the panel and highlight relevant data.')}</p>
            <p>{translateText("Try using the search bar now to explore the available property details.")}</p>
        </div>,
        accessibleLabel: "some text"
       },
       5: {
        id: "start-action-bar",
        heading: "Panel Selector",
        description: <div>
            <p>{translateText("The Panel Selector on the left side of the screen provides a consistent way to navigate between key panels in CookViewer, including:")}</p>
            <ul>
                <li>{translateText("Search Results")}</li>
                <li>{translateText("Property Details")}</li>
                <li>{translateText("Info Panel")}</li>
                <li>{translateText("Tour Launcher")}</li>
            </ul>
            <p>{translateText("You can use the buttons in the Panel Selector to reopen panels you’ve closed, keeping navigation simple and accessible throughout your session.")}</p>
            <p>{translateText("The Panel Selector can also be collapsed or expanded by clicking the toggle button at the bottom. This gives you more space for the map while still keeping important tools within reach.")}</p>
            <p>{translateText("Try clicking a button in the Panel Selector to view a panel.")}</p>
        </div>,
        accessibleLabel: "some text"
       },
       6: {
        id: "translate",
        heading: "Translate",
        description: "some text",
        accessibleLabel: "some text"
       },
    }


    useEffect(() => {

        if(currentStop===1){
            //check if search result is found
            if(!searchFeatures || searchFeatures?.length === 0){
                setDisableNextStop(true)
            }
            else{
                setDisableNextStop(false)
            }
        }

    }, [currentStop, searchFeatures])


    //create tour steps
    const tourSteps = Object.entries(tourRoute).map(([key, step], index) => {

        //get reference element
        const referenceElement = document.getElementById(step.id);
        if (!referenceElement) return null;

        // Find child or children by selector
        const query = index === 4 ? "calcite-input" : index === 5 ? "calcite-action" : null
        const targetChildren = query ? referenceElement.querySelectorAll(query) : null

        if (currentStop === index) {
        if (targetChildren && targetChildren.length > 0) {
            // Apply highlight to all matching children
            targetChildren.forEach((child) => {
                child.style.setProperty("border", "2px solid #FFA500");

            });
        } else {
            referenceElement.classList.add("tour-highlight");
        }
        } else {
        if (targetChildren && targetChildren.length > 0) {
            // Remove highlight from all matching children
            targetChildren.forEach((child) => {
                child.style.setProperty("border", "none");
            });
        } else {
            referenceElement.classList.remove("tour-highlight");
        }
        }

        
        
      
        return (
          <CalcitePopover
            key={`${index}-${step.id}`}
            ref={(el) => (popoverRefs.current[index] = el)}
            placement="leading"
            overlayPositioning="fixed"
            referenceElement={referenceElement}
            open={openTour && currentStop === index}
            label={step.accessibleLabel}
            heading={step.heading}
            focusTrapOptions={{
              "allowOutsideClick": false,
              "returnFocusOnDeactivate": true,
              "extraContainers": [referenceElement],
              "clickOutsideDeactivates": false
              
            }}
            pointerDisabled={false}
            triggerDisabled
            scale="s"
            onCalcitePopoverOpen={() => console.log("Popover opened for step", index)}
            offsetDistance={index === 5 ? 300 : 10}
          >
            <div className="tour-text" style={{ padding: 15, width: 300 }}>
              {step.description}
              <div
                style={{
                  justifyContent: "end",
                  width: "100%",
                  display: "flex",
                  gap: 10,
                  paddingTop: 20,
                }}
              >
                <CalciteButton appearance="outline" onClick={stopGuidedTour}>
                  {translateText("End Tour")}
                </CalciteButton>
                <CalciteButton 
                    iconEnd="arrow-right" 
                    onClick={() => nextTourStop(index)}
                    disabled={disableNextStop && currentStop === index}
                    >
                  {translateText("Next")}
                </CalciteButton>
              </div>
            </div>
          </CalcitePopover>
        );
      });

    
    const updateExtraContainers = () => {

        console.log("updateExtraContainers triggered")

        const popover = refPopover.current;
        if(!popover) return;

        let allowed = []

        const container = document.getElementById(tourRoute[currentStop].id)
        console.log("allowed container: ", container)
        allowed.push(container)

        console.log("allowed: ", allowed)

        //popover.focusTrapOptions.extraContainers = allowed
        popover.updateFocusTrapElements(allowed)
        console.log("popover target: ", popover.target)
    }

    return(
        <>
        <CalciteDialog
        id="welcome-dialog"
        heading="Welcome to CookViewer 3.1"
        description="some text"
        open={dialogOpen}
        onCalciteDialogClose={() => {setDialogOpen(false)}}
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
                    //updateExtraContainers()
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

        {openTour && tourSteps}


        </>
    )
}

export default GuidedTour