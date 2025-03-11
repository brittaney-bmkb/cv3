import { 
    CalciteBlock, 
    CalciteBlockGroup, 
    CalciteBlockSection, 
    CalciteButton, 
    CalciteDropdown, 
    CalciteDropdownGroup, 
    CalciteDropdownItem, 
    CalciteInput, 
    CalciteInputNumber, 
    CalciteInputText, 
    CalciteLabel, 
    CalcitePanel 
} from "@esri/calcite-components-react"
import UseAppContext from "../../contexts/AppContext"

import "@esri/calcite-components/dist/components/calcite-input-text"
import "@esri/calcite-components/dist/components/calcite-input-number"
import "@esri/calcite-components/dist/components/calcite-dropdown"
import "@esri/calcite-components/dist/components/calcite-dropdown-group"
import "@esri/calcite-components/dist/components/calcite-dropdown-item"

import { useEffect, useState } from "react"

const constructionTypes = [
    "Any",
    "None",
    "Frame",
    "Masonry",
    "Frame and Masonry",
    "Stucco"
]

const radiusTypes = {
    "Eighth Mile": .125,
    "Quarter Mile": .25,
    "Half Mile": .5,
    "Mile": 1,
    "None": "None",
}

const PropertyComparison = () => {

    const { translateText, setComparablePanel,  comparablePanelClosed, primaryResultFeature} = UseAppContext()

    const [ buildingSqFtMin, setBuildingSqFtMin ] = useState(0)
    const [ buildingSqFtMax, setBuildingSqFtMax ] = useState(0)
    const [ landSqFtMin, setLandSqFtMin ] = useState(0)
    const [ landSqFtMax, setLandSqFtMax ] = useState(0)
    const [ constructionTypeValue, setConstructionTypeValue ] = useState(constructionTypes[0])
    const [ ageMax, setAgeMax ] = useState(0)
    const [ ageMin, setAgeMin ] = useState(0)
    const [ radiusTypeValue, setRadiusTypeValue ] = useState(Object.keys(radiusTypes)[0])
    
    useEffect(() => {

        const createRanges = () => {
            if(primaryResultFeature && primaryResultFeature[0] && primaryResultFeature[0].attributes){
                let attributes = primaryResultFeature[0].attributes

                //BUILDING SQUARE FEET
                let parcelBldgSqFt = attributes["BLDGSQFT"]
                if(parcelBldgSqFt){
                    let buildingRange= parcelBldgSqFt * .1
                    setBuildingSqFtMax(parcelBldgSqFt+buildingRange)
                    setBuildingSqFtMin(parcelBldgSqFt-buildingRange  < 0 ? 0 : parcelBldgSqFt-buildingRange)
    
                }

                //LAND SQUARE FEET
                let parcelLandSqFt = attributes["LANDSF"]
                if(parcelLandSqFt){
                    let landRange= parcelLandSqFt * .1
                    setLandSqFtMax(parcelLandSqFt+landRange)
                    setLandSqFtMin(parcelLandSqFt-landRange < 0 ? 0 : parcelLandSqFt-landRange)
                }
                
                //BUILDING AGE
                let buildingAge = attributes["BLDGAGE"]
                if(buildingAge){
                    let ageRange = buildingAge ? 15 : 0
                    setAgeMax(buildingAge+ageRange)
                    setAgeMin(buildingAge-ageRange < 0 ? 0 : buildingAge-ageRange )
                }
                

            }
        }

        createRanges();

    }, [primaryResultFeature])

    return(
        <CalcitePanel 
            id="comparable-panel" 
            closed={comparablePanelClosed} 
            closable 
            className='panel-start' 
            heading={translateText('Comparable Search')} 
            //description= {translateText("Search for similar properties")}
            onCalcitePanelClose={() => {
                setComparablePanel(true)
            }}
            style={{display: comparablePanelClosed ? 'none': 'flex'}}
            >   
            <form 
                //onSubmit={} 
                id="comparable-search"
            >
                <CalciteBlock 
                open 
                heading={translateText("Source Property")}
                description={translateText("some text")}>
                
                    <CalciteLabel>
                        {translateText('Source PIN')}
                        <CalciteInputText
                            form='comparable-search'
                            placeholder={primaryResultFeature ? primaryResultFeature[0].attributes['PIN14_dash']: null}
                            value={primaryResultFeature ? primaryResultFeature[0].attributes['PIN14_dash']: null}
                            readonly
                        />
                    </CalciteLabel>  

                    <CalciteLabel>
                        {translateText('Township')}
                        <CalciteInputText
                            form='comparable-search'
                            placeholder={primaryResultFeature ? primaryResultFeature[0].attributes['township_name']: null}
                            value={primaryResultFeature ? primaryResultFeature[0].attributes['township_name']: null}
                            readonly
                        />
                    </CalciteLabel>  

                    <CalciteLabel>
                        {translateText('Neighborhood')}
                        <CalciteInputText
                            form='comparable-search'
                            placeholder={primaryResultFeature ? primaryResultFeature[0].attributes['NBHD']: null}
                            value={primaryResultFeature ? primaryResultFeature[0].attributes['NBHD']: null}
                            readonly
                        />
                    </CalciteLabel> 

                    <CalciteLabel>
                        {translateText('Property Class')}
                        <CalciteInputText
                            form='comparable-search'
                            placeholder={primaryResultFeature ? primaryResultFeature[0].attributes['BCLASS']: null}
                            value={primaryResultFeature ? primaryResultFeature[0].attributes['BCLASS']: null}
                            readonly
                        />
                    </CalciteLabel> 
                </CalciteBlock>

                <CalciteBlock 
                open 
                heading={translateText("Property Size")}
                description={translateText("some text")}>
                    <CalciteLabel>
                    {translateText('Building Square Feet')}
                    </CalciteLabel>
                    <div style={{display:'flex', gap: 10}}>
                        <CalciteLabel
                        scale="s"
                        >
                            {translateText('Minimum')}
                            <CalciteInputNumber
                                form='comparable-search'
                                //placeholder={buildingSqFtMin}
                                value={`${buildingSqFtMin}`}
                                onCalciteInputNumberChange={(e) =>setBuildingSqFtMin(e.target.value)}
                                min={"0"}
                                max={`${buildingSqFtMax}`}
                                step="1"
                                readonly
                                validationMessage={'test'}
                            />
                        </CalciteLabel>
                        <CalciteLabel
                        scale="s"
                        >
                            {translateText('Maximum')}
                            <CalciteInputNumber
                                form='comparable-search'
                                placeholder={0}
                                value={`${buildingSqFtMax}`}
                                onCalciteInputNumberChange={(e) =>setBuildingSqFtMax(e.target.value)}
                                step="1"
                                min={`${buildingSqFtMin}`}
                                readonly
                            />
                        </CalciteLabel> 
                    </div>

                    <CalciteLabel>
                    {translateText('Land Square Feet')}
                    </CalciteLabel>
                    <div style={{display:'flex', gap: 10}}>
                        <CalciteLabel
                        scale="s"
                        >
                            {translateText('Minimum')}
                            <CalciteInputNumber
                                form='comparable-search'
                                //placeholder={buildingSqFtMin}
                                value={`${landSqFtMin}`}
                                onCalciteInputNumberChange={(e) =>setLandSqFtMin(e.target.value)}
                                min={"0"}
                                max={`${landSqFtMax}`}
                                step="1"
                                readonly
                                validationMessage={'test'}
                            />
                        </CalciteLabel>
                        <CalciteLabel
                        scale="s"
                        >
                            {translateText('Maximum')}
                            <CalciteInputNumber
                                form='comparable-search'
                                placeholder={0}
                                value={`${landSqFtMax}`}
                                onCalciteInputNumberChange={(e) =>setLandSqFtMax(e.target.value)}
                                step="1"
                                min={`${landSqFtMin}`}
                                readonly
                            />
                        </CalciteLabel> 
                    </div>
                </CalciteBlock>

                <CalciteBlock 
                open 
                heading={translateText("Characteristics")}
                description={translateText("some text")}>

                    <CalciteLabel layout="inline">
                        {translateText("Construction Type")}
                    <CalciteDropdown 
                        width="l"
                        onCalciteDropdownSelect={(e) => { console.log(e ); 
                            setConstructionTypeValue(e.target.selectedItems[0].textContent)}}
                    >
                        <CalciteButton form='comparable-search' className="hyperlink-button" width="full" slot="trigger">{translateText(constructionTypeValue)}</CalciteButton>
                        <CalciteDropdownGroup selection-mode="single">
                        {constructionTypes.map((constructionType, i) => {
                            return(
                                <CalciteDropdownItem key={i} label={constructionType}>{translateText(constructionType)}</CalciteDropdownItem>
                            )
                        })}
                        </CalciteDropdownGroup>
                        
                    </CalciteDropdown>
                    </CalciteLabel>

                    <CalciteLabel>
                    {translateText('Building Age')}
                    </CalciteLabel>
                    <div style={{display:'flex', gap: 10}}>
                        <CalciteLabel
                        scale="s"
                        >
                            {translateText('Minimum')}
                            <CalciteInputNumber
                                form='comparable-search'
                                //placeholder={buildingSqFtMin}
                                value={`${ageMin}`}
                                onCalciteInputNumberChange={(e) =>setAgeMin(e.target.value)}
                                min={"0"}
                                max={`${ageMax}`}
                                step="1"
                                readonly
                                validationMessage={'test'}
                            />
                        </CalciteLabel>
                        <CalciteLabel
                        scale="s"
                        >
                            {translateText('Maximum')}
                            <CalciteInputNumber
                                form='comparable-search'
                                placeholder={0}
                                value={`${ageMax}`}
                                onCalciteInputNumberChange={(e) =>setAgeMax(e.target.value)}
                                step="1"
                                min={`${ageMin}`}
                                readonly
                            />
                        </CalciteLabel> 
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', marginTop: '15px' , justifyContent:'space-between'}}>
                    <CalciteLabel layout="inline">
                        {translateText("Search Radius")}
                    <CalciteDropdown 
                        width='l'
                        onCalciteDropdownSelect={(e) => { console.log(e ); 
                            setRadiusTypeValue(e.target.selectedItems[0].textContent)}}
                    >
                        <CalciteButton form='comparable-search' className="hyperlink-button" width="full" slot="trigger">{translateText(radiusTypeValue)}</CalciteButton>
                        <CalciteDropdownGroup selection-mode="single">
                        {Object.entries(radiusTypes).map(([label, value]) => {
                            return(
                                <CalciteDropdownItem key={label} label={value}>{translateText(label)}</CalciteDropdownItem>
                            )
                        })}
                        </CalciteDropdownGroup>
                        
                    </CalciteDropdown>
                    </CalciteLabel>
                    </div>
                    
                    
                    
                </CalciteBlock>
            </form>
                    
    
            <div slot="footer-end" style={{display: "flex", gap: '20px'}}>
                <CalciteButton iconStart="reset" appearance="outline">
                    Reset
                </CalciteButton>
                <CalciteButton iconStart="check" className='hyperlink-button'>
                    Search
                </CalciteButton>
            </div>

               
        </CalcitePanel>
    )
}

export default PropertyComparison