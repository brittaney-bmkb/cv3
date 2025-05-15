import { CalciteButton, CalciteFlow, CalciteFlowItem, CalciteMenu, CalciteMenuItem } from "@esri/calcite-components-react"
import { config } from "../../data/config"
import UseAppContext from "../../contexts/AppContext"
import * as intl from "@arcgis/core/intl.js";


import "@esri/calcite-components/components/calcite-menu"
import "@esri/calcite-components/components/calcite-menu-item"
import "@esri/calcite-components/components/calcite-flow-item"
import "@esri/calcite-components/components/calcite-flow"
import { FlowItem } from "@esri/calcite-components/components/calcite-flow-item";
import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function titleCase(s) {
    return s.toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
}




const HeaderMenu = () => {

    const {
        translateText,
        setLanguage,
        setFeedbackDialog,
        refTranslate,
        setHelpPanel
    } = UseAppContext()

    const [routeParams , setSearchParams] = useSearchParams()

    const menuItems = {
        Help: {
            icon: "question",
            subMenuItems: null,
            id:"help",
            ref: null
        },
        Feedback:{
            icon:"speech-bubble-exclamation",
            subMenuItems: null,
            id:"feedback-expanded",
            ref: null
        },
        Translate: {
            icon: "language-translate",
            subMenuItems: config.language_codes,
            id: "translate",
            ref: refTranslate
        }
    }

    const handleClick = (language) => {
        //reference: https://developers.arcgis.com/javascript/latest/localization/
        
        setLanguage(language)
        let locale_code = config.language_codes[language]
        intl.setLocale(locale_code)

        const params = ["search", "pin10", "pin14"]
        const newParams = {}

        params.forEach((param) => {
            let value = routeParams.get(param);
            //short-circuit evaluation 
            value && (newParams[param] = value);
        });

        newParams['lang'] = language
        setSearchParams(newParams)
    }

    return(
        <CalciteMenu
        id="header-menu"
        slot="content-end"
        className="org-brand">
            {
                Object.keys(menuItems).map(menuItem => {
                    return(
                        <CalciteMenuItem
                            id={menuItems[menuItem].id}
                            ref={menuItems[menuItem].ref}
                            key={menuItem}
                            text={translateText(menuItem)} 
                            iconStart={menuItems[menuItem].icon}
                            label={menuItem}
                            text-enabled
                            onCalciteMenuItemSelect={() => {
                                if(menuItem === 'Feedback'){
                                    setFeedbackDialog(true, 'extended')
                                }
                                if(menuItem === 'Help'){
                                    setHelpPanel(false)
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
                                                text={titleCase(translateText(subMenuItem.replace('spanish', 'español')))}
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
        setSearchParams
    } = UseAppContext();

    const [menuOpen, setMenuOpen] = useState(false);
    const flowRef = useRef(null);
    const [flowOpen, setFlowOpen] = useState(false);


    const handleClick = (language) => {
        
        setMenuOpen(false)
        setLanguage(language);
        let locale_code = config.language_codes[language];
        intl.setLocale(locale_code);
        
        const params = ["search", "pin10", "pin14"]
        const newParams = {}

        params.forEach((param) => {
            let value = routeParams.get(param);
            //short-circuit evaluation 
            value && (newParams[param] = value);
        });

        newParams['lang'] = language
        setSearchParams(newParams)

    };

    const createFlowItem = (title, submenuItems) => {

        const newFlowItemElement = document.createElement("calcite-flow-item");
        newFlowItemElement.heading = title;

        if (submenuItems && Object.keys(submenuItems).length) {
            const menuElement = document.createElement("calcite-menu");
            menuElement.setAttribute("layout", "vertical");

            Object.keys(submenuItems).forEach((submenuItem) => {
                const menuItem = document.createElement("calcite-menu-item");
                menuItem.setAttribute("text", titleCase(translateText(submenuItem.replace("spanish","español"))));
                menuItem.addEventListener('click', () => handleClick(submenuItem))
                menuElement.appendChild(menuItem)
            });

            newFlowItemElement.appendChild(menuElement);
        }

        // Hide all existing flow items except the new one
        if (flowRef.current) {
            const existingFlowItems = flowRef.current.children;
            Array.from(existingFlowItems).forEach((item) => {
                item.style.display = "none"; // Hide previous flow items
            });
        }

        newFlowItemElement.addEventListener("calciteFlowItemBack", () => {

            newFlowItemElement.remove();

             // Restore display for all previous flow items when the new one is removed
            if (flowRef.current) {
                const remainingFlowItems = flowRef.current.children;
                Array.from(remainingFlowItems).forEach((item) => {
                    item.style.display = ""; // Reset to default display
                });
            }
        });

        if (flowRef.current) {
            flowRef.current.append(newFlowItemElement);
            const flowItems = flowRef.current.items || [];
            flowItems.forEach(item => (item.selected = false));
            newFlowItemElement.selected = true;
            
        }
    };

    return (
        <>
            <CalciteButton 
                slot="content-end" 
                iconStart="hamburger"
                className="hyperlink-button"
                width="full"
                scale="l"
                onClick={() => {
                    setMenuOpen(!menuOpen);
                }}
            />

            {menuOpen && (
                <CalciteFlow slot="navigation-tertiary" className="overlay-menu">
                    <CalciteFlowItem heading={translateText("Menu")} ref={flowRef} key="menu">
                        <CalciteMenu 
                            layout="vertical"
                            label={translateText("Help, Feedback, and Translation Menu")}
                        >
                            {Object.keys(menuItems).map((item) => (
                                <CalciteMenuItem
                                    key={item}
                                    text={translateText(item)}
                                    iconStart={menuItems[item].icon}
                                    breadcrumb={!!menuItems[item].subMenuItems}
                                    onCalciteMenuItemSelect={() => {
                                        if(item === "Translate"){
                                            createFlowItem(item, menuItems[item].subMenuItems)
                                        }
                                        
                                        if(item === "Feedback"){
                                            setFeedbackDialog(true, 'extended')
                                            setMenuOpen(false)
                                        }
                                    }
                                        
                                    }
                                />
                            ))}
                        </CalciteMenu>
                    </CalciteFlowItem>
                </CalciteFlow>
            )}
        </>
    );
};