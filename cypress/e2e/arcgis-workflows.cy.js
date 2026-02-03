// NOTE FOR JUNIOR DEVS:
// Run the dev server first (npm run dev) or set E2E_BASE_URL.

describe("ArcGIS workflows", () => {
  it("search -> property details -> compare flow", () => {
    cy.visit("/");

    cy.get("arcgis-search").then(($search) => {
      const search = $search[0];
      search.searchTerm = "105 W Brayton Chicago IL";
      return search.search(search.searchTerm);
    });

    cy.get("#search-results-panel", { timeout: 60000 }).should("be.visible");
    cy.get("calcite-list-item").first().click();

    cy.get("#property-detail-panel", { timeout: 60000 }).should("be.visible");
    cy.get("#comparable_properties-button").click();

    cy.get("#comparable-panel", { timeout: 60000 }).should("be.visible");
    cy.contains("button", /search/i).click();

    cy.get("#comparable-panel calcite-list-item", { timeout: 60000 })
      .first()
      .click();

    cy.get("#comparable-panel").should("contain.text", "Property");
  });
});
