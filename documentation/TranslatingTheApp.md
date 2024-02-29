**Translating CookViewer-3**

**Action:** Click or tap the translate button and select a language.

**Process:**

**Step 0: Application Initialization**
- Upon app load, the language variable is set to the default language specified in the `config.defaultLanguage` within the `data/config.js` file.
- The translation dataset is imported from ArcGIS Online CookViewer Translated Text hosted table: [CookViewer Translated Text](https://services2.arcgis.com/I5Or36sMcO7Y9vQ3/ArcGIS/rest/services/cookviewer_translated_text/FeatureServer/2).
- The initialization process takes place during the app's initial load through the last `useEffect` hook in `AppContext.jsx`. The `initializeTranslationText()` function is executed, triggering the `returnTranslatedText` function from `'../translation/handleTranslation'`. This returns an object containing English and Spanish translations for all text in the application. The `readFeatureLayerData` function is also executed to retrieve records from the `cookviewer_translated_text` hosted table, which are then passed to the `returnTranslatedText` function.
- Once the translated text is returned, the `translationDictionary` variable is set using the `setTranslationDictionary()` function. The app is now ready to perform string replacements when the language global variable is updated.

**Step 1: Navigation Bar Button or Menu Item Click Event**
- The `onClick` prop in the `NavBar.jsx` component triggers the opening of the `TranslateMenu.jsx` dialog box, allowing the user to select a language.

**TranslateMenu.jsx Section:**
- The `TranslateMenu.jsx` component handles the translation menu dialog.
- It imports context variables like `translateDialogOpen`, `setTranslateDialogOpen`, and `setLanguage` from the `AppContext`.
- The `handleClose` function is executed when the dialog is closed, setting `translateDialogOpen` to `false`.
- The `onClick` function, triggered by selecting a language, sets the new language and closes the dialog.
- The dialog displays language options (e.g., English and Español) with corresponding buttons.