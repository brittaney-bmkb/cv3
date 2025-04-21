import { CalciteChip, CalciteNotice, CalciteScrim } from "@esri/calcite-components-react"
import "@esri/calcite-components/components/calcite-chip"
import "@esri/calcite-components/components/calcite-scrim"
import UseAppContext from "../../contexts/AppContext"

const Inactive = ({title, message}) => {

    const {translateText, primaryResultFeature} = UseAppContext()

    return(
        < div style={{padding: 10}}>
        
        <CalciteNotice open icon closable>
                        <div slot="title">{title ? title: translateText("No results.")}</div>
                        <div slot="message">{message ? message: translateText("Try a new search.")}</div>
                </CalciteNotice>
        </div>
        // <CalciteScrim>
        //         {/* <CalciteChip 
        //         kind="neutral"
        //         scale='l'
        //         label={message ? message: translateText("Search for a parcel")}
        //         value={message ? message: translateText("Search for a parcel")}
        //         >
                    
        //         </CalciteChip> */}

            // </CalciteScrim>


    )
}

export default Inactive