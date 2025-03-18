import { CalciteButton, CalciteDialog, CalciteDropdown, CalciteDropdownGroup, CalciteDropdownItem, CalciteInputMessage, CalciteInputText, CalciteLabel, CalciteNotice } from "@esri/calcite-components-react"
import "@esri/calcite-components/components/calcite-dialog"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"

import "@esri/calcite-components/dist/components/calcite-input-text"
import "@esri/calcite-components/dist/components/calcite-dropdown"
import "@esri/calcite-components/dist/components/calcite-dropdown-group"
import "@esri/calcite-components/dist/components/calcite-dropdown-item"
import { exportToCsv, exportToExcel } from "../../export/export"

const exportFileTypes = ['.csv', '.xlsx']

const Export = () => {

    const { 
        translateText, 
        primaryResultFeature, 
        comparableParcels,
        exportOpen, 
        exportDataSource,
        setExportOpen,
        dataDictionary} = UseAppContext()
    const [fileType, setFiletype] = useState(exportFileTypes[0])
    const [fileName, setFileName] = useState(null)
    const [inputStatus, setInputStatus] = useState(null)
    const [isExporting, setIsExporting] = useState(false)
    const [parcelSource, setParcelSource] = useState(null)
    const [dataTitle, setDataTitle] = useState(null)
    const [openNotice, setOpenNotice] = useState(false)

    const toggleSource = (exportDataSource) => {   

        const isMultiple = primaryResultFeature?.length > 1

        switch (exportDataSource) {
            case 'searchResults':
            setParcelSource(primaryResultFeature)
            setDataTitle(translateText(`Parcel Search Result${isMultiple ? 's' : ''}`));
            break;
            case 'Property':
            setParcelSource(primaryResultFeature)
            setDataTitle(translateText(`Selected Parcel${isMultiple ? 's' : ''}`));
            break;
        }
    }

    const handleExport = async () => {

        if(!fileName){
            setInputStatus('invalid')
            return
        }

        else{
            setInputStatus('valid')
            setIsExporting(true)
            if(fileType === '.csv'){
                
                await exportToCsv(parcelSource, dataDictionary, fileName)
                

            }
            if(fileType === '.xlsx'){
                await exportToExcel(parcelSource, dataDictionary, fileName)
            }
            setIsExporting(false)
        }
        
    }

    useEffect(() => {

        if(!fileName){
            setInputStatus('invalid')
        }
        else{
            setInputStatus('valid')
        }

    }, [fileName])

    useEffect(() => {

        toggleSource(exportDataSource)

    }, [exportDataSource, primaryResultFeature])

    return(
        <CalciteDialog
        scale="s"
        width="s"
        drag-enabled
        open={exportOpen}
        placement="center"
        heading={translateText('Export')}
        description={translateText('Export data to CSV or Excel')}
        onCalciteDialogClose={() => {setExportOpen(false, exportDataSource)}}
        >   
        <CalciteLabel style={{paddingBottom: 100, paddingTop:20}} >
            {dataTitle}
            <CalciteInputText 
            required
            status={inputStatus}
            scale="m" 
            placeholder="filename"
            validationIcon="frown"
            validationMessage={translateText('Please enter filename')}
            onCalciteInputTextChange={(e) => {setFileName(e.target.value)}}
            >   
                <CalciteDropdown  slot="action" onCalciteDropdownSelect={(e) => {
                    setFiletype(e.target.selectedItems[0].textContent)
                }}>
                    <CalciteButton slot="trigger" className='hyperlink-button'>{fileType}</CalciteButton>
                    <CalciteDropdownGroup selection-mode="single">
                    {
                        exportFileTypes.map((fileType, i) => {
                            return(
                            <CalciteDropdownItem
                            key = {`fileType-${i}`}
                            label={fileType}
                            >
                                {fileType}
                            </CalciteDropdownItem>
                            )
                            
                        })
                    }
                    </CalciteDropdownGroup>
                    
                </CalciteDropdown>
                
            </CalciteInputText>
        </CalciteLabel>
        <div slot="footer-start">
                <CalciteNotice
                closable
                open = {openNotice}
                onCalciteNoticeClose={() => {setOpenNotice(false)}}
                >
                    {translateText('Check downloads for your export')}
                </CalciteNotice>
        </div>
        
        <div slot="footer-end" style={{display: "flex", gap: '20px'}}>
            <CalciteButton appearance="outline" onClick={() => {setExportOpen(false, exportDataSource)}}>
                Cancel
            </CalciteButton>
            <CalciteButton 
            loading={isExporting}
            className='hyperlink-button' 
            onClick={() => handleExport()}
            >
                Export
            </CalciteButton>
        </div>

        </CalciteDialog>
    )
}

export default Export