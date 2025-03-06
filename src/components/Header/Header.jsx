import { CalciteAction, CalciteActionBar, CalciteLabel } from "@esri/calcite-components-react"
import { config } from "../../data/config"
import SearchBarComponent from "../SearchBar/SearchBarComponent"

const Header = () => {
    return(
            <>
            <div id style={{display: 'flex', alignItems: 'center', height: '40px', marginTop: '5px'}} slot="header-content" class='header'>
                <CalciteLabel layout="inline" class='header'>
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 20, 
                        width: '22vw',
                        fontSize: '20px'}}>
                        <img src={config.logo} width={50}/>
                        <div 
                        style={{
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 5,}}>
                        <div 
                        style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        }}>
                            {config.title}
                        </div>
                        <div 
                        style={{
                        fontSize: '16px'}}>
                            {config.description}
                        </div>
                        </div>
                    </div>
                    {/* SEARCH BAR */}
                    <SearchBarComponent/>
                </CalciteLabel> 
                    
            </div>
            <div slot="header-actions-end" style={{display: 'flex', alignItems: 'center'}}>
                <CalciteActionBar slot="action-bar" layout="horizontal" expandDisabled  scale="l" overlayPositioning="absolute">
        
                        <CalciteAction text="Help" icon="question" textEnabled  class='header'></CalciteAction>
                        <CalciteAction text="Feedback" icon="speech-bubble-exclamation" textEnabled  class='header'></CalciteAction>
                        <CalciteAction text="Translate" icon="language-translate" textEnabled  class='header'></CalciteAction>
                    
                </CalciteActionBar>
            </div>
            </>
    )
}

export default Header