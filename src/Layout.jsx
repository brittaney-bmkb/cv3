

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
import NearbyPanel from "./components/PropertyComparison/NearbyPanel";
import ComparisonResults from "./components/PropertyComparison/ComparisonResults";


const Layout = () => {

    // State of panels
    const { 
        setInfoPanel, 
        setSearchResultsPanel, 
        setPropertyDetailPanel, 
        propertyDetailPanelClosed, 
        infoPanelClosed, 
        searchResultsPanelClosed,
        nearbyPanelClosed,
        setComparablePanel, 
        comparablePanelClosed,
        setNearbyPanel,
        comparableParcels,
        setComparisonResultsPanel,
        comparisonResultsClosed
    } = UseAppContext()


    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false) 
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false) 

    useEffect(() => {

        const allPanelsClosed =  [propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed].every(panel => panel === true); 
        setLeftPanelCollapsed(allPanelsClosed)

        console.log("left panel closed: ", propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed)

    }, [propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed])

    useEffect(() => {

        const allPanelsClosed =  [nearbyPanelClosed, comparablePanelClosed, comparisonResultsClosed].every(panel => panel === true); 
        setRightPanelCollapsed(allPanelsClosed)

    }, [nearbyPanelClosed, comparablePanelClosed, comparisonResultsClosed])

    return(
        <CalciteShell>
            <CalcitePanel  className='header'>
                {/* HEADER */}
                <Header/>
                <CalciteShell>
                    {/* LEFT PANEL */}
                    <CalciteShellPanel  width="l" slot="panel-start" position="start" id="shell-panel-start" className='left-panel' collapsed={leftPanelCollapsed}>
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar" expanded>
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
                    <CalciteShellPanel width="l" className="right-panel" slot="panel-end" position="end" id="shell-panel-end" collapsed={rightPanelCollapsed}>
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar" expanded>
                            <CalciteActionGroup>
                                <CalciteAction 
                                    active={!comparablePanelClosed}
                                    text="Compare" 
                                    icon="compare" 
                                    textEnabled 
                                    onClick={() => {
                                        setComparablePanel(false)
                                        setNearbyPanel(true)
                                        setComparisonResultsPanel(true)
                                    }}>

                                </CalciteAction>
                                <CalciteAction 
                                    active={!nearbyPanelClosed}
                                    text="Nearby" 
                                    icon="rings-largest" 
                                    textEnabled 
                                    onClick={() => {
                                        setNearbyPanel(false)
                                        setComparablePanel(true)
                                        setComparisonResultsPanel(true)
                                    }}>

                                </CalciteAction>
                                {
                                    //IF THERE ARE COMPARABLE PARCELS DISPLAY COMPARABLE RESULTS
                                    comparableParcels ? 
                                    <CalciteAction 
                                        text="Results" 
                                        icon="list-rectangle"
                                        textEnabled 
                                        onClick={() => {
                                            setComparisonResultsPanel(false)
                                            setNearbyPanel(true)
                                            setComparablePanel(true)
                                        }}>

                                    </CalciteAction> : null
                                }

{
                                    //IF THERE ARE COMPARABLE PARCELS DISPLAY COMPARABLE RESULTS
                                    comparableParcels ? 
                                    <CalciteAction 
                                        text="Property" 
                                        icon="pin"
                                        textEnabled 
                                        onClick={() => {
                                            setNearbyPanel(true)
                                            setComparablePanel(true)
                                            setComparisonResultsPanel(true)
                                        }}>

                                    </CalciteAction> : null
                                }
                            </CalciteActionGroup>
                        </CalciteActionBar>

                        {/* SECONDARY PANEL */}
                        <PropertyComparison/>
                        <NearbyPanel/>
                        <ComparisonResults/>

                    </CalciteShellPanel>
                </CalciteShell>
                                
            </CalcitePanel>

        

    </CalciteShell>
    )
    


}

export default Layout