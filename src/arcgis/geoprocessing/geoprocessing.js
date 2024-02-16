import Query from "@arcgis/core/rest/support/Query";
import { config } from "../../data/config";
import Point from "@arcgis/core/geometry/Point.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

let muniLayer = new FeatureLayer({
    url: config.municipality_url,
    outFields: ["OBJECTID", "MUNICIPALITY"],
  })

export async function returnMunicipality(parcel){

    let parcelCentroid = parcel.geometry.centroid

    console.log("parcel centroid: ", parcelCentroid)

    console.log("parcel coordinates: ", parcelCentroid.x, parcelCentroid.y )

    let point = new Point({
        x: parcelCentroid.x,
        y: parcelCentroid.y,
        spatialReference : parcel.geometry.spatialReference

    })

    console.log("New point geometry: ", point)

    let query = new Query()
    query.spatialRelationship = "intersects"
    query.geometry = point
    query.returnGeometry = true
    query.outFields = ["*"]

    let { features } = await muniLayer.queryFeatures(query)

    console.log("municipality features ", features)

    let muniValue = features[0].attributes['MUNICIPALITY']
    let incorp_unincorp = muniValue ? `Incoporated ${muniValue}` : `Unincorporated ${parcel.attributes['township_name']}`

    return incorp_unincorp
}