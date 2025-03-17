

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
                <CalciteShell>
                    {/* LEFT PANEL */}
                    <CalciteShellPanel  width="l" slot="panel-start" position="start" id="shell-panel-start" className='left-panel' collapsed={leftPanelCollapsed}>
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar" expanded>
                            <CalciteActionGroup>
                                <CalciteAction text={translateText("Info")} icon="information" textEnabled active={!infoPanelClosed}
                                onClick={() => {
                                    togglePanel('info')
                                    }}></CalciteAction>
                                <CalciteAction text={translateText("Results")} icon="list-rectangle" textEnabled active={!searchResultsPanelClosed}
                                onClick={() => {
                                    togglePanel('search')
                                    }}></CalciteAction>
                                <CalciteAction text={translateText("Property")} icon="pin" textEnabled active={!propertyDetailPanelClosed}
                                onClick={() => {
                                    togglePanel('property')
                                }}></CalciteAction>
                            </CalciteActionGroup>
                        </CalciteActionBar>
                        {/* PRIMARY PANEL */}
                        <PanelInfo/>
                        <PanelSearchResults/>
                        <PanelPropertyDetail/>

                    </CalciteShellPanel>
                    
                    {/* WEBMAP */}
                    {/* <Map/> */}
                    <WebMapComponentBeta/>

                    {/* MAP TOOLS */}
                    <CalciteShellPanel width="l" className="right-panel" slot="panel-end" position="end" id="shell-panel-end" collapsed={rightPanelCollapsed}>
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar" expanded>
                            <CalciteActionGroup>
                                <CalciteAction 
                                    active={!comparablePanelClosed}
                                    text={translateText("Compare")} 
                                    icon="compare" 
                                    textEnabled 
                                    onClick={() => {
                                        togglePanel('compare')
                                    }}>

                                </CalciteAction>
                                <CalciteAction 
                                    active={!nearbyPanelClosed}
                                    text={translateText("Nearby" )}
                                    icon="rings-largest" 
                                    textEnabled 
                                    onClick={() => {
                                        togglePanel('nearby')
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
                                            togglePanel('compareResults')
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
                                            togglePanel('compareDetail')
                                        }}>

                                    </CalciteAction> : null
                                }

                                <CalciteAction 
                                    active={!layersPanelClosed}
                                    text={translateText("Layers")} 
                                    icon="layers" 
                                    textEnabled 
                                    onClick={() => {
                                        togglePanel('layers')
                                    }}>
                                </CalciteAction>

                                <CalciteAction 
                                    active={!imageryPanelClosed}
                                    text={translateText("Imagery")} 
                                    icon="basemap" 
                                    textEnabled 
                                    onClick={() => {
                                        togglePanel('imagery')
                                    }}>
                                </CalciteAction>

                                <CalciteAction 
                                    active={!printPanelClosed}
                                    text={translateText("Print")} 
                                    icon="print" 
                                    textEnabled 
                                    onClick={() => {
                                        togglePanel('print')
                                    }}>
                                </CalciteAction>

                                <CalciteAction 
                                    active={!selectPanelClosed}
                                    text={translateText("Select")} 
                                    icon="select" 
                                    textEnabled 
                                    onClick={() => {
                                        togglePanel('select')
                                    }}>
                                </CalciteAction>
                                
                            </CalciteActionGroup>
                        </CalciteActionBar>

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
                </CalciteShell>
                                
            {/* </CalcitePanel> */}

        

    </CalciteShell>
    )
    


}

export default Layout