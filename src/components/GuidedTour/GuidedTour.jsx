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
        clearResults,
        exportOpen,
        setExportOpen,
        feedbackOpen,
        setFeedbackDialog
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

        if(!popoverRefs.current) return;

        popoverRefs.current.map((popoverRef) => {

          if(!popoverRef.current) return;

          
          updateStyle(popoverRef.current.id)

          }     
        )
        
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

        //console.log("element to isolate: ", referenceElement, popover)
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
            ////console.log("Allowed:", el);
          }
        });
      };
      
      useEffect(() => {
        
        let stop = currentStop
        if(exportOpen){
          stop = 7
        }
        if(feedbackOpen){
          stop = 8
        }
        const refEl = document.getElementById(tourRoute[stop]?.id);
        const popoverEl = document.getElementById('popover');
        
        //console.log("isolation setting up for tour stop: ", currentStop, refEl, popoverEl)

        if (refEl && popoverEl && openTour) {
          setTimeout(() => setInteractionIsolation(refEl, popoverEl), 0);
        }
      
        return () => clearInteractionIsolation();
      }, [currentStop, openTour, exportOpen, feedbackOpen]);
      
      
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
            <p>{translateText('New in CookViewer 3.1: Use the built-in search bar to quickly find key information. Type in terms like "assessed value" or "district" to filter the panel and highlight relevant data.')}</p>
            <p>{translateText("Try using the search bar now to explore the available property details.")}</p>
        </div>,
        accessibleLabel: "some text"
       },
       4: {

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
       7: {
        id: "export-dialog",
        heading: "Export search results",
        description: <div>
        <p>{translateText("You can export property details from your search results to a CSV or Excel file for further use or sharing.")}</p>
        <ul>
          <li>{translateText("Click the filename box and type in a name for your file.")}</li>
          <li>{translateText("Click the file type button to choose between CSV or Excel format.")}</li>
          <li>{translateText("Click Export to download your file. It will appear in your Downloads folder.")}</li>
        </ul>
       </div>,
        
        accessibleLabel: "some text",
        div: document.getElementById("export-dialog")
       },
       8: {
        id: "feedback-dialog",
        heading: "Submit Feedback",
        description: <div>
          <p>{translateText("Help us improve CookViewer by sharing your thoughts about the search results.")}</p>
          <ul>
            <li>{translateText("Were the results what you expected?")}</li>
            <li>{translateText("Did you notice any errors or missing information?")}</li>
          </ul>
          <p>{translateText("Your feedback goes directly to our team and helps us make CookViewer better for everyone.")}</p>
        </div>,
      
        accessibleLabel: "some text",
        div: document.getElementById("feedback-dialog")
       }
    }


    useEffect(() => {


        console.log("Current stop: ", currentStop)

        if(currentStop === 2 && (!searchFeatures || searchFeatures.length === 0)){
          setCurrentStop(1)
        }
      

        //if user closes to search panel while on the second stop
        //go to stop 4 with info on the panel selector
        if(searchResultsPanelClosed && currentStop === 2){
          setCurrentStop(4)
        }

        //if the property detail panel is open
        //go to stop 3 with property detail info
        if(!propertyDetailPanelClosed){
          setCurrentStop(3)
        }

        //if the current stop is updated to 3 open the 
        // property detail panel
        if(currentStop === 3){
          togglePanel('property')
        }


        //if the current stop is 4 to highlight the panel selector
        //and the search results panel is open  then set the stop to stop 2
        //to show details about the search results
        if(currentStop === 4 && !searchResultsPanelClosed){
            setCurrentStop(2)
        }

    }, [currentStop, searchFeatures, propertyDetailPanelClosed, exportOpen, feedbackOpen, searchResultsPanelClosed])


    const updateStyle = (id, index) => {
      ////console.log("updating style")
      //get reference element

      ////console.log("ref element id: ", id)
      if(currentStop === 6 ) return;
      if(currentStop === 7 ) return;
      const referenceElement = document.getElementById(id);
        
      if (!referenceElement) return null;

      // Find child or children by selector
      const query = index === 3 ? "calcite-input" : index === 4 ? "calcite-action" : null
      const targetChildrenElements = query ? referenceElement.querySelectorAll(query) : []

      const targetChildrenbyStyles = referenceElement.querySelectorAll(".stepper-item-header");

      const targetChildren = [...targetChildrenbyStyles, ...targetChildrenElements]

      if (currentStop === index && openTour) {
        if (targetChildren && targetChildren.length > 0) {
            // Apply highlight to all matching children
            ////console.log("Apply highlight to all matching children")
            targetChildren.forEach((child) => {
                ////console.log("child: ", child)
                child.style.setProperty("border", "2px solid #FFA500");

            });
        } else {
            referenceElement.classList.add("tour-highlight");
        }
      } 
      else {
        ////console.log("Removing highlight to all matching children")
        if (targetChildren && targetChildren.length > 0) {
            // Remove highlight from all matching children
            targetChildren.forEach((child) => {
                child.style.setProperty("border", "none");
            });
        } else {
            referenceElement.classList.remove("tour-highlight");
        }
    }
  }
    return(
        <>

        <CalcitePopover
            id='popover'
            ref={popoverRefs.current[currentStop]}
            //placement="leading"
            overlayPositioning="fixed"
            referenceElement={tourRoute[currentStop]?.id}
            open={openTour}
            label={exportOpen ? tourRoute[7]?.accessibleLabel : feedbackOpen ? tourRoute[8]?.accessibleLabel  : tourRoute[currentStop]?.accessibleLabel}
            heading={exportOpen ? tourRoute[7]?.heading : feedbackOpen ? tourRoute[8]?.heading  : tourRoute[currentStop]?.heading}
            // focusTrapOptions={{
            //    "allowOutsideClick": false,
            //    "returnFocusOnDeactivate": true,
            //    "extraContainers": [tourRoute[currentStop]?.div],
            //    "clickOutsideDeactivates": false
              
            // }}
            pointerDisabled={exportOpen || feedbackOpen ? true: false}
            triggerDisabled
            scale="s"
            // onCalcitePopoverOpen={() => {
            //     setInteractionIsolation(tourRoute[currentStop]?.id, popoverRefs.current[currentStop]);
            //   }}
            placement={exportOpen || feedbackOpen ?  "auto" : "leading"}
            offsetDistance={exportOpen || feedbackOpen ? -300 : 0}
          >
            <div className="tour-text" style={{ padding: 15, width: 300 }}>
              {exportOpen ? tourRoute[7]?.description : feedbackOpen ? tourRoute[8]?.description  : tourRoute[currentStop]?.description}
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
                        setCurrentStop(currentStop+1)
                        clearInteractionIsolation();

                        if(exportOpen){
                          setExportOpen(false)
                        }
              
                        if(feedbackOpen){
                          setFeedbackDialog(false)
                        }
                    }}
                    disabled={(!searchFeatures || searchFeatures.length === 0) && currentStop === 1}
                    >
                  {translateText("Next")}
                </CalciteButton>
              </div>
            </div>
          </CalcitePopover>

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

        {/* {openTour && tourSteps} */}


        </>
    )
}

export default GuidedTour