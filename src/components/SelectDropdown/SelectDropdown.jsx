import { MenuItem, Select } from "@mui/material"

const SelectDropdown = ({labelId, id, value, label, handleChange, items}) => {

    const menuItems = items.map((item) => (
        <MenuItem value={item}>{item}</MenuItem>
    ))

    return(
        <Select labelId={labelId} id={id} value={value} label={label} onChange={handleChange}>
            {menuItems}
        </Select>
    )
}

export default SelectDropdown