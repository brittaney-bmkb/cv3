import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { config } from "../data/config";



export async function returnTranslatedText(features){

    ////console.log("TRANSLATION OBJECT BEING CREATED", features)

    //create translation object to replace text
    const translations = Object.fromEntries(features.map( feature => [feature.attributes["ID"] , {}]))


    features.map((feature) => {
        let attributes = feature.attributes
        let idKey = attributes["ID"]
        let obj = {}
        config.languages.map((language) => {
            obj[language] = attributes[language]
        })

        translations[idKey] = obj
    })  

    ////console.log("TRANSLATION OBJECT: ", translations)
    return translations
}

