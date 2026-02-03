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
const headerPath = join(__dirname, "..", "src", "components", "Header", "Header.jsx");
const configPath = join(__dirname, "..", "src", "data", "config.js");

const searchBarSource = readFileSync(searchBarPath, "utf8");
const headerSource = readFileSync(headerPath, "utf8");
const configSource = readFileSync(configPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// This test ensures the search workflow is wired: the header renders the search
// component, the ArcGIS search element is present, and config includes locator
// sources for address-based searches.

test("search workflow wires the search bar and locator sources", () => {
  assert.ok(headerSource.includes("SearchBarComponent"));
  assert.ok(searchBarSource.includes("arcgis-search"));
  assert.ok(searchBarSource.includes("onarcgisComplete"));
  assert.ok(configSource.includes("locator_search_sources"));
});
