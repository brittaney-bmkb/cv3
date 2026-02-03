import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const headerPath = join(__dirname, "..", "src", "components", "Header", "Header.jsx");
const layoutPath = join(__dirname, "..", "src", "Layout.jsx");
const configPath = join(__dirname, "..", "src", "data", "config.js");

const headerSource = readFileSync(headerPath, "utf8");
const layoutSource = readFileSync(layoutPath, "utf8");
const configSource = readFileSync(configPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// This verifies that translations are wired through the UI and that
// configuration provides translation service URLs.

test("translation workflow uses translateText in UI components", () => {
  assert.ok(headerSource.includes("translateText"));
  assert.ok(layoutSource.includes("translateText"));
});

test("translation workflow config includes translation services", () => {
  assert.ok(configSource.includes("translation_text"));
  assert.ok(configSource.includes("translation_text_help"));
});
