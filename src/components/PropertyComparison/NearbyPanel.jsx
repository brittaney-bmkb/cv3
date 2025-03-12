import { CalciteBlock, CalciteButton, CalciteDropdown, CalciteDropdownGroup, CalciteDropdownItem, CalciteInputNumber, CalciteLabel, CalcitePanel } from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"
import { useEffect, useState } from "react"

export const linearUnitOptions = {
    "feet": {
        'max': 5280,
        'step': 1
    }, 
    "miles": {
        'max': 1,
        'step': .25
    },
    "meters": {
        'max': 1609.34,
        'step': 1
    },
    "kilometers": {
        'max': 1.60934,
        'step': 1
    }
} 
    


const NearbyPanel = () => {
    const  { nearbyPanelClosed, setNearbyPanel, translateText, searchNearbyProperties } = UseAppContext()

    const [selectedUnit, setSelectedUnit] = useState(Object.keys(linearUnitOptions)[0])
    const [searchRadius, setSearchRadius] = useState(0)

    const handleSearchRadius = () => {

        searchNearbyProperties(searchRadius, selectedUnit)
    }

    return(
        <CalcitePanel 
            id="nearby-panel" 
            closed={nearbyPanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText('Nearby Search')} 
            //description= {translateText("Search for similar properties")}
            onCalcitePanelClose={() => {
                setNearbyPanel(true)
            }}
            style={{display: nearbyPanelClosed ? 'none': 'flex'}}
        > 

            <CalciteBlock
            open
            heading={translateText("Find nearby parcels within a custom distance")}
            description={translateText("Set the radius to search for parcels around your selected location (maximum of 1 mile).")}
            >
                <form id="nearby-search" style={{display:'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                    <CalciteInputNumber
                    form="nearby-search"
                    min={0}
                    max={linearUnitOptions[selectedUnit]['max']}
                    step={linearUnitOptions[selectedUnit]['step']}
                    validationMessage="Radius test"
                    value={searchRadius}
                    onCalciteInputNumberChange={(e) => {setSearchRadius(e.target.value)}}
                    />
                    <CalciteDropdown
                        onCalciteDropdownSelect={(e) => {setSelectedUnit(e.target.selectedItems[0].textContent)}}
                    >
                        <CalciteButton 
                        form="nearby-search"
                        slot="trigger" 
                        className="hyperlink-button"
                        width="full">
                            {translateText(selectedUnit)}
                        </CalciteButton>
                        <CalciteDropdownGroup selection-mode="single">
                        {Object.keys(linearUnitOptions).map(unitOption => {
                            return(
                                <CalciteDropdownItem
                                key={unitOption}
                                label={unitOption}>
                                    {unitOption}
                                </CalciteDropdownItem>
                            )
                            
                        })}
                        </CalciteDropdownGroup>
                        
                    </CalciteDropdown>  
                </form>
                
            </CalciteBlock> 

            <div slot="footer-end" style={{display: "flex", gap: '20px'}}>
                <CalciteButton iconStart="reset" appearance="outline" onClick={() => {setSearchRadius(0)}}>
                    Reset
                </CalciteButton>
                <CalciteButton className='hyperlink-button' onClick={() => handleSearchRadius()}>
                    Search
                </CalciteButton>
            </div>
        </CalcitePanel>
    )
}

export default NearbyPanel