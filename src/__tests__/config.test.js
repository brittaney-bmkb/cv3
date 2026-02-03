import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// NOTE FOR JUNIOR DEVS:
// These tests are lightweight "contract" checks. They ensure the required
// configuration keys exist so critical app workflows (map, search, translations)
// are wired before runtime.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, "..", "data", "config.js");
const configSource = readFileSync(configPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// We parse the config file as plain text to avoid loading ArcGIS modules during
// node-based tests (they expect a browser-like environment).
test("config defines required map and layer configuration", () => {
  assert.ok(configSource.includes("webmap_id"));
  assert.ok(configSource.includes("target_layer_url"));
  assert.ok(configSource.includes("target_layer_id_field"));
});

test("config defines translation services for supported languages", () => {
  assert.ok(configSource.includes("languages"));
  assert.ok(configSource.includes("english"));
  assert.ok(configSource.includes("spanish"));
  assert.ok(configSource.includes("translation_text"));
  assert.ok(configSource.includes("translation_text_help"));
});

test("config defines locator sources for search", () => {
  assert.ok(configSource.includes("locator_search_sources"));
});
