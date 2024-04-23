import { ArcgisLayerList } from "@arcgis/map-components-react"
import { useEffect, useRef } from "react"
import UseAppContext from "../../../contexts/AppContext"

const LayerList = () => {

    const layerListRef = useRef(null)

    const { mapView, translateText } = UseAppContext()

    useEffect(() => {

        const configureLayerList = () => {
            if(layerListRef.current && mapView){

                const layerList = layerListRef.current
                console.log("Layer list: ", layerListRef.current)
                layerList.view = mapView
            }
        }

        configureLayerList()

    }, [layerListRef, mapView])

    return(
        <ArcgisLayerList
        ref={layerListRef}
        visibilityAppearance="checkbox"
        dragEnabled={true}
        visibleElementsStatusIndicators={false}
        listItemCreatedFunction = { (event) => {
            const item = event.item
            item.title = translateText(item.title)
        }}
        />
    )

}

export default LayerList