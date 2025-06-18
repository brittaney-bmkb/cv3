

import { 
    CalciteLoader,
    CalciteScrim,
    CalciteShell, 
    CalciteShellPanel 
} from "@esri/calcite-components-react"
import PanelSearchResults from "./components/Panel/PanelSearchResults";
import UseAppContext from "./contexts/AppContext";
import Header from "./components/Header/Header";
import PanelInfo from "./components/Panel/PanelInfo";
import { useEffect, useState } from "react";
import PanelPropertyDetail from "./components/Panel/PanelPropertyDetail";
import PropertyComparison from "./components/PropertyComparison/PropertyComparison";
import NearbyPanel from "./components/PropertyNearby/NearbyPanel";
import Layers from "./components/Layers/Layers";
import Imagery from "./components/Imagery/Imagery";
import Print from "./components/Print/Print";
import Measure from "./components/Measurement/measurement";
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
import GuidedTour from "./components/GuidedTour/GuidedTour";
import Help from "./components/Help/Help";



const Layout = () => {

    // State of panels
    const {  
        propertyDetailPanelClosed, 
        infoPanelClosed, 
        searchResultsPanelClosed,
        nearbyPanelClosed,
        comparablePanelClosed,
        comparisonResultsClosed,
        comparisonDetailPanelClosed,
        layersPanelClosed,
        printPanelClosed,
        imageryPanelClosed,
        measurePanelClosed,
        selectPanelClosed,
        isMobile,
        translateText
    } = UseAppContext()


    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false) 
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false) 

    useEffect(() => {

        if(!isMobile){
            const allPanelsClosed =  [ propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed].every(panel => panel === true); 
            setLeftPanelCollapsed(allPanelsClosed)
        }

        if(isMobile){
            const allPanelsClosed =  [ propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed, nearbyPanelClosed, comparablePanelClosed ].every(panel => panel === true); 
            setLeftPanelCollapsed(allPanelsClosed)
        }

    }, [propertyDetailPanelClosed, infoPanelClosed, searchResultsPanelClosed, nearbyPanelClosed, comparablePanelClosed])

    useEffect(() => {

        const allPanelsClosed =   [selectPanelClosed, printPanelClosed, imageryPanelClosed, layersPanelClosed, comparisonDetailPanelClosed, nearbyPanelClosed, comparablePanelClosed, measurePanelClosed, comparisonResultsClosed].every(panel => panel === true); 
        setRightPanelCollapsed(allPanelsClosed)

    }, [selectPanelClosed, printPanelClosed, imageryPanelClosed, layersPanelClosed, nearbyPanelClosed, comparablePanelClosed, comparisonResultsClosed, measurePanelClosed, comparisonDetailPanelClosed])


    const isTranslationsLoading = !translateText("test") || translateText("test") === "loading....";

    return(
        <CalciteShell contentBehind ={isMobile}>

            {
                isTranslationsLoading && (
                    <CalciteScrim loading />
                )
            }


            {isMobile ? null : <GuidedTour/>}
            
            {/* HEADER */}
            <Header/>
            {/* <CalcitePanel  className='header'> */}
                {/* HEADER */}
                {/* <Header/> */}
                {/* <CalciteShell
                contentBehind ={isMobile}
                > */}
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
                    //style={{paddingBottom: isMobile ? 60 : 0}}
                    >   
                        {/* ACTION BAR */}
                        <ActionBarStart/>
                        {/* PRIMARY PANEL */}
                        <PanelInfo/>
                        <PanelSearchResults/>
                        <PanelPropertyDetail/>
                        
                        {
                            isMobile ?
                        <>
                            <PropertyComparison/>
                            <NearbyPanel/>
                        </> : null
                        }

                    </CalciteShellPanel>
                    
                    <Help/>
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
                        {
                            isMobile ? null : 
                        <>
                            <PropertyComparison/>
                            <NearbyPanel/>
                        </>
                        }
                        {/* <ComparisonResults/>
                        <ComparisonPropertyDetail/> */}
                        <Layers/>
                        <Imagery/>
                        <Measure/>
                        <Print/>
                        <Select/>

                    </CalciteShellPanel>

                    <Export/>
                    <Feedback/>

                {/* </CalciteShell> */}
                                
            {/* </CalcitePanel> */}

        

    </CalciteShell>
    )
    


}

export default Layout