import { Box, Collapse, Dialog, DialogContent, DialogTitle, 
    Divider, IconButton, Input, Stack, Switch, TextField, Typography, Button, useTheme } from "@mui/material"

import { theme } from "../../theme"
import SelectDropdown from "../SelectDropdown/SelectDropdown"
import { config } from "../../data/config"
import { CloseOutlined } from "@mui/icons-material"

import AppImages from "../AppImages/AppImages.js";
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react';
// Inside your component
import UseAppContext from "../../contexts/AppContext"


const Modal = ({ imageUrl, onClose }) => {
    const {translateText} = UseAppContext()

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5px',
                maxWidth: '80%',
                maxHeight: '80%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column', // Change to column layout
                position: 'relative' // Add this to set the position for the close button
            }}>
                <img src={imageUrl} alt="Enlarged Image" style={{ maxWidth: '100%', maxHeight: 'calc(80% - 20px)'  }} />
                <Divider style={{ margin: '10px 0' }} /> {/* Add margin to the divider */}
                <div style={{ marginTop: '10px', alignSelf: 'flex-end' }}> {/* Position close button on the right */}
                    <Button variant="text" onClick={onClose} sx={{ textTransform: 'none' }}>
                        <Typography variant="h5" color={theme.palette.primary.main}>
                            {translateText("Close")}
                        </Typography>
                    </Button>
                </div>                
            </div>
            
        </div>
    );
}

