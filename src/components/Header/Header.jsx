import { CalciteAction, CalciteActionBar, CalciteFlow, CalciteFlowItem, CalciteLabel, CalciteMenu, CalciteMenuItem, CalciteNavigation, CalciteNavigationLogo } from "@esri/calcite-components-react"
import { config } from "../../data/config"
import SearchBarComponent from "../SearchBar/SearchBarComponent"
import HeaderMenu from "./HeaderMenu"
import "@esri/calcite-components/components/calcite-navigation"
import "@esri/calcite-components/components/calcite-navigation-logo"
import "@esri/calcite-components/components/calcite-menu"
import "@esri/calcite-components/components/calcite-menu-item"
import "@esri/calcite-components/components/calcite-flow-item"
import "@esri/calcite-components/components/calcite-flow"
import UseAppContext from "../../contexts/AppContext"
import * as intl from "@arcgis/core/intl.js";
import { useRef, useState } from "react"


const Header = () => {

    const { 
        translateText, 
        setLanguage, 
        setFeedbackDialog,
        isMobile
     } = UseAppContext()


    return(
            <CalciteNavigation slot="header" className='org-brand'>
                <CalciteNavigationLogo 
                slot="logo" 
                heading="CookViewer" 
                description={translateText(config.description)}
                thumbnail={config.logo}
                className="org-brand">

                </CalciteNavigationLogo >
                {
                    !isMobile ? 
                    <div slot="content-start">
                        {/* SEARCH BAR */}
                        <SearchBarComponent/>
                    </div>
                    :null
                }
               

            {
                isMobile ?
                null:
                <HeaderMenu/>
            }
              
            </CalciteNavigation>
    )
}

export default Header