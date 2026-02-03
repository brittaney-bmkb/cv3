# Rollback (Runback) Guide

## When to Roll Back
- Critical production outage or severe performance regression.
- Accessibility regression that prevents core workflows.
- Data integrity issues (incorrect parcel data, wrong layer sources).

## Rollback Steps
1. Identify the last known good release (tag/commit) in version control.
2. Re-deploy that release through the same deployment workflow.
3. Confirm the application loads and key workflows function (search, map, panels, print/export).
4. Document the rollback reason and open a follow-up issue for the regression.

## Post-Rollback Validation Checklist
- Map initializes and renders expected layers.
- Search returns parcel results and updates the map.
- Property details panel renders correct data.
- Export and print functions complete.
- Translation and help content are available.
