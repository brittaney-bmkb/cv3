import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-block";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/components/calcite-action-group";
import "@esri/calcite-components/dist/components/calcite-action";


import { CalciteAction, CalciteActionBar, CalciteActionGroup, CalciteBlock, CalcitePanel, CalciteShell, CalciteShellPanel } from "@esri/calcite-components-react"
import WebMapComponentBeta from "./components/WebMapView/WebMapComponentBeta"
import SearchBarComponent from "./components/SearchBar/SearchBarComponent";

const Layout = () => {

    return(
        <CalciteShell content-behind>
            <CalcitePanel heading="title">
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
                            <CalciteBlock heading="Panel" open>
                                {/* SEARCH */}
                                <SearchBarComponent/>
                            </CalciteBlock>
                        </CalcitePanel>
                    </CalciteShellPanel>
        
                        <WebMapComponentBeta/>
     

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