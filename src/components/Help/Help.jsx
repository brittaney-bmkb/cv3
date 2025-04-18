import "@esri/calcite-components/dist/components/calcite-autocomplete"
import "@esri/calcite-components/dist/components/calcite-autocomplete-item"

import { CalciteAccordion, CalciteAccordionItem, CalciteAutocomplete, CalciteAutocompleteItem, CalciteBlock, CalcitePanel, CalciteTab, CalciteTabNav, CalciteTabs, CalciteTabTitle } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"

const Help = () => {

    const {helpPanelClosed, setHelpPanel, translateText} = UseAppContext()

    const [filterText, setFilterText] = useState("");
    const [value, setValue] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

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
          id: "map",
          heading: "Selecting properties in the map",
          icon: "map",
          content: (
            <div>
              <p>
                {translateText(
                  "You can click directly on the map to select a parcel."
                )}
              </p>
          
              <p>
                {translateText(
                  "If you click on a single parcel, the Property Details panel will automatically open and display information for that property."
                )}
              </p>
          
              <p>
                {translateText(
                  "If more than one parcel is selected—such as in a high-rise or condo building where parcels are stacked—the Search Results panel will appear and list all selected parcels so you can choose which one to view in detail."
                )}
              </p>
          
              <p>
                {translateText(
                  "For more control, use the Select Tool located in the map tools panel on the left side of the screen."
                )}
              </p>
          
              <p>{translateText("With the Select Tool, you can:")}</p>
              <ul>
                <li>{translateText("Click to select one or more parcels manually")}</li>
                <li>{translateText("Click again on a selected parcel to unselect it")}</li>
                <li>{translateText("Draw a rectangle or polygon over an area to select multiple parcels at once")}</li>
              </ul>
          
              <p>
                {translateText(
                  "This is especially useful when reviewing properties across a block or neighborhood."
                )}
              </p>
            </div>
          ),
          link: "/help#search"
        },
        {
          id: "search-results",
          heading: "View Search Results",
          icon: "list",
          content: (
            <div>
              <p>
                {translateText(
                  "When you search for a property, matching results appear in the Search Results panel as a list."
                )}
              </p>
          
              <p>
                {translateText(
                  "Each result displays basic property information such as the 14 digit PIN and address."
                )}
              </p>
          
              <p>{translateText("At the top of the Search Results panel, you’ll find these tools:")}</p>
              <ul>
                <li>
                  {translateText(
                    "Clear Search removes all results and allows you to start a new search."
                  )}
                </li>
                <li>
                  {translateText(
                    "Export lets you download the list of results as a CSV or Excel file."
                  )}
                </li>
                <li>
                  {translateText(
                    "Submit Feedback allows you to report an issue or leave a comment about the results."
                  )}
                </li>
              </ul>
          
              <p>
                {translateText(
                  "Clicking on any result in the list will open the Property Details panel with more information about that property, and the map will automatically zoom to that location."
                )}
              </p>
            </div>
          ),
          link: "/help#search-results"
        },
        {
          id: "property-details",
          heading: "Viewing Property Details",
          icon: "pin",
          content: (
            <div>
            <p>
              {translateText(
                "After running a search or selecting a property directly from the map, you can click on a result to open the Property Detail panel with property information."
              )}
            </p>
            <p>
              {translateText(
                "At the top of the Property Results panel, you'll find several tools to help you manage the search results and provide input on what you see:"
              )}
            </p>
            <ul>
              <li>
                {translateText(
                  "Clear Search removes all current results and resets the map so you can start a new search from scratch."
                )}
              </li>
              <li>
                {translateText(
                  "Export lets you download your property information displayed in the panel as a CSV or Excel file."
                )}
              </li>
              <li>
                {translateText(
                  "Submit Feedback allows you to report issues or leave comments about the data displayed for a property."
                )}
              </li>
              <li>{translateText("Search bar that allows you to quickly filter the property information shown. You can enter a keyword like 'value' or 'district' to instantly display relevant details. Clearing the search box will return all available property information.")}</li>

            </ul>

        
            <p>{translateText("The panel includes several sections with more detailed property data:")}</p>
        
            <p>
              <strong>{translateText("Location")}</strong>
            </p>
            <ul>
              <li>{translateText("Township, Municipality, and Zoning Information")}</li>
            </ul>
        
            <p>
              <strong>{translateText("Property Comparison")}</strong>
            </p>
            <ul>
              <li>
                {translateText(
                  "Tools to find and view similar properties based on class, neighborhood, square footage, and age"
                )}
              </li>
            </ul>
        
            <p>
              <strong>{translateText("Tax Details")}</strong>
            </p>
            <ul>
              <li>{translateText("Property Classification and Land Square Footage")}</li>
              <li>
                {translateText(
                  "Assessor Neighborhood and a link to the Assessor Website for more property details"
                )}
              </li>
            </ul>
        
            <p>
              <strong>{translateText("Assessed Value")}</strong>
            </p>
            <ul>
              <li>{translateText("Current Value, Land Value, Building Value, and Total Assessed Value")}</li>
              <li>
                {translateText(
                  "A link to Cook County Open Data for historical assessed values"
                )}
              </li>
            </ul>
        
            <p>
              <strong>{translateText("Building Characteristics")}</strong>
            </p>
            <ul>
              <li>{translateText("Estimated Square Footage, Construction Type, and Age of the building")}</li>
            </ul>
        
            <p>
              <strong>{translateText("Imagery")}</strong>
            </p>
            <ul>
              <li>{translateText("A link to the Oblique Imagery Viewer for angled aerial views")}</li>
              <li>{translateText("A link to a Historical Photo showing past ground-level property images")}</li>
            </ul>
        
            <p>
              <strong>{translateText("Data and Resources")}</strong>
            </p>
            <ul>
              <li>{translateText("Clerk Property Records Search")}</li>
              <li>{translateText("Cook County Property Tax Portal")}</li>
              <li>{translateText("Historical Improvement Characteristics for Single and Multi-Family properties")}</li>
              <li>{translateText("Historical Residential Condominium Unit Characteristics")}</li>
            </ul>
            <p>
              <strong>{translateText("District Info")}</strong>
            </p>
            <ul>
              <li>{translateText("A link to Find My District, which opens a map showing the property's political districts")}</li>
              <li>{translateText("Commissioner and Board of Review districts")}</li>
              <li>{translateText("School, library, park, and other tax districts")}</li>
            </ul>
          </div>
          ),
          link: "/help#property-details"
        },
        {
          id: "compare",
          heading: "Search for Comparable Properties",
          icon: "compare",
          content: (
            <div>
              <p>
                {translateText(
                  "To begin, click the Compare Properties button in the Property Details panel or use the Compare tool from the map toolbar on the left side of the screen."
                )}
              </p>

              <p>
                {translateText(
                  "A form will open with some information automatically filled in based on the property you selected. The following fields are read-only and cannot be changed:"
                )}
              </p>
              <ul>
                <li>{translateText("Source PIN")}</li>
                <li>{translateText("Township")}</li>
                <li>{translateText("Neighborhood")}</li>
                <li>{translateText("Property Class")}</li>
              </ul>

              <p>
                {translateText(
                  "You can adjust fields in the following sections to customize your search:"
                )}
              </p>
              <ul>
                <li>{translateText("Property Size")}</li>
                <li>{translateText("Property Characteristics")}</li>
                <li>{translateText("Search Radius")}</li>
              </ul>

              <p>
                {translateText(
                  "If no results are returned, try increasing the search radius or adjusting the property characteristics to broaden your search."
                )}
              </p>

            </div>
          ),
          link: "/help#compare"
        },
        {
          id: "history",
          heading: "Comparing Historical Parcels",
          icon: "parcel",
          content: (
            <div>
              <p>
                {translateText(
                  "You can view how parcel boundaries have changed over time by turning on historical parcel archive layers using the Layers tool located in the toolbar to the left of the map."
                )}
              </p>
          
              <p>
                {translateText(
                  "The Parcel Archive includes yearly layers from 2000 to the current year. Each layer displays the boundaries and labels for parcels as they existed during that specific year."
                )}
              </p>
          
              <p>{translateText("To use this feature:")}</p>
              <ul>
                <li>{translateText("Open the Layers panel from the toolbar")}</li>
                <li>{translateText("Scroll to the Parcel Archive section")}</li>
                <li>{translateText("Check the boxes for the years you want to compare")}</li>
              </ul>
          
              <p>
                {translateText(
                  "Each archive layer uses a different boundary and label color so you can easily see how parcels have changed from one year to another."
                )}
              </p>
          
              <p>
                {translateText(
                  "This is especially helpful when researching subdivisions, consolidations, or boundary adjustments over time."
                )}
              </p>
            </div>
          )
          ,
          link: "/help#historical-parcels"
        },
        {
          id: "imagery",
          heading: "Viewing Parcels with Aerial Imagery",
          icon: "basemap",
          content: (
            <div>
              <p>
                {translateText(
                  "You can view aerial imagery to better understand property boundaries, building footprints, and land use changes over time."
                )}
              </p>
          
              <p>
                {translateText(
                  "To get started, click the Imagery tool and select a year from the available aerial imagery layers. You can choose from multiple years, with historical imagery available as far back as 1998."
                )}
              </p>
          
              <p>
                {translateText(
                  "This is especially helpful when comparing recent changes to older structures, or reviewing development patterns over time—similar to comparing historical parcel boundaries."
                )}
              </p>
          
              <p>{translateText("For more detailed analysis, you can:")}</p>
              <ul>
                <li>
                  {translateText(
                    "Use the Measure Tool to estimate distances or square footage of features visible in the imagery, such as buildings or driveways"
                  )}
                </li>
                <li>
                  {translateText(
                    "Zoom in to verify rooflines, additions, or other visible property features"
                  )}
                </li>
              </ul>
          
              <p>
                {translateText(
                  "Imagery layers are often used in combination with parcel and zoning layers for a fuller view of property characteristics."
                )}
              </p>
            </div>
          )
          ,
          link: "/help#layers"
        },
        {
          id: "layers",
          heading: "Layers",
          icon: "layers",
          content: (
            <div>
              <p>
                {translateText(
                  "The Layers tool allows you to control which map layers are visible. You can turn layers on or off to focus on the information most relevant to your needs."
                )}
              </p>
          
              <p>{translateText("Available layers include:")}</p>
              <ul>
                <li>{translateText("Parcel Archive layers (2000 to current year)")}</li>
                <li>{translateText("Contours and Forest Preserve Districts")}</li>
                <li>{translateText("Places of Interest, such as County Facilities")}</li>
                <li>{translateText("Political Boundaries (e.g., Commissioner Districts, Townships)")}</li>
                <li>{translateText("Tax Districts (e.g., School, Park, Library)")}</li>
                <li>{translateText("Highway Systems and Roadways")}</li>
                <li>{translateText("Unincorporated Zoning")}</li>
              </ul>
          
              <p>
                {translateText(
                  "A new feature allows you to turn off the current parcel layer. This can improve visibility when viewing aerial imagery or other overlapping layers."
                )}
              </p>
          
              <p>{translateText("How to use the Layers tool:")}</p>
              <ul>
                <li>{translateText("Click the checkbox next to a layer group to turn all layers in that group on or off")}</li>
                <li>{translateText("Click the arrow to expand a group and manage individual layers within it")}</li>
                <li>{translateText("You can turn multiple layers on at once to compare different types of information")}</li>
              </ul>
          
              <p>
                {translateText(
                  "Some layers are only visible at certain zoom levels. If a layer doesn’t appear, try zooming in closer to your area of interest."
                )}
              </p>
            </div>
          ),
          link: "/help#layers"
        },
        {
          id: "print",
          heading: "Print",
          icon: "print",
          content:(<div></div>),
          link: "/help#print"
        }
      ];
     
    
      const buildFilteredHelpSuggestions = (helpSections, input) => {
        const normalizedInput = input.trim().toLowerCase();
      
        if (!normalizedInput) return [];
      
        const suggestions = [];
      
        helpSections.forEach((section) => {
          const sectionName = section.heading;
      
          const collectTextFromContent = (content) => {
            if (typeof content === "string") return content;
            if (Array.isArray(content)) return content.map(collectTextFromContent).join(" ");
            if (content?.props?.children) return collectTextFromContent(content.props.children);
            return "";
          };
      
          const fullText = collectTextFromContent(section.content).toLowerCase();
      
          const matchIndex = fullText.indexOf(normalizedInput);
          if (matchIndex !== -1) {
            const start = Math.max(0, matchIndex - 30);
            const end = Math.min(fullText.length, matchIndex + normalizedInput.length + 30);
            const snippet = fullText.slice(start, end).replace(/\s+/g, " ");
      
            suggestions.push({
              id: section.id,
              label: sectionName,
              snippet: `...${snippet.trim()}...`,
            });
          }
        });
      
        return suggestions;
      };
      
      useEffect(() => {
        const items = buildFilteredHelpSuggestions(helpSections, filterText);
        setFilteredSuggestions(items);
      }, [filterText]);
  
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
        style={{display: helpPanelClosed ? 'none': 'flex', maxWidth: '20%'}}
        >

        <CalciteAutocomplete
          placeholder="Filter help..."
          value={value}
          //inputValue={value}
          onCalciteAutocompleteTextInput={(e) => {
            
            //setValue(e)
            //console.log("Input change: ", e)
            setFilterText(e.target.inputValue.toLowerCase())
          }}
          onCalciteAutocompleteTextChange={(e) => {
              //console.log("text change: ", e)
              setValue(e.target.value.toLowerCase())
              //setFilterText(e.target.value.toLowerCase())
            }
          }
          onCalciteAutocompleteChange={(e) => {
            //console.log("auto compelet change: ", e)
            setFilterText(e.target.value.toLowerCase())
            setValue(e.target.value)
          }}
        >
          {filteredSuggestions.map((item) => (
            <CalciteAutocompleteItem
              key={item.id}
              value={item.label}
              heading={item.label}
              description={item.snippet}
            ></CalciteAutocompleteItem>
          ))}
        </CalciteAutocomplete>

       
       {helpSections
          .filter(
            (section) =>
              section.heading.toLowerCase().includes(filterText) ||
              section.content.props.children
                ?.map((child) =>
                  typeof child === "string"
                    ? child.toLowerCase().includes(filterText)
                    : child.props?.children?.toString().toLowerCase().includes(filterText)
                )
                .some(Boolean)
            
              
          )
          .map((section) => (
            <CalciteBlock
              collapsible
              key={section.id}
              heading={section.heading}
              iconStart={section.icon}
            >
              {section.content}
              <p>
                <a href={section.link} target="_blank" rel="noopener noreferrer">
                  View full {section.heading} Help
                </a>
              </p>
            </CalciteBlock>
          ))}




            
        </CalcitePanel>
    )
}

export default Help