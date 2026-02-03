import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const reducerPath = join(__dirname, "..", "reducers", "AppReducer.js");
const reducerSource = readFileSync(reducerPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// We scan the reducer source to ensure critical action handlers exist.
// This avoids importing ArcGIS-dependent modules in node-based tests.
test("AppReducer declares core panel action handlers", () => {
  assert.ok(reducerSource.includes("SET_INFO_PANEL"));
  assert.ok(reducerSource.includes("SET_SEARCH_RESULTS_PANEL"));
  assert.ok(reducerSource.includes("SET_PROPERTY_DETAIL_PANEL"));
});

test("AppReducer declares search and language action handlers", () => {
  assert.ok(reducerSource.includes("SET_SEARCH_RESULT"));
  assert.ok(reducerSource.includes("SET_SEARCH_SOURCES"));
  assert.ok(reducerSource.includes("SET_LANGUAGE"));
});

test("AppReducer has a default error for unknown actions", () => {
  assert.ok(reducerSource.includes("No valid selection made"));
});
