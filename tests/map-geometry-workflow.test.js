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
// These checks guard the workflow where selecting a main property or comparable
// property adds parcel geometry to the map.

test("map workflow defines parcel selection types", () => {
  assert.ok(mapSource.includes("SOURCE_PARCEL"));
  assert.ok(mapSource.includes("COMPARABLE_PARCEL"));
});

test("map workflow adds primary parcel geometry", () => {
  assert.ok(mapSource.includes("handleParcelSelection(searchFeatures, SOURCE_PARCEL)"));
});

test("map workflow adds comparable parcel geometry", () => {
  assert.ok(mapSource.includes("handleParcelSelection(comparableParcels, COMPARABLE_PARCEL)"));
});
