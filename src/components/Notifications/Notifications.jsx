import { config } from "../../data/config"
import UseAppContext from "../../contexts/AppContext"
import { CalciteNotice } from "@esri/calcite-components-react";
import "@esri/calcite-components/dist/components/calcite-notice"

const Notifications = () => {

    const { translateText } = UseAppContext()


    return(
        <CalciteNotice
        open={config.showBanner}
        kind="warning"
        icon
        slot="header"
        >
            <span slot="title">
                {translateText(config.bannerHeader)}
            </span>
            <span slot="message">
                {translateText(config.bannerMessage)}
            </span>
        </CalciteNotice>
    )
}

export default Notifications