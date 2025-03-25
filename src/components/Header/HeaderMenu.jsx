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
    } = UseAppContext();

    const [menuOpen, setMenuOpen] = useState(false);
    const flowRef = useRef(null);
    const [flowOpen, setFlowOpen] = useState(false);


    const handleClick = (language) => {
        console.log("Selected language:", language);
        setLanguage(language);

        let locale_code = config.language_codes[language];
        console.log("Setting locale code to:", locale_code);
        intl.setLocale(locale_code);
        console.log("Locale set to:", intl.getLocale());
        setMenuOpen(false)
    };

    const createFlowItem = (title, submenuItems) => {

        const newFlowItemElement = document.createElement("calcite-flow-item");
        newFlowItemElement.heading = title;

        if (submenuItems && Object.keys(submenuItems).length) {
            const menuElement = document.createElement("calcite-menu");
            menuElement.setAttribute("layout", "vertical");

            Object.keys(submenuItems).forEach((submenuItem) => {
                const menuItem = document.createElement("calcite-menu-item");
                menuItem.setAttribute("text", titleCase(translateText(submenuItem)));
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