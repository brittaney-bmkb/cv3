

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
import { useCallback, useState } from "react";


const Layout = () => {

    const useToggle = (initialState = false) => {
        const [state, setState] = useState(initialState);
      
        const toggle = useCallback(() => {
          setState(prevState => !prevState);
        }, []);
      
        return [state, toggle];
      };

    // State of panels
    const {infoPanelClosed, setInfoPanel} = UseAppContext()


    return(
        <CalciteShell>
            <CalcitePanel  class='header'>
                {/* HEADER */}
                <Header/>
                <CalciteShell>
                    {/* LEFT PANEL */}
                    <CalciteShellPanel  width="m" slot="panel-start" position="start" id="shell-panel-start">
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar">
                            <CalciteActionGroup>
                                <CalciteAction text="info" icon="information" textEnabled onClick={() => {setInfoPanel(false)}}></CalciteAction>
                            </CalciteActionGroup>
                        </CalciteActionBar>
                        {/* PRIMARY PANEL */}
                        <PanelInfo/>

                    </CalciteShellPanel>
                    
                    {/* WEBMAP */}
                    <WebMapComponentBeta/>

                    {/* MAP TOOLS */}
                    <CalciteShellPanel slot="panel-end" position="end" id="shell-panel-end" collapsed>
                        {/* ACTION BAR */}
                        <CalciteActionBar slot="action-bar">
                            <CalciteActionGroup>
                                <CalciteAction text="Add" icon="plus"></CalciteAction>
                            </CalciteActionGroup>
                        </CalciteActionBar>
                        {/* SECONDARY PANEL */}
                        <CalcitePanel heading="secondary panel" closable>

                        </CalcitePanel>
                    </CalciteShellPanel>
                </CalciteShell>
            
            </CalcitePanel>

        

    </CalciteShell>
    )
    


}

export default Layout