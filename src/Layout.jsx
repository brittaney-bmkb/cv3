

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

const Layout = () => {
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
                                <CalciteAction text="Add" icon="plus"></CalciteAction>
                            </CalciteActionGroup>
                        </CalciteActionBar>
                        {/* PRIMARY PANEL */}
                        <CalcitePanel scale="l">
                            {/* PANEL CONTENT */}
                            {/* <CalciteBlock heading="Panel" open>
                               
                                <SearchBarComponent/>
                            </CalciteBlock> */}
                            <PanelSearchResults/>
                        </CalcitePanel>
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