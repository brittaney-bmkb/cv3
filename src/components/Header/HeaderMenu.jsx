import { CalciteButton, CalciteFlow, CalciteFlowItem, CalciteMenu, CalciteMenuItem } from "@esri/calcite-components-react"
import { config } from "../../data/config"
import UseAppContext from "../../contexts/AppContext"
import * as intl from "@arcgis/core/intl.js";


import "@esri/calcite-components/components/calcite-menu"
import "@esri/calcite-components/components/calcite-menu-item"
import "@esri/calcite-components/components/calcite-flow-item"
import "@esri/calcite-components/components/calcite-flow"
import { FlowItem } from "@esri/calcite-components/components/calcite-flow-item";
import { useRef, useState } from "react";

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
                                menuItems[menuItem].subMenuItems ? Object.keys(menuItems[menuItem].subMenuItems).map(subMenuItem => {
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
                                : null
                            }
                        </CalciteMenuItem>
                    )
                })
            }

        </CalciteMenu>
    )

}

export default HeaderMenu

export const HeaderMenuMobile = () => {

    const {
        translateText,
        setLanguage,
        setFeedbackDialog,
    } = UseAppContext()

    const [ menuOpen, setMenuOpen ] = useState(false)
    const flowRef = useRef(null)
    const [flowItems, setFlowItems] = useState([]);

    const handleClick = (language) => {
        console.log("selected language")
        setLanguage(language)

        //reference: https://developers.arcgis.com/javascript/latest/localization/
        let locale_code = config.language_codes[language]
        console.log("setting locale code to: ", locale_code)
        intl.setLocale(locale_code)
        console.log("locale code to: ", intl.getLocale())
    }

    const createFlowItem = (title) => {
        const newFlowItem = (
            <CalciteFlowItem 
                key={title} 
                heading={title} 
                onCalciteFlowItemBack={() => removeFlowItem(title)}
                selected
            >
                <CalciteMenu layout="vertical">
                    {Object.keys(menuItems[title].subMenuItems).map(submenuItem => {
                        return(
                            <CalciteMenuItem 
                            key={`${submenuItem}`} 
                            text={`${submenuItem}`} 
                        />
                        )
                    })}
                </CalciteMenu>
            </CalciteFlowItem>
        );

        // Add the new flow item while deselecting others
        setFlowItems((prev) => [...prev.map(item => ({ ...item, selected: false })), newFlowItem]);
    };

    const removeFlowItem = (title) => {
        setFlowItems((prev) => prev.filter(item => item.key !== title));
    };


    return(
        <>
        <CalciteButton 
        slot="content-end" 
        iconStart="hamburger"
        className="hyperlink-button"
        width="full"
        scale="l"
        onClick={() => {setMenuOpen(!menuOpen)}}
        /> 

        {
        menuOpen ? 
        <CalciteFlow slot="navigation-tertiary" className='overlay-menu'>
            <CalciteFlowItem heading="Menu" ref={flowRef}>
                <CalciteMenu
                layout="vertical"
                >
                    {Object.keys(menuItems).map(menuItem => {

                        if(menuItems[menuItem].subMenuItems){
                            return(
                                <></>
                            )                         
                        }
                        else{
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
                                    
                                    else{
                                        setMenuOpen(false)
                                    }
                                    
                                }}></CalciteMenuItem>
                            )
                        }

                        
                    })}
                </CalciteMenu>
            </CalciteFlowItem>
            {flowItems}
        </CalciteFlow>
        : null }
        </>
        
    )
}