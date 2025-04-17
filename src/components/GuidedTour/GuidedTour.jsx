import "@esri/calcite-components/dist/components/calcite-popover";
import "@esri/calcite-components/dist/components/calcite-checkbox";

import { CalciteButton, CalciteCheckbox, CalciteDialog, CalciteLabel, CalcitePopover, CalciteTooltip } from "@esri/calcite-components-react"
import { useContext, useEffect, useRef, useState } from "react"
import UseAppContext from "../../contexts/AppContext"

const GuidedTour = () => {

    const { 
        refSearch,
        searchFeatures,
        searchResultsPanelClosed,
        togglePanel,
        propertyDetailPanelClosed,
        translateText,
        setTourDialogOpen,
        tourDialogOpen,
        suppressTourDialog,
        setSuppressTourDialog,
        clearResultsComparables,
        clearResults
     } = UseAppContext()

    const [openTour, setOpenTour] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(true);
    const [dialogEndOpen, setDialogEndOpen] = useState(false);
    const [currentStop, setCurrentStop] = useState(null)
    const [disableNextStop, setDisableNextStop] = useState(false)
    const [suppressWelcome, setSuppressWelcome] = useState(false)

    const popoverRefs = useRef([]); // array of refs for each popover

    const handleStartTour = () => {

        if (suppressWelcome) {
            localStorage.setItem("hideWelcomeDialog", "true")
            setSuppressTourDialog(true)
          }
        
          setTourDialogOpen(false)
          setCurrentStop(0);
          setOpenTour(true);


          togglePanel('all')

          if(searchFeatures){
            clearResults()
            clearResultsComparables()
          }

    }

    const handleSkipTour = () => {
        if (suppressWelcome) {
          localStorage.setItem("hideWelcomeDialog", "true");
          setSuppressTourDialog(true)
        }
      
        setTourDialogOpen(false)
        setOpenTour(false);
      };


    const nextTourStop = (index) => {
        if (index < Object.keys(tourRoute).length - 1) {

            if(index === 1 & searchFeatures?.length === 1){

                setCurrentStop(index + 2)
            }

            // else if(index === 1 & searchFeatures?.length === 1 && !searchResultsPanelClosed){
            //     setCurrentStop(2)
            // }  
            
            // else if(index === 1 & searchFeatures?.length > 1){
            //     setCurrentStop(2)
            //     //togglePanel("search")
            // } 

            else{

                if(index === 2){
                    togglePanel("property")
                }

                if(index === 4){
                    togglePanel("compare")
                }

                setCurrentStop(index + 1);
            }
          
        } else {
          setOpenTour(false);
          setDialogEndOpen(true)
        }
      };
      
    const stopGuidedTour = () => {

        setOpenTour(false)

        setDialogEndOpen(false)

        togglePanel("all")
        clearResults()
        clearResultsComparables()
        //refPopover.current.open = false
    }

    const getAncestors = (element) => {
        const ancestors = new Set();
        let parent = element?.parentElement;
        while (parent) {
          ancestors.add(parent);
          parent = parent.parentElement;
        }
        return ancestors;
      };
      
      const setInteractionIsolation = (referenceElement, popover) => {
        if (!referenceElement || !popover) return;
      
        const allElements = document.querySelectorAll("body *");
      
        const allowed = new Set([
          referenceElement,
          popover,
          ...getAncestors(referenceElement),
          ...getAncestors(popover),
        ]);
      
        allElements.forEach((el) => {
          if (!allowed.has(el) && !referenceElement.contains(el) && !popover.contains(el)) {
            el.setAttribute("inert", "");
          } else {
            console.log("Allowed:", el);
          }
        });
      };
      
      useEffect(() => {
        const refEl = document.getElementById(tourRoute[currentStop]?.id);
        const popoverEl = popoverRefs.current[currentStop];
        
        if (refEl && popoverEl && openTour) {
          setTimeout(() => setInteractionIsolation(refEl, popoverEl), 0);
        }
      
        return () => clearInteractionIsolation();
      }, [currentStop, openTour]);
      
      
    const clearInteractionIsolation = () => {
        document.querySelectorAll("[inert]").forEach((el) => {
          el.removeAttribute("inert");
        });
      };
    

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
       4: {
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
       5: {
        id: "comparable-panel",
        heading: "Compare This Property",
        description: <div>
            <p>{translateText("You can now use CookViewer to find comparable properties—properties with similar characteristics, assessed values, and locations.")}</p>
            <p>{translateText('To begin, locate and select your property on the map, then click "Compare this Property." CookViewer will automatically filter nearby properties based on key factors like:')}</p>
            <ul>
                <li>{translateText("Neighborhood")}</li>
                <li>{translateText("Property class")}</li>
                <li>{translateText("Building square footage")}</li>
                <li>{translateText("Construction age")}</li>
            </ul>
            <p>{translateText("This update introduces a streamlined panel layout that allows you to navigate between:")}</p>
            <ul>
                <li>{translateText("Comparable Search View")}</li>
                <li>{translateText("Comparable Results List")}</li>
                <li>{translateText("Comparable Property Details")}</li>
            </ul>
            <p>{translateText("The comparable properties will be displayed directly on the map, helping you evaluate them alongside your selected property.")}</p>
            <p>{translateText("Use this tool to better understand how your property compares for assessment or appeals.")}</p>
        </div>,
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

        if(currentStop===2 && !propertyDetailPanelClosed){
            //check if search result is found
            setCurrentStop(3)
        }

        if(currentStop === 4 && !searchResultsPanelClosed){
            setCurrentStop(2)
        }

    }, [currentStop, searchFeatures, propertyDetailPanelClosed])


    //create tour steps
    const tourSteps = Object.entries(tourRoute).map(([key, step], index) => {

        //get reference element
        const referenceElement = document.getElementById(step.id);
        if (!referenceElement) return null;

        // Find child or children by selector
        const query = index === 3 ? "calcite-input" : index === 4 ? "calcite-action" : null
        const targetChildrenElements = query ? referenceElement.querySelectorAll(query) : []

        const targetChildrenbyStyles = referenceElement.querySelectorAll(".stepper-item-header");

        const targetChildren = [...targetChildrenbyStyles, ...targetChildrenElements]

        if (currentStop === index) {
        if (targetChildren && targetChildren.length > 0) {
            // Apply highlight to all matching children
            targetChildren.forEach((child) => {
                console.log("child: ", child)
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
            //pointerDisabled={false}
            triggerDisabled
            scale="s"
            onCalcitePopoverOpen={() => {
                //setInteractionIsolation(referenceElement, popoverRefs.current[index]);
              }}
            offsetDistance={index === 4 ? 300 : 10}
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
                    onClick={() => {
                        nextTourStop(index)
                        clearInteractionIsolation();
                    }}
                    disabled={disableNextStop && currentStop === index}
                    >
                  {translateText("Next")}
                </CalciteButton>
              </div>
            </div>
          </CalcitePopover>
        );
      });


    return(
        <>
        <CalciteDialog
        id="welcome-dialog"
        heading="Welcome to CookViewer 3.1"
        description="some text"
        open={tourDialogOpen}
        onCalciteDialogClose={() => {setTourDialogOpen(false)}}
        >
            <div>
                <p>{translateText("CookViewer has been updated with a redesigned layout and new features to improve usability. The interface now includes flexible panels that allow you to view and switch between search results and property details. These panels can be expanded, collapsed, or closed to give you more control over how much space is available for the map.")}</p>
                <p>{translateText("To help you get started, you can take a brief guided tour that introduces the new layout and tools.")}</p>
                <p>{translateText("Your feedback is appreciated and helps us continue to improve the application.")}</p>
                <p><b>{translateText("Would you like to start the tour now?")}</b></p>
            </div>
            <CalciteLabel layout="inline" slot="footer-start">
                <CalciteCheckbox 
                label={translateText("Do not show this again")}
                onCalciteCheckboxChange={(e) => setSuppressWelcome(e.target.checked)}
                ></CalciteCheckbox>
                {translateText("Do not show this again")}
            </CalciteLabel>

            <CalciteButton 
                slot="footer-end"
                appearance="outline"
                label="skip-tour"
                onClick={handleSkipTour}
                >{translateText("Skip")}
            </CalciteButton>

            <CalciteButton 
                slot="footer-end"
                label="start-tour"
                onClick={handleStartTour}
                >{translateText("Start tour")} 
            </CalciteButton>
        </CalciteDialog>

        <CalciteDialog
        id="end-dialog"
        heading="You’ve Reached the End of the Tour"
        // description="some text"
        open={dialogEndOpen}
        onCalciteDialogClose={() => {setDialogEndOpen(false)}}
        >
            <div>
                <p>{translateText("You’ve reached the end of the CookViewer tour. Here’s a quick recap of what was covered:")}</p>
                <ul>
                    <li>{translateText("Selecting your preferred language")}</li>
                    <li>{translateText("Searching by address, PIN, or intersection")}</li>
                    <li>{translateText("Viewing search results and detailed property information")}</li>
                    <li>{translateText("Navigating panels using the Panel Selector")}</li>
                    <li>{translateText("Using the Property Comparison tool to find similar properties")}</li>
                </ul>
                <p>{translateText("To learn more about how to use CookViewer’s features, click the Help icon in the top navigation bar. There, you’ll find step-by-step guidance and additional support resources.")}</p>
                <p>{translateText("Thank you for using CookViewer. Your feedback helps us continue to improve.")}</p>
            </div>
            <CalciteButton 
                slot="footer-end"
                label="start-tour"
                onClick={()=>{
                    setOpenTour(false)
                    setCurrentStop(0)
                    setTourDialogOpen(true)
                    setDialogEndOpen(false)
                }
                }
                >{translateText("Restart tour")} 
            </CalciteButton>
            <CalciteButton 
                slot="footer-end"
                appearance="outline"
                label="end-tour"
                onClick={stopGuidedTour}
                >{translateText("Finish")}
            </CalciteButton>


        </CalciteDialog>

        {openTour && tourSteps}


        </>
    )
}

export default GuidedTour