import { returnMunicipality } from "../arcgis/geoprocessing/geoprocessing"

// Function to convert an object to a CSV string
function arrayToCsv(data) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(value => `"${value}"`).join(',')).join('\n');
    return `${header}\n${rows}`;
}

export const prepareDataForExport = async (primaryResultFeature, dataDictionary, filename) => {

    let features = Array.isArray(primaryResultFeature) ? primaryResultFeature : [primaryResultFeature]

    let fieldsToExclude = [null, "comparable_properties","nearby_properties","assessor_link", "find_my_district_link", "zoning_info","hist_assessval_link","oblique_link","clerk_prop_records_link","historical_photo_link","property_portal_link","hist_sf_mf_imp_chars_link","res_condo_chars_link"]
    let preparedHeaderFieldsObj = []
    let categoriesToExclude =  [null]

    let categories = [
        ...new Set(
            dataDictionary
                .filter(data => !categoriesToExclude.includes(data.attributes['category']))
                .sort((a, b) => a.attributes['details_category_order'] > b.attributes['details_category_order'] ? 1:-1)
                .map(data => data.attributes['category'])
        )
    ]

    categories.map((category) => {
        let filteredData = dataDictionary
                       ?.filter((data) => data.attributes['category'] === category && !fieldsToExclude.includes(data.attributes['field']))
                       .sort((a, b) => a.attributes['category_order'] > b.attributes['category_order'] ? 1:-1)
                       .map((data) => data)
            
        filteredData.map((data) => {
            let label = data.attributes['label']
            let field = data.attributes['field']

            let obj = {"label": label, "field":field}
            if(!preparedHeaderFieldsObj.includes(label)){
                preparedHeaderFieldsObj.push(obj)
            }
        }) 
    })


    let dataRows = await Promise.all(features.map(async (feature, i) => {

        console.log("COUNT : ", i)
        let result =  await Promise.all(Object.entries(preparedHeaderFieldsObj).map( async ([key, fields]) => {
            //console.log("FIELD: ",  field)
            let obj = {}
            let value = null
            let alias = fields["label"]
            let attribute = fields["field"]

            if(attribute === "incorp_unincorp_state"){
                const muniValueReturned = await returnMunicipality(feature);
                value = muniValueReturned ? `Incorporated ${muniValueReturned}` : `Unincorporated ${feature.attributes['township_name']}`
            }
            else{
                value = feature.attributes[attribute]
            }

            obj[alias] = value
            return obj
        }))

        // Use Array.prototype.reduce to merge objects into a single object
        let mergedObject = result.reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});

        return mergedObject

    }))

    console.log("DATA TO EXPORT: ", dataRows)

    // Convert the combined object to CSV
    const csvData = arrayToCsv(dataRows);

    // Create a Blob with the CSV data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.csv`;

    // Append the link to the body and trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the link from the body
    document.body.removeChild(downloadLink);
    
    return dataRows
}

export const exportToCsv = (data, fields) => {
    
    const titleKeys = Object.keys(ourData[0])

    const refinedData = []
    refinedData.push(titleKeys)

    ourData.forEach(item => {
    refinedData.push(Object.values(item))  
    })

    let csvContent = ''

    refinedData.forEach(row => {
    csvContent += row.join(',') + '\n'
    })
}