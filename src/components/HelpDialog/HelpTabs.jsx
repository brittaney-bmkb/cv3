import { Box, Tabs, Tab,  Typography, Dialog, DialogContent, DialogTitle, } from "@mui/material"
import { theme } from "../../theme"

import * as React from 'react';
import PropTypes from 'prop-types';
import HelpContent from "./HelpContext";
import UseAppContext from "../../contexts/AppContext";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

return (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
    >
        {value === index && (
            <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
            </Box>
        )}
    </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}
const HelpTabs = () => {

    const [value, setValue] = React.useState(0);
    const {translateText} = UseAppContext()
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            <Box >
                <Tabs
                    variant="scrollable"
                    allowScrollButtonsMobile
                    scrollButtons
                    value={value}
                    onChange={handleChange}
                    aria-label="help navigation bars"
                >
                
                    <Tab label={translateText("Overview")} sx={{ textTransform: "none" }} {...a11yProps(0)}  />
                    <Tab label={translateText("Navigation")}  sx={{ textTransform: "none" }} {...a11yProps(1)}  />
                    <Tab label={translateText("Search ")} sx={{ textTransform: "none" }} {...a11yProps(2)} />
                    <Tab label={translateText("Property Results")}  sx={{ textTransform: "none" }}{...a11yProps(3)} />
                    <Tab label={translateText("Compare Properties")} sx={{ textTransform: "none" }} {...a11yProps(4)} wrapped />
                    <Tab label={translateText("Measure")} sx={{ textTransform: "none" }} {...a11yProps(5)} />
                    <Tab label={translateText("Layers")} sx={{ textTransform: "none" }} {...a11yProps(6)} />
                    <Tab label={translateText("Basemaps")} sx={{ textTransform: "none" }} {...a11yProps(7)} />
                    <Tab label={translateText("Print")} sx={{ textTransform: "none" }} {...a11yProps(8)} />
                    <Tab label={translateText("Clear, Export, Feedback")} sx={{ textTransform: "none" }} {...a11yProps(9)} />
                
                </Tabs>
            </Box>

                <TabPanel value={value} index={0} id="tab1" >
                    <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={1} >
                    <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={6}>
                <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={7}>
                    <HelpContent display={value} />
                </TabPanel>
                <TabPanel value={value} index={8}>
                    <HelpContent display={value} />
                </TabPanel>   
                <TabPanel value={value} index={9}>
                    <HelpContent display={value} />
                </TabPanel>                                
    </Box>
        );

}

export default HelpTabs