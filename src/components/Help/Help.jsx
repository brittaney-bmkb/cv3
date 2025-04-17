import "@esri/calcite-components/dist/components/calcite-accordion"
import "@esri/calcite-components/dist/components/calcite-accordion-item"

import { CalciteAccordion, CalciteAccordionItem, CalcitePanel, CalciteTab, CalciteTabNav, CalciteTabs, CalciteTabTitle } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

const Help = () => {

    const {helpPanelClosed, setHelpPanel, translateText} = UseAppContext()

    const helpSections = [
        {
          id: "search",
          heading: "Search for Properties",
          icon: "search",
          content: (
            <div>
              <p>{translateText("There are several ways to search for a location in CookViewer using the search bar at the top of the screen. You can enter a:")}</p>
              <ul>
                <li>{translateText("10-digit Property Index Number (PIN): 1709461015")}</li>
                <li>{translateText("14-digit PIN: 17094610150000")}</li>
                <li>{translateText("PIN with dashes: 17-09-461-015-0000")}</li>
                <li>{translateText("Property address: 69 W Washington, Chicago")}</li>
                <li>{translateText("Street intersection: W Washington St & N Dearborn")}</li>
              </ul>
              <p>{translateText("Once you enter your search, matching properties will appear in the Property Results panel. Click on a result to view its details — the map will automatically zoom to that location.")}</p>
            </div>
          ),
          link: "/help#search"
        },
        {
          id: "search-results",
          heading: "Search Results",
          icon: "list",
          content: (
            <div>
              <p>{translateText("After performing a search, results are listed in a panel. Each row includes high-level property details.")}</p>
              <p>{translateText("You can sort, export results to CSV/Excel, or select a property to view its full details in a new panel.")}</p>
            </div>
          ),
          link: "/help#search-results"
        },
        {
          id: "property-details",
          heading: "Property Details",
          icon: "information",
          content: (
            <div>
              <p>{translateText("Selecting a property displays detailed information such as tax assessments, building characteristics, neighborhood codes, and linked data sources.")}</p>
              <p>{translateText("You can search within the panel to quickly locate fields like 'Assessed Value.'")}</p>
            </div>
          ),
          link: "/help#property-details"
        },
        {
          id: "compare",
          heading: "Search for Comparable Properties",
          icon: "comparison",
          content: (
            <div>
              <p>{translateText("Use the 'Compare this Property' option to view similar properties based on class, neighborhood, square footage, and construction year.")}</p>
              <p>{translateText("Comparable properties are shown on the map and can be explored in a dedicated panel.")}</p>
            </div>
          ),
          link: "/help#compare"
        },
        {
          id: "tools",
          heading: "Map Tools",
          icon: "map",
          content: (
            <div>
              <p>{translateText("Access tools for measuring distance and area, selecting parcels, and printing the current map view.")}</p>
              <p>{translateText("Tools are located along the top or sides of the map depending on screen size.")}</p>
            </div>
          ),
          link: "/help#map-tools"
        },
        {
          id: "layers",
          heading: "Layers",
          icon: "layers",
          content: (
            <div>
              <p>{translateText("Use the Layer List to toggle map layers on or off.")}</p>
              <p>{translateText("Certain layers are only visible at specific zoom levels. The layer list also provides legends and metadata for each layer.")}</p>
            </div>
          ),
          link: "/help#layers"
        }
      ];
      
      
    const helpTabs = helpSections.map((section) => (
        <CalciteTab tab={section.id} key={section.id}>
          <h3>{section.contentTitle}</h3>
          <p>{section.description}</p>
        </CalciteTab>
      ))

    const helpTitles = helpSections.map((section) => (
    <CalciteTabTitle tab={section.id} key={section.id}>
        {section.tabTitle}
    </CalciteTabTitle>
    ))
      

    return(
        <CalcitePanel
        
        id="help-panel" 
        closed={helpPanelClosed} 
        closable 
        scale="m"
        slot="panel-start"
        heading={translateText("Help")} 
        //overlayPositioning="fixed"
        onCalcitePanelClose={(e) => {
            setHelpPanel(true)
        }}
        style={{display: helpPanelClosed ? 'none': 'flex', maxWidth: '25%'}}
        >
       
            <CalciteAccordion scale="m" selectionMode="multiple">
                {helpSections.map((section) => (
                    <CalciteAccordionItem
                    key={section.id}
                    heading={section.heading}
                    icon={section.icon}
                    >
                    <p>{section.content}</p>
                    <p>
                        <a href={section.link} target="_blank" rel="noopener noreferrer">
                        View full {section.heading} Help
                        </a>
                    </p>
                    </CalciteAccordionItem>
                ))}
        </CalciteAccordion>


            
        </CalcitePanel>
    )
}

export default Help