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
            class='panel-start' 
            heading={translateText("Info")} 
            overlayPositioning="fixed"
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

                <CalciteBlockSection class='info-section-header' open text={translateText("To get started you can:")}>
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
                <CalciteBlockSection class='info-section-header' open text={"CookViewer 3.0.2"}>
                    <CalciteLabel scale="s">
                    {translateText("Release: February 27 2025", true)}
                    </CalciteLabel>
                    <CalciteList interactionMode="static" selectionMode="none">
                        <CalciteListItemGroup heading={translateText("Enhancements")}>
                            <CalciteListItem 
                            label={translateText("Unincorporated Zoning Layer")}
                            description={translateText("The Unincorporated Zoning layer is now viewable for more zoom levels.")}
                            >
                            </CalciteListItem>
                        </CalciteListItemGroup>
                        <CalciteListItemGroup heading={translateText("Bug Fixes")}>
                            <CalciteListItem 
                            label={translateText("Missing Translations")}
                            description={translateText("Spanish translations are now enabled for the search bar, including search sources and placeholder text.")}
                            >
                            </CalciteListItem>
                            <CalciteListItem 
                            label={translateText("URL Parameter Fix")}
                            description={translateText("Search results now correctly generate pin10 and/or pin14 values in the application URL, allowing users to save search settings and return to their results. Previously, multiple parcel searches could return address=0 when parcel address data was unavailable, preventing users from navigating back to their search results.")}
                            >
                            </CalciteListItem>
                            <CalciteListItem 
                            label={translateText("Select Multiple Parcels")}
                            description={translateText("Draw polygon tool “start new” button now triggers a restart.")}
                            >
                            </CalciteListItem>
                            <CalciteListItem 
                            label={translateText("Comparable Search")}
                            description={translateText("Search radius option will now filter results based on distance set by the user. Prior to this fix, the search distance set by the user was not impacting the number of results.")}
                            >
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
        </CalcitePanel>
        
    )
}

export default PanelInfo;