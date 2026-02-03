import { test, expect } from "@playwright/test";

// NOTE FOR JUNIOR DEVS:
// This test runs the real app in a browser. Start the app with `npm run dev`
// before running Playwright, or set E2E_BASE_URL to a deployed environment.

test("search -> property details -> compare flow", async ({ page }) => {
  await page.goto("/");

  // Trigger ArcGIS search with a real address.
  await page.evaluate(async () => {
    const search = document.querySelector("arcgis-search");
    if (!search) throw new Error("arcgis-search not found");
    search.searchTerm = "105 W Brayton Chicago IL";
    await search.search(search.searchTerm);
  });

  const searchPanel = page.locator("#search-results-panel");
  await expect(searchPanel).toBeVisible({ timeout: 60000 });

  const firstResult = page.locator("calcite-list-item").first();
  await firstResult.click();

  const propertyPanel = page.locator("#property-detail-panel");
  await expect(propertyPanel).toBeVisible({ timeout: 60000 });

  // Click the Compare Properties button inside Property Details.
  const compareButton = page.locator("#comparable_properties-button");
  await compareButton.click();

  const comparePanel = page.locator("#comparable-panel");
  await expect(comparePanel).toBeVisible({ timeout: 60000 });

  // Trigger the comparison search (uses default form values).
  const compareSearchButton = comparePanel.getByRole("button", { name: /search/i });
  await compareSearchButton.click();

  // Wait for comparison results, then select the first result.
  const comparisonResult = comparePanel.locator("calcite-list-item").first();
  await expect(comparisonResult).toBeVisible({ timeout: 60000 });
  await comparisonResult.click();

  // The comparison stepper should be in the Property step after selection.
  await expect(comparePanel).toContainText(/Property/i);
});
