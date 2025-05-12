import "@esri/calcite-components/dist/components/calcite-popover";
import "@esri/calcite-components/dist/components/calcite-checkbox";

import { CalciteButton, CalciteCheckbox, CalciteDialog, CalciteDropdown, CalciteDropdownGroup, CalciteDropdownItem, CalciteLabel, CalcitePopover, CalciteTooltip } from "@esri/calcite-components-react"
import { useContext, useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom";
import UseAppContext from "../../contexts/AppContext"
import { config } from "../../data/config";

import * as intl from "@arcgis/core/intl.js";
import { titleCase } from "../Header/HeaderMenu";

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
        setFeedbackDialog,
        comparisonResultsClosed,
        comparableParcels,
        comparablePanelClosed,
        language,
        setLanguage,
        exportDataSource
     } = UseAppContext()

    const [routeParams , setSearchParams] = useSearchParams()

    const [openTour, setOpenTour] = useState(false);
    const [tourWelcome, setTourWelcome] = useState(false);
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

          //toggle off all panels
          //togglePanel('all')

          // if(searchFeatures){
          //   clearResults()
          //   clearResultsComparables()
          // }

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

        setTourWelcome(false)
        setOpenTour(false)
        setDialogEndOpen(false)

        // togglePanel("all")
        // clearResults()
        // clearResultsComparables()
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

        console.log("element to isolate: ", referenceElement, popover)
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
            //////console.log("Allowed:", el);
          }
        });
      };
      
      useEffect(() => {
        
        let stop = currentStop
        if(exportOpen){
          stop = 11
        }
        if(feedbackOpen){
          stop = 12
        }
        const refEl = document.getElementById(tourRoute[stop]?.id);
        const popoverEl = document.getElementById('popover');
        
        ////console.log("isolation setting up for tour stop: ", currentStop, refEl, popoverEl)

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
        <p>{translateText("Click the button now to open the language menu and choose your preferred language. Your selection will update the interface text throughout the application.")}</p>
        <p>{translateText("Click 'Next' to search for a parcel.")}</p>
        </div>,
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
            <p>{translateText("Click 'Next' to explore search results.")}</p>
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
            <p>{translateText("Or click 'Next' to see property details.")}</p>
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
            <p>{translateText("Click 'Next' to learn about finding comparable properties.")}</p>
        </div>,
        accessibleLabel: "some text"
       },
       4: {
        id: "comparable_properties-button",
        heading: "Compare Properties",
        description: <div>
          <p>{translateText("Use the Comparable Properties and Nearby Parcels tools to find properties with similar characteristics or nearby locations.")}</p>
          <ul>
            <li>{translateText("Click the 'Compare Properties' button to get started.")}</li>
            <li>{translateText("The Comparable Properties panel will open on the right side of the screen.")}</li>
            <li>{translateText("Click 'Next' to begin your comparable property search.")}</li>
          </ul>
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
            <p>{translateText("Use this tool to better understand how your property compares for assessment or appeals. Perform a search by scrolling down and clicking Search.")}</p>
            <p>{translateText("Then click 'Next' to explore and learn about search results.")}</p>
        </div>,
        accessibleLabel: "some text"
       },
       6: {
        id: "comparable-panel" ,
        heading: "Comparable Results",
        description: <div>
          <p>{translateText("This panel displays a list of comparable properties based on your selected property.")}</p>
          <p>{translateText("Just like the main search results, you can:")}</p>
          <ul>
            <li>{translateText("Clear your search to start over")}</li>
            <li>{translateText("Export the results to CSV or Excel")}</li>
            <li>{translateText("Submit feedback using the toolbar at the top")}</li>
            <li>{translateText("Click a property to view its detailed information")}</li>
          </ul>
          <p>{translateText("New in CookViewer 3.1: Easily switch between Comparable Search, Results, and Property Detail views using the tabs at the top of the panel.")}</p>
          <p>{translateText("Try selecting a property or using the toolbar to explore the available tools.")}</p>
          <p>{translateText("Then click 'Next' to learn about the comparable property details.")}</p>
        </div>,
        accessibleLabel: "some text",
        div: document.getElementById("comparable-panel" )
      },
      7: {
        id: "comparable-panel" ,
        heading: "Comparable Property",
        description: <div>
          <p>{translateText("This panel displays the comparable property details similar to the information in the property details panels in the left panel.")}</p>
          <p>{translateText("Just like the main property details panel, you can view:")}</p>
          <ul>
                <li>{translateText("Location and tax details")}</li>
                <li>{translateText("Assessed value")}</li>
                <li>{translateText("Building characteristics and imagery")}</li>
                <li>{translateText("Data and resources")}</li>
                <li>{translateText("Political and taxing district information")}</li>
            </ul>
            <p>{translateText("The top toolbar also lets you clear your comparable search, export your comparable property details, or submit feedback.")}</p>
            <p>{translateText('New in CookViewer 3.1: Use the built-in search bar to quickly find key information. Type in terms like "assessed value" or "district" to filter the panel and highlight relevant data.')}</p>
            <p>{translateText("Try using the search bar now to explore the available comparable property details.")}</p>
            <p>{translateText("Click 'Next' to learn about printing a map and report.")}</p>
        </div>,
        accessibleLabel: "some text",
        div: document.getElementById("comparable-panel" )
      },
      8: {
        id: "print-tabs" ,
        heading: "Print a map or report",
        description: <div>
          <p>{translateText("You can now print a map or a report using the Print panel.")}</p>
          <p>{translateText("To print your map, follow these steps:")}</p>
          <ul>
            <li>{translateText("Select the 'Map' tab in the Print panel.")}</li>
            <li>{translateText("Enter a file name for your printout.")}</li>
            <li>{translateText("Choose a layout type.")}</li>
            <li>{translateText("Toggle on the 'Show Print Area' switch to preview the area of the map that will be included. A rectangle will appear on the map showing the selected area.")}</li>
            <li>{translateText("Select a file type.")}</li>
            <li>{translateText("Click the 'Print' button to start your print job.")}</li>
          </ul>
          <p>{translateText("Once the print begins, the Prints tab will open to show the job status. When it’s finished, click the job name to view and download your file in a new window.")}</p>
          <p>{translateText("Click 'Next' to learn how to create a report.")}</p>
        </div>,
        accessibleLabel: "some text",
        div: document.getElementById("print-tabs" )
      },
      9: {
        id: "print-tabs" ,
        heading: "Print a report",
        description: <div>
        <p>{translateText("In CookViewer 3.1, you can now print a detailed report that includes your map and property information for your selected property, search results, and comparable properties.")}</p>
        <p>{translateText("Reports are exported in PDF format in standard letter (8.5\" x 11\") size.")}</p>
        <p>{translateText("To create a report, follow these steps:")}</p>
        <ul>
          <li>{translateText("Click the 'Report' tab in the Print panel.")}</li>
          <li>{translateText("Enter a file name for your report.")}</li>
          <li>{translateText("Choose a layout type for your map.")}</li>
          <li>{translateText("Toggle on the 'Show Print Area' switch to see which part of the map will be included. A rectangle will appear on the map to highlight this area.")}</li>
          <li>{translateText("Toggle on 'Include all search results' to add property details for all your search results.")}</li>
          <li>{translateText("Toggle on 'Include comparable properties' to include details from your comparable property search.")}</li>
          <li>{translateText("Click the 'Print' button to export your report.")}</li>
        </ul>
        <p>{translateText("Note: Reports with many properties may take longer to generate.")}</p>
      </div>,
        accessibleLabel: "some text",
        div: document.getElementById("print-tabs" )
      },
       10: {
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
            <p>{translateText("Try clicking a button in the Panel Selector to view a panel or click 'Next' to view to property details.")}</p>
        </div>,
        accessibleLabel: "some text"
       },
       11: {
        id: "export-dialog",
        heading: "Export search results",
        description: <div>
        <p>{translateText("You can export property details from your search results to a CSV or Excel file for further use or sharing.")}</p>
        <ul>
          <li>{translateText("Click the filename box and type in a name for your file.")}</li>
          <li>{translateText("Click the file type button to choose between CSV or Excel format.")}</li>
          <li>{translateText("Click Export to download your file. It will appear in your Downloads folder.")}</li>
        </ul>
        <p>{translateText("Try clicking a button in the Panel Selector to view a panel or click 'Next' to view to property details.")}</p>
       </div>,
        accessibleLabel: "some text",
        div: document.getElementById("export-dialog")
       },
       12: {
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
       },
    }


    useEffect(() => {
        //console.log("Current stop: ", currentStop)

        //if the current stop is 2 the search results stop BUT
        // there are no search results
        //go back to the stop 1 search
        if(currentStop === 2 && (!searchFeatures || searchFeatures.length === 0)){
          setCurrentStop(1)
        }

        //if user closes to search panel while on the stop 2
        //go to stop 7 with info on the panel selector
        if(searchResultsPanelClosed && currentStop === 2){
          //console.log("updating stop to: ", 7)
          setCurrentStop(7)
        }
        //if the property detail panel is open
        //go to stop 3 with property detail info
        // if(!propertyDetailPanelClosed){
        //   if(currentStop === 4) return;
        //   if(currentStop === 5) return;
        //   if(currentStop === 6) return;
        //   if(currentStop === 7) return;
        //   if(currentStop === 8) return;
        //   if(currentStop === 11) return;
        //   if(currentStop === 10) return;
        //   //console.log("updating stop to: ", 3)
        //   setCurrentStop(3)
        // }

        //if step current step is search results and property details is open
        // update step to step 3
        if(!propertyDetailPanelClosed &&  currentStop === 2){
          //console.log("updating stop to: ", 3)
          setCurrentStop(3)
        }


        //open the selector guide when the property details panel is closed
        if(propertyDetailPanelClosed && searchResultsPanelClosed && ( currentStop > 1 && currentStop < 5)){
          //console.log("updating stop to: ", 10)
          setCurrentStop(10)
        }



        if(currentStop === 5 && !comparisonResultsClosed){
          //console.log("updating stop to: ", 6)
          currentStop === 6
        }

        //open the selector guide when the property details panel is open
        if(currentStop === 10){
          if(!propertyDetailPanelClosed){
            //console.log("updating stop to: ", 3)
            setCurrentStop(3)
          }
          
        }
        //if the current stop is 10 to highlight the panel selector
        //and the search results panel is open  then set the stop to stop 2
        //to show details about the search results
        if(currentStop === 10 && !searchResultsPanelClosed){
          //console.log("updating stop to: ", 4)
            setCurrentStop(2)
        }

        //

    }, [currentStop, searchFeatures, propertyDetailPanelClosed, exportOpen, feedbackOpen, searchResultsPanelClosed, comparisonResultsClosed])


    const updateStyle = (id, index) => {
      //////console.log("updating style")
      //get reference element

      //////console.log("ref element id: ", id)
      // if(currentStop === 7 ) return;
      // if(currentStop === 8 ) return;

      const referenceElement = document.getElementById(id);
        
      if (!referenceElement) return null;

      // Find child or children by selector
      const query = index === 3 ? "calcite-input" : index === 7 ? "calcite-action" : null
      const targetChildrenElements = query ? referenceElement.querySelectorAll(query) : []

      const targetChildrenbyStyles = referenceElement.querySelectorAll(".stepper-item-header");

      const targetChildren = [...targetChildrenbyStyles, ...targetChildrenElements]

      if (currentStop === index && openTour) {
        if (targetChildren && targetChildren.length > 0) {
            // Apply highlight to all matching children
            //////console.log("Apply highlight to all matching children")
            targetChildren.forEach((child) => {
                //////console.log("child: ", child)
                child.style.setProperty("border", "2px solid #FFA500");

            });
        } else {
            referenceElement.classList.add("tour-highlight");
        }
      } 
      else {
        //////console.log("Removing highlight to all matching children")
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

    const updateLanguage = (lang) => {

      lang = lang?.toLowerCase()
      console.log("updating language: ", lang)
      setLanguage(lang)

      let locale_code = config.language_codes[lang]
      intl.setLocale(locale_code)

      const params = ["search", "pin10", "pin14"]
      const newParams = {}

      params.forEach((param) => {
        let value = routeParams.get(param);
        //short-circuit evaluation 
        value && (newParams[param] = value);
      });

      newParams['lang'] = lang
      setSearchParams(newParams)
    }
    
  
    return(
        <>
        <CalcitePopover
            id='popover'
            ref={popoverRefs.current[currentStop]}
            //placement="leading"
            overlayPositioning="fixed"
            referenceElement={ tourRoute[currentStop]?.id}
            open={openTour}
            label={exportOpen ? tourRoute[11]?.accessibleLabel : feedbackOpen ? tourRoute[12]?.accessibleLabel  : tourRoute[currentStop]?.accessibleLabel}
            heading={exportOpen ? tourRoute[11]?.heading : feedbackOpen ? tourRoute[12]?.heading  : tourRoute[currentStop]?.heading}
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
            offsetDistance={exportOpen || feedbackOpen ? -350 : 0}

          >
            <div className="tour-text" style={{ padding: 15, marginBottom: 30, width: 300, maxHeight: '500px', overflow:'auto', display:'flex', flexDirection: 'column' }}>
              {exportOpen ? tourRoute[11]?.description : feedbackOpen ? tourRoute[12]?.description  : tourRoute[currentStop]?.description}
              <div
                style={{
                  justifyContent: "end",
                  width: 300,
                  display: "flex",
                  gap: 10,
                  position:'absolute',
                  bottom:0,
                  //right:20,
                  backgroundColor: 'white',
                  borderTop: '#d4d4d4 solid 1px'
                }}
              >
                <div style={{padding: 5, gap: 10, display:'flex'}}>
                <CalciteButton appearance="outline" onClick={stopGuidedTour}>
                  {translateText("End Tour")}
                </CalciteButton>
                <CalciteButton 
                    iconEnd="arrow-right" 
                    onClick={() => {
                        setCurrentStop(currentStop+1)

                        //if current stop is search results
                        //and search results panel is not open
                        //open it
                        if(currentStop + 1 === 2){
                          togglePanel('search')
                        }
                        
                        //if the current stop is updated to 3 open the 
                        // property detail panel
                        if(currentStop+1 === 3 || currentStop+1 === 11){
                          //console.log("updating stop to: ", 3)
                          setCurrentStop(3)
                          togglePanel('property')
                        }
                        if(currentStop + 1 === 5){
                          togglePanel('compare')
                        }

                        if(currentStop + 1 === 6){
                          togglePanel('compare')
                        }

                        if(currentStop + 1 === 7){
                          togglePanel('compare')
                        }

                        if(currentStop + 1 === 8){
                          togglePanel('print')
                        }

                        if(currentStop + 1 === 10){
                          setOpenTour(false);
                          setDialogEndOpen(true)
                        }
                        clearInteractionIsolation();

                        if(exportOpen){
                          setExportOpen(false)
                        }
              
                        if(feedbackOpen){
                          setFeedbackDialog(false)
                        }
                    }}
                    disabled={((!searchFeatures || searchFeatures.length === 0) && currentStop === 1) || (!comparableParcels && !comparablePanelClosed && currentStop === 5)}
                    >
                  {translateText("Next")}
                </CalciteButton>
                </div>

              </div>
            </div>
          </CalcitePopover>
        
        <CalciteDialog
          id="welcome-dialog-language"
          heading="Welcome to CookViewer 3.1"
          //description="some text"
          open={tourDialogOpen}
          onCalciteDialogClose={() => {
            setTourDialogOpen(false)
          }}
        >
            <div style={{display:'flex', flexDirection:'column', }}>
                <p>{translateText("Take a tour of new features. Start by selecting a language:")}</p>
                
                <div style={{display: 'flex', gap: 10}}>
                {Object.entries(config.language_codes).map(([language, code]) => {
                return(
                  <CalciteButton
                    key={code}
                    onClick={() => {updateLanguage(language)}}
                  >{titleCase(language)}
                  </CalciteButton>
                )
              })}
                </div>
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
                onClick={() => { 
                  setTourWelcome(true)
                  setTourDialogOpen(false) 
                }}
                >{translateText("Start tour")} 
            </CalciteButton>
        </CalciteDialog>

        <CalciteDialog
        id="welcome-dialog"
        heading="CookViewer 3.1 New Features"
        //description="some text"
        open={tourWelcome}
        onCalciteDialogClose={() => {setTourWelcome(false)}}
        >
            <div>
                <p>{translateText("CookViewer has been updated with a redesigned layout and new features to improve usability. The interface now includes flexible panels that allow you to view and switch between search results and property details. These panels can be expanded, collapsed, or closed to give you more control over how much space is available for the map.")}</p>
                <p>{translateText("To help you get started, you can take a brief guided tour that introduces the new layout and tools.")}</p>
                <p>{translateText("Your feedback is appreciated and helps us continue to improve the application.")}</p>
                <p><b>{translateText("Click 'Next' to explore the new layout")}</b></p>
            </div>
            <CalciteButton 
                slot="footer-end"
                appearance="outline"
                label="stop-tour"
                onClick={() => {
                  setTourWelcome(false) 
                  stopGuidedTour()
                }}
                >{translateText("End tour")}
            </CalciteButton>

            <CalciteButton 
                slot="footer-end"
                label="start-tour"
                onClick={() => {
                  setTourWelcome(false)
                  handleStartTour()
                }
                  
                }
                >{translateText("Next")} 
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
                    <li>{translateText("Using the Print tools to export a map and/or a report")}</li>
                </ul>
                <p>{translateText("To learn more about how to use CookViewer’s features, click the Help icon in the top navigation bar. There, you’ll find step-by-step guidance and additional support resources.")}</p>
                <p>{translateText("To return to the tour select the 'Tour' button located at the bottom of the left toolbar.")}</p>
                <p>{translateText("Thank you for using CookViewer. Your feedback helps us continue to improve.")}</p>
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