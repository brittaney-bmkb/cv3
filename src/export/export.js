import { returnMunicipality } from "../arcgis/geoprocessing/geoprocessing"
import * as FileSaver from "file-saver";
import * as XlSX from "xlsx"

// Function to convert an object to a CSV string
function arrayToCsv(data) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(value => `"${value}"`).join(',')).join('\n');
    return `${header}\n${rows}`;
}

const getDataFieldsForExport = async (dataDictionary) => {

    //excludes these fields from the export
    let fieldsToExclude = [null,"View District Details", "comparable_properties","nearby_properties","assessor_link", "find_my_district_link", "zoning_info","hist_assessval_link","oblique_link","clerk_prop_records_link","historical_photo_link","property_portal_link","hist_sf_mf_imp_chars_link","res_condo_chars_link"]
    //array to hold object containing the field and field alias (label)
    let preparedHeaderFieldsObj = []
    //categories to exclude from data dictionary
    let categoriesToExclude =  [null]


    //get categories and sort by category order
    let categories = [
        ...new Set(
            dataDictionary
                .filter(data => !categoriesToExclude.includes(data.attributes['category']))
                .sort((a, b) => a.attributes['details_category_order'] > b.attributes['details_category_order'] ? 1:-1)
                .map(data => data.attributes['category'])
        )
    ]

    //push header fields 
    categories.map((category) => {
        let filteredData = dataDictionary
                       ?.filter((data) => data.attributes['category'] === category && !fieldsToExclude.includes(data.attributes['field']))
                       .sort((a, b) => a.attributes['category_order'] > b.attributes['category_order'] ? 1:-1)
                       .map((data) => data)
            
        filteredData.map((data) => {
            let label = data.attributes['label']
            let field = data.attributes['field']

            if(field === null || label === null) return;

            let obj = {"label": label, "field":field}
            if(!preparedHeaderFieldsObj.includes(label)){
                preparedHeaderFieldsObj.push(obj)
            }
        }) 
    })

    return preparedHeaderFieldsObj
}

export const prepareDataForExport = async (featuresToExport, preparedHeaderFieldsObj) => {

    let features = Array.isArray(featuresToExport) ? featuresToExport : [featuresToExport]

    let dataRows = await Promise.all(features.map(async (feature, i) => {

        //console.log("COUNT : ", i)
        let result =  await Promise.all(Object.entries(preparedHeaderFieldsObj).map( async ([key, fields]) => {
            ////console.log("FIELD: ",  field)
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

            if(value === 'null' || !value){
                value = 'N/A'
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

    return dataRows


}

export const exportToCsv = async (featuresToExport, dataDictionary, filename) => {

    let preparedHeaderFieldsObj = await getDataFieldsForExport(dataDictionary)
    let dataRows = await prepareDataForExport(featuresToExport, preparedHeaderFieldsObj)
    
    //console.log("DATA TO EXPORT: ", dataRows)

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
}

export const exportToExcel = async (featuresToExport, dataDictionary, fileName) => {

    let preparedHeaderFieldsObj = await getDataFieldsForExport(dataDictionary)
    let dataRows = await prepareDataForExport(featuresToExport, preparedHeaderFieldsObj)

    // let fields = Object.keys(dataRows)
    // let values = Object.values(dataRows)
    // let data = [
    //     ...fields,
    //     ...values
    // ]

    const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const worksheet = XlSX.utils.json_to_sheet(dataRows);
    const workbook = { Sheets: { data: worksheet}, SheetNames: ["data"]};
    const excelBuffer = XlSX.write(workbook, { bookType: "xlsx", type: "array"});
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
}