const HelpContent = ({display}) => {

    const isMobile = useMediaQuery('(max-width:600px)');

    const [modalOpen, setModalOpen] = useState(false);
    const [enlargedImageUrl, setEnlargedImageUrl] = useState('');

    const handleImageClick = (imageUrl) => {
        setEnlargedImageUrl(imageUrl);
        setModalOpen(true);
    };    

    switch(display){
        case 0:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark}> Cook Viewer Help Menu  </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                <Typography variant="body1" color={theme.main.text.dark}>                                
                                    <p>
                                        We're here to assist you in navigating through the CookViewer, your gateway to exploring the rich geographical parcel data of Cook County, Illinois. Whether you're a seasoned user or just getting started, our menu offers a variety of options to guide you through your journey.
                                    </p>
                                    <p>
                                        🗺️ Explore Map Features: Discover the diverse functionalities available on the CookViewer platform. From searching for addresses to comparable property tools, unleash the full potential of our mapping tools.
                                    </p>
                                    <p>
                                        🔍 Find What You Need: Need assistance locating a parcel? Our search function is at your service. Simply input your query, and let us help you find what you're looking for.
                                    </p>
                                    {/* <p>
                                        📚 Access Resources: Dive deeper into the world of geographic data with our collection of resources. Whether you're seeking tutorials, documentation, or additional information, we've got you covered.
                                    </p> */}
                                    <p>
                                        🙋‍♂️ Get Support: Have questions, encountering issues, have a suggestion? Our support team is here to provide assistance. 
                                        Feel free to reach out for help by submitting feedback, and we'll do our best to ensure your experience with the CookViewer is seamless.    
                                    </p>
                                    <p>
                                        Start exploring now and unlock the wealth of information that CookViewer has to offer!
                                    </p>
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                </Box>
            )        
        case 1:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Navigation Bar </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            {isMobile 
                                ? <Typography variant="body1" color={theme.main.text.dark}> In the navigation bar you can find the search bar, and 
                                    <Box component="span" sx={{fontWeight: 'bold'}}> Help - Feedback - Translate 
                                    </Box> can be found in the top left hamburger icon. </Typography>  
                                : <Typography variant="body1" color={theme.main.text.dark}>
                                    The navigation bar at the top of the screen includes:
                                </Typography> } 

                                <ul>
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> Search bar - description below. </Typography> </li>
                                    
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> Help button - this dialog box you are currently viewing.</Typography> </li>
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> Feedback button - opens a survey to submit feedback.</Typography> </li>
                                    <li> <Typography variant="body1" color={theme.main.text.dark}> Translate button - which allows the user to select the language used in the map. </Typography> </li>
                                    
                                    

                                </ul>
                            </Box>
                            <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                                <img 
                                    src={isMobile ? AppImages.navbar_mobile : AppImages.navbar_desktop} 
                                    alt="Navigation Bar Image" 
                                    style={{ maxWidth: "100%", height: "auto" }}
                                    onClick={() => handleImageClick(isMobile ? AppImages.navbar_mobile : AppImages.navbar_desktop)}
                                />
                            </Box> 

                        </Box>
                    </DialogContent>
                        {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.navbar_mobile : AppImages.navbar_desktop}  onClose={() => setModalOpen(false)} />}   
                </Box>
            )

        case 2:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Search </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                    <Typography variant="body1" color={theme.main.text.dark}>
                                        There are a few different ways to search for a location on the map: The search bar at the top of the screen will accept:
                                    </Typography>
                                        <ul>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 10 digit PIN (1709461015) </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 14 digit PIN (17094610150000) </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> 14 digit PIN with dashes (17-09-461-015-0000) </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> Property Address (69 W Washington, Chicago) </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> Street Intersection (W Washington St & N Dearborn)</Typography> </li>
                                        </ul>
                                    <Typography variant="body1" color={theme.main.text.dark}>
                                        The results of your search will be displayed in the Property Results panel. Click on the desired result to view its details and the map will zoom to that location.
                                    </Typography>                                    
                            </Box>
                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? AppImages.widget_search_mobile : AppImages.widget_search_desktop} 
                                alt="Horizontal Search Bar that allows users to search by pin or address. Image" 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? AppImages.widget_search_mobile : AppImages.widget_search_desktop)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.widget_search_mobile : AppImages.widget_search_desktop}  onClose={() => setModalOpen(false)} />}                    
                </Box>
            )


        case 3:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Property Results </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                <Typography variant="body1" color={theme.main.text.dark}>
                                After selecting the property you'll be taken to a window with property information. For each property, information is displayed in the Property Results panel. 
                                The top of the panel includes a Result count that displays before selecting a property as well as Clear, Export and Feedback buttons that persist within a selected property result.
                                </Typography>
                                    <ul>
                                        <li> <Typography variant="body1" sx={{padding:0}}> <Box component="span" sx={{fontWeight: 'bold'}}>Location </Box> describes the Township, Municipality, Zoning Information, and Find My District, below which is a link (Political Districts) that opens the Find My District application in a new tab displaying all the political districts a property falls within. </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}>Property Comparison</Box>  includes two different kinds of property comparison searches:</Typography> </li>
                                        {/* <ul>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}>Compare Properties</Box> button will begin a search based on any combination of comparison criteria. Details about this workflow are below. </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}>Nearby Parcels</Box>  button will select the parcels within a user-defined distance around the property. </Typography> </li>

                                        </ul> */}
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Tax Details </Box> describes the Property Classification, Land Square Footage, Assessor Neighborhood, and Assessor Property Details which is a link that opens the Assessor Website in a new tab displaying information for the selected property. </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Assessed Value </Box> Assessed Value includes Current Value Description, Total Assessed Value, Land Value, Building Value, and Historical Assessed Values, which is a link that opens the Cook County Open Data portal in a new tab displaying the information for the selected property. </Typography> </li>

                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Building Characteristics </Box> includes the Estimated Building Square Footage, Construction Type, and Age. </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Imagery </Box>  includes links to the Oblique Imagery Viewer, a display tool for aerial images from a 45-degree angle view, and Historical Photo, a separate tool displaying a historical ground photo image of the property. </Typography> </li>
                                        {/* <ul>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> The Oblique Imagery Viewer link opens a new tab that displays the aerial images from a 45-degree angle view. You can browse these aerial photos from Overhead, Looking North, Looking East, Looking South, and Looking West. </Typography> </li>
                                            <li> <Typography variant="body1" color={theme.main.text.dark}> The Historical Photo link opens a new tab displaying a historical ground photo image of the property. </Typography> </li>
                                        </ul> */}
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Data and Resources </Box>  includes links to Clerk Property Records Search, Cook County Property Tax Portal, Historical Single and Multi-Family Improvement Characteristics, and Historical Residential Condominium Unit Characteristics. </Typography> </li>
                                    </ul>                                  
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? AppImages.property_results_mobile : AppImages.property_results_desktop} 
                                alt="Property Results Image" 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? AppImages.property_results_mobile : AppImages.property_results_desktop)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.property_results_mobile : AppImages.property_results_desktop}  onClose={() => setModalOpen(false)} />}                    
                </Box>
            )

        case 4:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Compare Properties </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            <Typography variant="body1" color={theme.main.text.dark}>
                                Clicking on the Comparable Properties button you'll will fill out a form. Once these parameters are set, the user can click “Search” and will receive a list of comparable properties much like the results of the initial property search. 
                                The top of the panel includes a Result count that displays before selecting a property as well as Clear, Export and Feedback buttons that persist within a selected property result.
                            </Typography>
                            {/* <ul>
                                <li> <Typography variant="body1" color={theme.main.text.dark}> Clear: clear the property results. </Typography> </li>
                                <li> <Typography variant="body1" color={theme.main.text.dark}>Export: export the property results. Choose to export property details, a map of the property, or both.</Typography> </li>
                                <li> <Typography variant="body1" color={theme.main.text.dark}> Feedback: opens a survey to submit feedback. </Typography> </li>
                            </ul> */}
                            <br/>
                            <Typography variant="body1" color={theme.main.text.dark}>
                                Selecting a property will open the Property Details that can be compared to the originally selected property. 
                                At the bottom of the pane, there are back and next arrows that allow the user to flip between the details of each comparable property.
                                </Typography>                                    
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? AppImages.compare_mobile : AppImages.compare_desktop} 
                                alt="Compare Properties Image" 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? AppImages.compare_mobile : AppImages.compare_desktop)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.compare_mobile : AppImages.compare_desktop}  onClose={() => setModalOpen(false)} />}                    
                </Box>
            )

        case 5:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Measure </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                <Typography variant="body1" color={theme.main.text.dark}>
                                    The measure tool allows you to calculate an estimated area, distance or XY location. Once the desired measurement type and measurement units are 
                                    selected you can click on the map to find your measurement. As you click on the map you will create a vertex for the line or area that you want to 
                                    measure and when you have finished drawing the line or area you want to measure double click and the final measurement will be displayed in the tool window.
                                </Typography>                                 
                            </Box>

                            {/* <Box flex={2} display="flex" justifyContent="center" alignItems="center" padding= '10px'>
                                <img 
                                    src={isMobile ? AppImages.navbar_mobile : AppImages.widget_search_desktop} 
                                    alt="Navigation Bar Image" 
                                    style={{ maxWidth: "110%" }} 
                                />
                            </Box> */}
                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? AppImages.widget_measure_mobile : AppImages.widget_measure_desktop} 
                                alt="Measure Widget Image" 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? AppImages.widget_measure_mobile : AppImages.widget_measure_desktop)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.widget_measure_mobile : AppImages.widget_measure_desktop}  onClose={() => setModalOpen(false)} />}                    
                </Box>
            )

        case 6:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Layers </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            <Typography variant="body1" color={theme.main.text.dark}>
                                Provides the user with the option to add more layers to the map from a curated list of layers.
                            </Typography>                                  
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? AppImages.widget_layers_mobile : AppImages.widget_layers_desktop} 
                                alt="Layers Widget Image" 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? AppImages.widget_layers_mobile : AppImages.widget_layers_desktop)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.widget_layers_mobile : AppImages.widget_layers_desktop}  onClose={() => setModalOpen(false)} />}                    
                </Box>
            )

        case 7:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Basemaps </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            <Typography variant="body1" color={theme.main.text.dark}>
                                Provides the user with the option to select a different basemap from a curated list.
                            </Typography>                                  
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? AppImages.widget_basemaps_mobile : AppImages.widget_basemaps_desktop} 
                                alt="Basemaps Widget Image" 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? AppImages.widget_basemaps_mobile : AppImages.widget_basemaps_desktop)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.widget_basemaps_mobile : AppImages.widget_basemaps_desktop}  onClose={() => setModalOpen(false)} />}                    
                </Box>
            )
        case 8:
            return(
                <Box>
                    <DialogTitle>
                        <Typography variant="h2" color={theme.main.text.dark} > Print </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                            <Box flex={1} mr={{ xs: 2, md: 0 }}>
                            
                            <Typography variant="body1" color={theme.main.text.dark}>
                                Click the print tool and follow the dialog to print a pdf of the displayed map.
                            </Typography>                                   
                            </Box>

                        <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                            <img 
                                src={isMobile ? AppImages.widget_print_mobile : AppImages.widget_print_desktop} 
                                alt="Print Widget Image" 
                                style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                onClick={() => handleImageClick(isMobile ? AppImages.widget_print_mobile : AppImages.widget_print_desktop)} // Call handleImageClick when the image is clicked
                            />
                        </Box>
                        </Box>
                    </DialogContent>
                {/* Modal Component */}
                {modalOpen && <Modal imageUrl={isMobile ? AppImages.widget_print_mobile : AppImages.widget_print_desktop}  onClose={() => setModalOpen(false)} />}                    
                </Box>
            )
            case 9:
                return(
                    <Box>
                        <DialogTitle>
                            <Typography variant="h2" color={theme.main.text.dark} > Clear, Export and Feedback </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box display="flex" flexDirection={{ xs: 'column', md: 'column' }} alignItems="center">
                                <Box flex={1} mr={{ xs: 2, md: 0 }}>
                                
                                    <Typography variant="body1" color={theme.main.text.dark}>
                                    The top of the panels you'll see Clear, Export and Feedback buttons that persist within a selected property result. You can also find a feedback button at the top right on the navigation panel in the app. 
                                    </Typography>    
                                    <ul>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Clear: </Box> clears the property results in the selected panel. </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Export: </Box> export the property results. Choose to export property details, a map of the property, or both. </Typography> </li>
                                        <li> <Typography variant="body1" color={theme.main.text.dark}> <Box component="span" sx={{fontWeight: 'bold'}}> Feedback: </Box> opens a survey to submit feedback. </Typography> </li>                                        
                                    </ul> 
                                </Box>
    
                            <Box flex={6} display="flex" justifyContent="center" padding= '20px' alignItems="center">
                                <img 
                                    src={isMobile ? AppImages.user_buttons_desktop : AppImages.user_buttons_desktop} 
                                    alt="Clear, Export, & Feedback Button Image" 
                                    style={{ width: "100%", height: "auto", cursor: "pointer" }}
                                    onClick={() => handleImageClick(isMobile ? AppImages.user_buttons_desktop : AppImages.user_buttons_desktop)} // Call handleImageClick when the image is clicked
                                />
                            </Box>
                            </Box>
                        </DialogContent>
                    {/* Modal Component */}
                    {modalOpen && <Modal imageUrl={isMobile ? AppImages.user_buttons_desktop : AppImages.user_buttons_desktop}  onClose={() => setModalOpen(false)} />}                    
                    </Box>
                )
        default:
            return null
    }
}

export default HelpContent
