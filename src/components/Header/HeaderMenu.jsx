import { CalciteMenu, CalciteMenuItem } from "@esri/calcite-components-react"
import { config } from "../../data/config"
import UseAppContext from "../../contexts/AppContext"

function titleCase(s) {
    return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}


const menuItems = {
    Help: {
        icon: "question",
        subMenuItems: null,
    },
    Feedback:{
        icon:"speech-bubble-exclamation",
        subMenuItems: null,
    },
    Translate: {
        icon: "language-translate",
        subMenuItems: config.language_codes,
    }
}

const HeaderMenu = () => {

    const {
        translateText,
        setLanguage,
        setFeedbackDialog,
    } = UseAppContext()

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
        <CalciteMenu
        slot="content-end"
        className="org-brand">
            {
                Object.keys(menuItems).map(menuItem => {
                    return(
                        <CalciteMenuItem
                            key={menuItem}
                            text={translateText(menuItem)} 
                            iconStart={menuItems[menuItem].icon}
                            label={menuItem}
                            text-enabled
                            onCalciteMenuItemSelect={() => {
                                if(menuItem === 'Feedback'){
                                    setFeedbackDialog(true, 'extended')
                                }
                            }}
                        >
                            {
                                menuItems[menuItem].subMenuItems.map(subMenuItem => {
                                    return(
                                            <CalciteMenuItem 
                                                slot="submenu-item" 
                                                key={subMenuItem} 
                                                label={subMenuItem}
                                                text={titleCase(translateText(subMenuItem))}
                                                onCalciteMenuItemSelect={(e) => {
                                                    console.log("menu item: ", e)
                                                    handleClick(subMenuItem)
                                                }}/>
                                    )
                                })
                            }
                        </CalciteMenuItem>
                    )
                })
            }

        </CalciteMenu>
    )

}

export default HeaderMenu

const HeaderMenuMobile = (menuItems) => {

}