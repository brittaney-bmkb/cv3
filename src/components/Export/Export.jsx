import { CalciteButton, CalciteDialog, CalciteDropdown, CalciteDropdownGroup, CalciteDropdownItem, CalciteInputMessage, CalciteInputText, CalciteLabel, CalciteNotice } from "@esri/calcite-components-react"
import "@esri/calcite-components/components/calcite-dialog"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"

import "@esri/calcite-components/dist/components/calcite-input-text"
import "@esri/calcite-components/dist/components/calcite-dropdown"
import "@esri/calcite-components/dist/components/calcite-dropdown-group"
import "@esri/calcite-components/dist/components/calcite-dropdown-item"
import { exportToCsv, exportToExcel } from "../../export/export"
import { config } from "../../data/config"

const exportFileTypes = ['.csv', '.xlsx']
const fileTypePlaceHolder = 'Select a file type'
const Export = () => {

    const { 
        translateText, 
        primaryResultFeature, 
        secondaryResultFeature,
        searchFeatures,
        comparableParcels,
        exportOpen, 
        exportDataSource,
        setExportOpen,
        dataDictionary} = UseAppContext()
    const [fileType, setFiletype] = useState(fileTypePlaceHolder)
    const [fileName, setFileName] = useState(null)
    const [inputStatus, setInputStatus] = useState(null)
    const [isExporting, setIsExporting] = useState(false)
    const [parcelSource, setParcelSource] = useState(null)
    const [dataTitle, setDataTitle] = useState(null)
    const [openNotice, setOpenNotice] = useState(false)

    
    const handleBeforeOpen = () => {
        setFileName(null)
        setInputStatus('idle')
    }
    const handleClose = () => {
        
        setExportOpen(false, exportDataSource)
    }

    const toggleSource = (exportDataSource) => {   

        const isMultiple = searchFeatures?.length > 1

        if(!searchFeatures){
            return
        }
        else if(!primaryResultFeature){
            return
        }
        else{
            switch (exportDataSource) {
                case 'search':
                setParcelSource(searchFeatures)
                setDataTitle(translateText(`Parcel Search Result${isMultiple ? 's' : ''}`));
                break;
                case 'property':
                setParcelSource(primaryResultFeature)
                setDataTitle(`${translateText('Parcel PIN')} ${primaryResultFeature[0].attributes[config.target_layer_display_field]}`);
                break;
                case 'comparable-property':
                setParcelSource(secondaryResultFeature)
                setDataTitle(`${translateText('Parcel PIN')} ${secondaryResultFeature[0].attributes[config.target_layer_display_field]}`);
                break;
                case 'comparable-search':
                setParcelSource(comparableParcels)
                setDataTitle(translateText(`Comparable Parcel Search Result${isMultiple ? 's' : ''}`));
                break;
            }
        }
        
    }

    const handleExport = async () => {

        if(!fileName){
            setInputStatus('invalid')
            return
        }

        if(fileType == fileTypePlaceHolder){
            setInputStatus('invalid')
            return
        }

        else{
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
        id="export-dialog"
        scale="s"
        width="s"
        drag-enabled
        outsideCloseDisabled={false}
        open={exportOpen}
        placement="center"
        focusTrapDisabled
        heading={translateText('Export')}
        description={translateText('Export data to CSV or Excel')}
        onCalciteDialogClose={() => {handleClose()}}
        onCalciteDialogBeforeOpen={() => {handleBeforeOpen()}}
        >   
        <CalciteLabel style={{paddingBottom: 100, paddingTop:20}} >
            {dataTitle}
            <CalciteInputText 
            required
            status={inputStatus}
            scale="m" 
            placeholder={translateText("filename")}
            value={fileName}
            validationIcon="frown"
            validationMessage={translateText('Please enter filename')}
            onCalciteInputTextChange={(e) => {setFileName(e.target.value)}}
            >   
                <CalciteDropdown  slot="action" onCalciteDropdownSelect={(e) => {
                    setFiletype(e.target.selectedItems[0].textContent)
                }}>
                    <CalciteButton 
                    slot="trigger" 
                    className='hyperlink-button'
                    iconEnd="chevron-down"
                    >{translateText(fileType)}</CalciteButton>
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
            <CalciteButton appearance="outline" onClick={() => {handleClose()}}>
                Cancel
            </CalciteButton>
            <CalciteButton 
            loading={isExporting}
            className='hyperlink-button' 
            onClick={() => handleExport()}
            >
                {translateText('Export')}
            </CalciteButton>
        </div>

        </CalciteDialog>
    )
}

export default Export