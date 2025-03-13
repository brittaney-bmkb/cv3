import { CalciteAction, CalciteActionBar, CalciteLabel, CalciteMenu, CalciteMenuItem, CalciteNavigation, CalciteNavigationLogo } from "@esri/calcite-components-react"
import { config } from "../../data/config"
import SearchBarComponent from "../SearchBar/SearchBarComponent"
import "@esri/calcite-components/components/calcite-navigation"
import "@esri/calcite-components/components/calcite-navigation-logo"
import "@esri/calcite-components/components/calcite-menu"
import "@esri/calcite-components/components/calcite-menu-item"
import UseAppContext from "../../contexts/AppContext"
import * as intl from "@arcgis/core/intl.js";

function titleCase(s) {
    return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}

const menuItems = {
    Help: {
        icon: "question",
        subMenuItems: null
    },
    Feedback:{
        icon:"speech-bubble-exclamation",
        subMenuItems: null
    },
    Translate: {
        icon: "language-translate",
        subMenuItems: config.language_codes
    }
}

const Header = () => {

    const { translateText, setLanguage } = UseAppContext()

    const handleClick = (language) => {


            console.log("selected language")
            setLanguage(language)

            //reference: https://developers.arcgis.com/javascript/latest/localization/
            let locale_code = config.language_codes[language]
            console.log("setting locale code to: ", locale_code)
            intl.setLocale(locale_code)
            console.log("locale code to: ", intl.getLocale())
        }

    return(
            <CalciteNavigation slot="header" className='org-brand'>
                <CalciteNavigationLogo 
                slot="logo" 
                heading="CookViewer" 
                description={translateText(config.description)}
                thumbnail={config.logo}
                className="org-brand">

                </CalciteNavigationLogo >
                <div slot="content-start">
                    {/* SEARCH BAR */}
                    <SearchBarComponent/>
                </div>

                <CalciteMenu slot="content-end" className="org-brand">
                    {
                        Object.keys(menuItems).map(item => {
                            return(
                                <CalciteMenuItem 
                                key={item} 
                                text={translateText(item)} 
                                iconStart={menuItems[item].icon}
                                label={item}
                                >
                                    {
                                        menuItems[item].subMenuItems ? 
                                        Object.keys(menuItems[item].subMenuItems).map(subMenuItem => {
                                            return(
                                                <CalciteMenuItem 
                                                slot="submenu-item" 
                                                key={subMenuItem} 
                                                label={subMenuItem}
                                                text={titleCase(translateText(subMenuItem))}
                                                onCalciteMenuItemSelect={(e) => {
                                                    console.log("menu item: ", e)
                                                    handleClick(e.target.textContent)
                                                }}
                                                >{subMenuItem}</CalciteMenuItem>
                                            )
                                        })
                                             : null
                                    }
                                </CalciteMenuItem>
                            )
                        })
                    }
                </CalciteMenu>
            </CalciteNavigation>
    )
}

export default Header