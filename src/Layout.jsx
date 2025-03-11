

import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteActionGroup, 
    CalcitePanel, 
    CalciteShell, 
    CalciteShellPanel 
} from "@esri/calcite-components-react"
import WebMapComponentBeta from "./components/WebMapView/WebMapComponentBeta"
import SearchBarComponent from "./components/SearchBar/SearchBarComponent";
import PanelSearchResults from "./components/Panel/PanelSearchResults";
import UseAppContext from "./contexts/AppContext";
import { config } from "./data/config";
import Header from "./components/Header/Header";
import PanelInfo from "./components/Panel/PanelInfo";
import { useCallback, useEffect, useState } from "react";
import PanelPropertyDetail from "./components/Panel/PanelPropertyDetail";
import PropertyComparison from "./components/PropertyComparison/PropertyComparison";


const Layout = () => {

    // State of panels
    const { 
        setInfoPanel, 
        setSearchResultsPanel, 
        setPropertyDetailPanel, 
        propertyDetailPanelClosed, 
        infoPanelClosed, 
        searchResultsPanelClosed,
        comparablePanelClosed 
    } = UseAppContext()


    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false) 

    useEffect(() => {

        const allPanelsClosed =  [propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed].every(panel => panel === true); 
        setLeftPanelCollapsed(allPanelsClosed)

        console.log("left panel closed: ", propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed)

    }, [propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed])

    return(
        <CalciteShell>
            <CalcitePanel  class='header'>
                {/* HEADER */}
                <Header/>
                <CalciteShell>
                    {/* LEFT PANEL */}
                    <CalciteShellPanel  width="l" slot="panel-start" position="start" id="shell-panel-start" class='left-panel' collapsed={leftPanelCollapsed}>
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar">
                            <CalciteActionGroup>
                                <CalciteAction text="Info" icon="information" textEnabled active={!infoPanelClosed}
                                onClick={() => {
                                    setInfoPanel(false)
                                    setSearchResultsPanel(true)
                                    setPropertyDetailPanel(true)
                                    }}></CalciteAction>
                                <CalciteAction text="Results" icon="list-rectangle" textEnabled active={!searchResultsPanelClosed}
                                onClick={() => {
                                    setSearchResultsPanel(false)
                                    setInfoPanel(true)
                                    setPropertyDetailPanel(true)
                                    }}></CalciteAction>
                                <CalciteAction text="Property" icon="pin" textEnabled active={!propertyDetailPanelClosed}
                                onClick={() => {
                                    setSearchResultsPanel(true)
                                    setInfoPanel(true)
                                    setPropertyDetailPanel(false)
                                }}></CalciteAction>
                            </CalciteActionGroup>
                        </CalciteActionBar>
                        {/* PRIMARY PANEL */}
                        <PanelInfo/>
                        <PanelSearchResults/>
                        <PanelPropertyDetail/>

                    </CalciteShellPanel>
                    
                    {/* WEBMAP */}
                    <WebMapComponentBeta/>

                    {/* MAP TOOLS */}
                    <CalciteShellPanel slot="panel-end" position="end" id="shell-panel-end" collapsed={comparablePanelClosed}>
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar">
                            <CalciteActionGroup>
                                <CalciteAction text="Add" icon="plus"></CalciteAction>
                            </CalciteActionGroup>
                        </CalciteActionBar>

                        {/* SECONDARY PANEL */}
                        <PropertyComparison/>

                    </CalciteShellPanel>
                </CalciteShell>
                                
            </CalcitePanel>

        

    </CalciteShell>
    )
    


}

export default Layout