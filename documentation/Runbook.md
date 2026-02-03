# Runbook

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Access the app at `http://localhost:5173/`.

## Build
1. Run the production build:
   ```bash
   npm run build
   ```
2. Validate the build output in `dist/`.

## Preview Production Build
```bash
npm run preview
```

## Operational Checks
- Confirm ArcGIS services and map layers load without errors.
- Verify search results populate and panels update when selecting parcels.
- Confirm export/print flows complete without errors.
- Validate translations for core UI elements.

## Known Dependencies
- ArcGIS Online/Portal services for map layers, data dictionary, and translations.
- Print and feedback services for external workflows.

## Troubleshooting
- **Map fails to load**: verify the webmap ID and ArcGIS service availability.
- **Search returns no results**: check layer source URLs and locator services in config.
- **Translations missing**: confirm translation services are reachable and valid.
