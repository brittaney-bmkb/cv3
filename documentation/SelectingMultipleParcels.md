# Cookviewer Technical Documentation

## Methods for selecting Multiple parcels
last updated: 2024-08-19

- [Background](#background)
- [Approach](#approach)
- [Selecting parcels with Click](#selecting-parcels-with-click)
- [Selecting parcels with Draw](#selecting-parcels-with-draw)
  
## Background
The ability to select multiple parcels was requested multiple times in feedback during the beta process. In the previous version of CookViewer the user could draw a rectangle and intersecting parcels would be selected. 

## Approach
This tool was built using the SketchViewModel.js. The user will have the ability to click single parcels or draw a polygon to select intersecting parcels.

## Selecting parcels with Click

### Process

#### Step 1: User selects the multiple parcel tool and selects the 'Click' option
User clicks Select Mulitiple Parcels button then 'Click' button in the Select Multiple Parcels Dialog box. This changes the pointer to a hand with the tooltip "select/deselect parcel".

#### Step 2: User selects parcels
User clicks on parcels one at a time. Each parcel is added to the selection in the Property Results pane and the url parameters update with each PIN14.

#### Step 3: Finishing selection
Once the user is done selecting parcels, they click the 'Done' button and this deactivates the selection tool. The pointer returns to normal and no new selections are made.

#### Step 4: URL Parameter Updates with selected PIN14's
When a selected parcel is selected in the Property Results pane, the url updates to the selected parcel. When the user clicks back, the previously selected parcels are re-selected and the url updates with those PINs again.

#### Step 5: Adding to selection or choosing to 'Start New'
The user can choose to continue to add to the selected parcels by clicking on the 'Click' button again. The user can clear the selection by clicking the 'Start New' text.

## Selecting parcels with Draw

### Process

#### Step 1: User selects the multiple parcel tool and selects the 'Draw' option
User clicks Select Mulitiple Parcels button then 'Draw' button in the Select Multiple Parcels Dialog box. This changes the pointer to a cross with the tooltip "set first point".

#### Step 2: User draws polygon
User clicks multiple times creating a polygon. The tooltip says "double click to complete"

#### Step 3: Selection is made based on drawing
After double clicking, drawing is deactivated and the user clicks the done button to initiate a selection of intersecting parcels.

#### Step 4: URL Parameter Updates with selected PIN14's
The url updates with the selected parcels. When a selected parcel is selected in the Property Results pane, the url updates to the selected parcel. When the user clicks back, the previously selected parcels are re-selected and the url updates with those PINs again.

#### Step 5: Choosing to 'Start New'
Unlike the Click selection method, the user cannot choose to continue to add to the selected parcels. If the user wants to add to the selection they will need to draw a new polygon. The user can clear the selection by clicking the 'Start New' text.



