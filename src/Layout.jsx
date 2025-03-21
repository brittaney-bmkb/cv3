

import { 
    CalciteAction, 
    CalciteActionBar, 
    CalciteActionGroup, 
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
import ComparisonPropertyDetail from "./components/PropertyComparison/ComparisonPropertyDetail";
import Layers from "./components/Layers/Layers";
import Imagery from "./components/Imagery/Imagery";
import Print from "./components/Print/Print";
import Select from "./components/Select/Select";
import Map from "./components/Map/Map";
import ActionBarStart from "./components/ActionBar/ActionBarStart";
import ActionBarEnd from "./components/ActionBar/ActionBarEnd";
import Export from "./components/Export/Export";


import "@esri/calcite-components/dist/components/calcite-input-text"
import "@esri/calcite-components/dist/components/calcite-input-number"
import "@esri/calcite-components/dist/components/calcite-dropdown"
import "@esri/calcite-components/dist/components/calcite-dropdown-group"
import "@esri/calcite-components/dist/components/calcite-dropdown-item"
import { Feedback } from "./components/Feedback/Feedback";
import ActionBarMap from "./components/ActionBar/ActionBarMap";


const Layout = () => {

    // State of panels
    const {  
        propertyDetailPanelClosed, 
        infoPanelClosed, 
        searchResultsPanelClosed,
        nearbyPanelClosed,
        setComparablePanel, 
        comparablePanelClosed,
        setNearbyPanel,
        comparableParcels,
        setComparisonResultsPanel,
        comparisonResultsClosed,
        comparisonDetailPanelClosed,
        setComparisonDetailPanel,
        translateText,
        togglePanel,
        layersPanelClosed,
        printPanelClosed,
        imageryPanelClosed,
        selectPanelClosed,
        exportOpen,
        isMobile,
    } = UseAppContext()


    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false) 
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false) 

    useEffect(() => {

        const allPanelsClosed =  [ propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed].every(panel => panel === true); 
        setLeftPanelCollapsed(allPanelsClosed)

    }, [propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed])

    useEffect(() => {

        const allPanelsClosed =   [selectPanelClosed, printPanelClosed, imageryPanelClosed, layersPanelClosed, comparisonDetailPanelClosed, nearbyPanelClosed, comparablePanelClosed, comparisonResultsClosed].every(panel => panel === true); 
        setRightPanelCollapsed(allPanelsClosed)

    }, [selectPanelClosed, printPanelClosed, imageryPanelClosed, layersPanelClosed, nearbyPanelClosed, comparablePanelClosed, comparisonResultsClosed, comparisonDetailPanelClosed])

    return(
        <CalciteShell>
            {/* HEADER */}
            <Header/>
            {/* <CalcitePanel  className='header'> */}
                {/* HEADER */}
                {/* <Header/> */}
                <CalciteShell
                contentBehind ={isMobile}
                >
                    {/* LEFT PANEL */}
                    <CalciteShellPanel  
                    width="l" 
                    slot={isMobile ? "panel-bottom" : "panel-start" }
                    displayMode={isMobile ? "float-all" : "dock"}
                    layout={isMobile ? "horizontal" :"vertical"}
                    height="l"
                    position="start" 
                    id="shell-panel-start" 
                    className='left-panel' 
                    collapsed={leftPanelCollapsed}
                    style={{paddingBottom: isMobile ? 50 : 0}}
                    >   
                        {/* ACTION BAR */}
                        <ActionBarStart/>
                        {/* PRIMARY PANEL */}
                        <PanelInfo/>
                        <PanelSearchResults/>
                        <PanelPropertyDetail/>

                    </CalciteShellPanel>
                    
                    {/* WEBMAP */}
                    <Map/>
                    {/* <WebMapComponentBeta/> */}

                    {/* MAP TOOLS */}
                    <CalciteShellPanel 
                    width="l" 
                    className="right-panel"
                    slot={isMobile ? "panel-bottom" : "panel-end" }
                    displayMode={isMobile ? "overlay" : "dock"}
                    layout={isMobile ? "horizontal" :"vertical"}
                    height={isMobile ? "l" : 'm'}
                     position="end"
                     id="shell-panel-end" 
                     collapsed={rightPanelCollapsed}>
                        {/* ACTION BAR */}
                        {isMobile ? null : <ActionBarEnd/>}
                        {/* SECONDARY PANEL */}
                        <PropertyComparison/>
                        <NearbyPanel/>
                        <ComparisonResults/>
                        <ComparisonPropertyDetail/>
                        <Layers/>
                        <Imagery/>
                        <Print/>
                        <Select/>

                    </CalciteShellPanel>

                    <Export/>
                    <Feedback/>

                </CalciteShell>
                                
            {/* </CalcitePanel> */}

        

    </CalciteShell>
    )
    


}

export default Layout