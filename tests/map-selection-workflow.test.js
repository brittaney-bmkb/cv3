import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mapPath = join(__dirname, "..", "src", "components", "Map", "Map.jsx");
const mapSource = readFileSync(mapPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// These assertions verify that the map selection workflow is present:
// - the arcgis-map element is used
// - click handling is registered
// - parcel selection constants are defined

test("map selection workflow listens for view clicks", () => {
  assert.ok(mapSource.includes("arcgis-map"));
  assert.ok(mapSource.includes("onarcgisViewClick"));
  assert.ok(mapSource.includes("SELECTED_PARCEL"));
});

// NOTE FOR JUNIOR DEVS:
// The map view is initialized from a web map ID in config. This is the current
// behavior that the performance migration will eventually replace.

test("map workflow references the configured webmap id", () => {
  assert.ok(mapSource.includes("item-id={config.webmap_id}"));
});
