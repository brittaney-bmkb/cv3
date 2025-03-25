import { CalciteChip, CalciteScrim } from "@esri/calcite-components-react"
import "@esri/calcite-components/components/calcite-chip"
import "@esri/calcite-components/components/calcite-scrim"
import UseAppContext from "../../contexts/AppContext"

const Inactive = () => {

    const {translateText, primaryResultFeature} = UseAppContext()

    return(
       <>
        {
            primaryResultFeature ? null :  
            <CalciteScrim>
                <CalciteChip 
                kind="neutral"
                scale='l'
                label={translateText("Search for a parcel")}
                value={translateText("Search for a parcel")}
                >
                    {translateText("Search for a parcel")}
                </CalciteChip>
            </CalciteScrim>
        }
       
       </>

    )
}

export default Inactive