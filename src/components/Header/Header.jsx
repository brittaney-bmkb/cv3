import { CalciteNavigation, CalciteNavigationLogo } from "@esri/calcite-components-react"
import { config } from "../../data/config"
import SearchBarComponent from "../SearchBar/SearchBarComponent"
import HeaderMenu, { HeaderMenuMobile } from "./HeaderMenu"
import UseAppContext from "../../contexts/AppContext"

import "@esri/calcite-components/components/calcite-navigation"
import "@esri/calcite-components/components/calcite-navigation-logo"

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
                <HeaderMenuMobile/>:
                <HeaderMenu/>
            }
              
            </CalciteNavigation>
    )
}

export default Header