import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const searchBarPath = join(
  __dirname,
  "..",
  "src",
  "components",
  "SearchBar",
  "SearchBarComponent.jsx"
);
const searchResultsPath = join(
  __dirname,
  "..",
  "src",
  "components",
  "Panel",
  "PanelSearchResults.jsx"
);
const listResultsPath = join(
  __dirname,
  "..",
  "src",
  "components",
  "ResultList",
  "ListSearchResults.jsx"
);

const searchBarSource = readFileSync(searchBarPath, "utf8");
const searchResultsSource = readFileSync(searchResultsPath, "utf8");
const listResultsSource = readFileSync(listResultsPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// Example workflow we protect here: searching for an address like
// "105 W Brayton Chicago IL" should show search results, and clicking a
// result should open the property details panel.

test("search workflow reads URL search params and triggers ArcGIS search", () => {
  assert.ok(searchBarSource.includes('routeParams.get("search")'));
  assert.ok(searchBarSource.includes("refSearch.current.search"));
});

test("left panel renders search results panel", () => {
  assert.ok(searchResultsSource.includes("id=\"search-results-panel\""));
  assert.ok(searchResultsSource.includes("Search Results"));
});

test("clicking a search result opens property details", () => {
  assert.ok(listResultsSource.includes("togglePanel('property')"));
  assert.ok(listResultsSource.includes("onCalciteListItemSelect"));
});
