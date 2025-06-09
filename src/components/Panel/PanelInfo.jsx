import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteBlock, 
    CalciteBlockSection, 
    CalciteLabel,
    CalciteLink,
    CalciteList,
    CalciteListItem,
    CalciteListItemGroup,
    CalciteNotice,
    CalcitePanel, 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext";

const PanelInfo = () => {

    const { infoPanelClosed, setInfoPanel, translateText } = UseAppContext()

    return (
        <CalcitePanel 
            id="info-panel" 
            closed={infoPanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText("Info")} 
            //overlayPositioning="fixed"
            onCalcitePanelClose={(e) => {
                setInfoPanel(true)
            }}
            style={{display: infoPanelClosed ? 'none': 'flex'}}
        >
            <CalciteBlock open collapsible={false}>
                {/* SEARCH RESULTS LABEL*/}
                <div>
                    {translateText("Welcome to CookViewer 3.0 - your ultimate source for Cook County property information! Access detailed property insights with ease, now with a modernized user experience, enhanced features, and expanded language support. Dive into the 'What's New' section to explore the latest updates. We value your feedback, which helps us continue improving to better serve you.")}
                </div>

                <CalciteBlockSection className='info-section-header' open text={translateText("To get started you can:")}>
                    <CalciteList interactionMode="static" selectionMode="none">
                        <CalciteListItem 
                        iconStart="select"
                        label={translateText("Select a location on the map")}
                        description={translateText("Click or tap on a specific property to view details")}
                        >
                        </CalciteListItem>
                        <CalciteListItem 
                        iconStart="search"
                        label={translateText("Search by PIN, address, or intersection")}
                        description={translateText("Type parcel identification number (PIN10 or PIN14), address, or intersection into the search box. Or enter a portion of a PIN to find all properties for an area-section-quadrant or block", true)}
                        >
                        </CalciteListItem>
                        <CalciteListItem 
                        iconStart="add-in-new"
                        label={translateText("Select Multiple Parcels")}
                        description={translateText("Use the 'Select Multiple Parcels' tool to choose multiple parcels by either clicking in the map or drawing a shape around them", true)}
                        >
                        </CalciteListItem>
                    </CalciteList>
                </CalciteBlockSection>
                </CalciteBlock>
                <CalciteBlock open heading={translateText("What's New")}>
                    <CalciteBlockSection className='info-section-header' open text={"CookViewer 3.1.0"}>
                    <CalciteLabel scale="s">
                    {translateText("Release: June 05 2025", true)}
                    </CalciteLabel>
                    <CalciteList interactionMode="static" selectionMode="none">
                        <CalciteListItemGroup heading={translateText("Enhancements")}>
                            <CalciteListItem 
                                label={translateText("Parcel Symbology")}
                                description={translateText("Increased contrast between parcel symbology and aerial imagery for better visibility.")}>
                            </CalciteListItem>
                            <CalciteListItem 
                                label={translateText("Mobile UI Improvements")}
                                description={translateText("Updated the mobile experience for enhanced usability across devices.")}>
                            </CalciteListItem>
                            <CalciteListItem 
                                label={translateText("UI Consistency")}
                                description={translateText("Standardized panel and modal close buttons for a unified user experience.")}>
                            </CalciteListItem>
                            <CalciteListItem 
                                label={translateText("Language Support")}
                                description={translateText("Added support for a locale URL parameter and Spanish intersection connectors in the locator.")}>
                            </CalciteListItem>     
                            <CalciteListItem 
                                label={translateText("Map Measure Tool")}
                                description={translateText("Updated the Measure component with improved UI and functionality.")}>
                            </CalciteListItem>     
                            <CalciteListItem 
                                label={translateText("PDF Property Reports")}
                                description={translateText("Added the ability to generate a printable PDF report for property information.")}>
                            </CalciteListItem>                                                                                                                                            
                        </CalciteListItemGroup>
                        <CalciteListItemGroup heading={translateText("Bug Fixes")}>
                            <CalciteListItem 
                                label={translateText("Parcel Labeling")}
                                description={translateText("Fixed issues with parcel label classifications.")}>
                            </CalciteListItem>
                            <CalciteListItem 
                                label={translateText("Print Widget")}
                                description={translateText("Resolved a bug where selecting an output from the print tool downloaded multiple PDFs instead of one.")}>
                            </CalciteListItem>
                            <CalciteListItem 
                                label={translateText("Select Multiple Parcels")}
                                description={translateText("Corrected behavior to ensure only one polygon can be drawn at a time when using Select Multiple Parcels tool.")}>
                            </CalciteListItem>
                            <CalciteListItem 
                                label={translateText("Comparable Pane Navigation")}
                                description={translateText("Fixed the issue where the comparable back button closed the entire pane.")}>
                            </CalciteListItem>
                            <CalciteListItem 
                                label={translateText("Print Area Selection")}
                                description={translateText("Added a rectangle to illustrate area of map that will be printed.")}>
                            </CalciteListItem>                            
                        </CalciteListItemGroup>
                        <CalciteListItem label={translateText("Release Notes")}>
                            <div slot="content">
                                {`${translateText("Read detailed ")} `}
                            <span>
                                <CalciteLink
                                target="_blank"
                                rel="noopener"
                                href="https://cookviewer3-info-cookcountyil.hub.arcgis.com/"
                                aria-label={translateText("Read more detailed release notes.")} 
                                >
                                    {translateText("release notes.") }
                                </CalciteLink>
                            </span>
                            </div>
                        
                        </CalciteListItem>
        
                        
                    </CalciteList>
                    </CalciteBlockSection>
                </CalciteBlock>
                <CalciteBlock
                open
                heading={translateText("Contact Us")}
                >
                    <CalciteBlockSection 
                    expanded 
                    text={translateText("For questions about issues with using CookViewer or other GIS inquiries")}
                    >
                        <CalciteNotice open>
                            <div slot="message">
                                <span>{translateText("Please email the Cook County GIS Department at ")}
                                    <a href="mailto:gis@cookcountyil.gov">gis@cookcountyil.gov</a>
                                </span><br/><br/>
                                <span>161 North Clark Street, Suite 500
                                <br /><span>Chicago, Illinois 60601</span>
                                </span>
                            </div>
                            
                        </CalciteNotice>
                    </CalciteBlockSection>
                    <CalciteBlockSection
                    expanded
                    text={translateText("For questions about Assessment Information")}
                    >
                        <CalciteNotice open>
                            <div slot="message">
                                <span>{translateText("Please contact the ")}
                                <a href="https://www.cookcountyassessor.com/contact" target="_blank">{translateText("Cook County Assessor's Office")}</a>
                            </span><br/><br/>
                            <span>118 North Clark Street, Room #320
                            <br /><span>Chicago, Illinois 60602</span>
                            <br /><span>(312) 443-7550</span>
                            </span>
                            </div>
                        </CalciteNotice>
                    </CalciteBlockSection>
                    <CalciteBlockSection
                    expanded
                    text={translateText("For questions about Parcel maps, Legal Descriptions & Taxing Districts")}
                    >
                        <CalciteNotice open>
                            <div slot="message">
                                <span>{translateText("Please email the Cook County Clerk’s Office at ")}
                                <a href="mailto:clerk.maps@cookcountyil.gov">clerk.maps@cookcountyil.gov</a>
                            </span><br/><br/>
                            <span>118 North Clark Street, Room #434
                            <br /><span>Chicago, Illinois 60602</span>
                            <br /><span>(312) 603-5640</span>
                            </span>
                            </div>
                        </CalciteNotice>
                    </CalciteBlockSection>
                                        <CalciteBlockSection
                    expanded
                    text={translateText("For Plat requests or for other recorded documents")}
                    >
                        <CalciteNotice open>
                            <div slot="message">
                                <span>{translateText("Please email the Cook County Clerk's Recordings Division at ")}
                                <a href="mailto:clerk.recordings@cookcountyil.gov">clerk.recordings@cookcountyil.gov</a>
                            </span><br/><br/>
                            <span>118 North Clark Street, Room #120
                            <br /><span>Chicago, Illinois 60602</span>
                            <br /><span>(312) 603-5050</span>
                            </span>
                            </div>
                        </CalciteNotice>
                    </CalciteBlockSection>

                </CalciteBlock>
        </CalcitePanel>
        
    )
}

export default PanelInfo;