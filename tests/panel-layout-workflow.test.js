import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const layoutPath = join(__dirname, "..", "src", "Layout.jsx");
const layoutSource = readFileSync(layoutPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// The shell layout drives most UI workflows. These checks ensure the left/right
// panels and key feature panels are wired in the layout.

test("layout workflow renders calcite shell panels", () => {
  assert.ok(layoutSource.includes("CalciteShell"));
  assert.ok(layoutSource.includes("CalciteShellPanel"));
  assert.ok(layoutSource.includes("panel-start"));
  assert.ok(layoutSource.includes("panel-end"));
});

test("layout workflow includes key panel components", () => {
  assert.ok(layoutSource.includes("PanelInfo"));
  assert.ok(layoutSource.includes("PanelSearchResults"));
  assert.ok(layoutSource.includes("PanelPropertyDetail"));
  assert.ok(layoutSource.includes("Layers"));
  assert.ok(layoutSource.includes("Imagery"));
  assert.ok(layoutSource.includes("Measure"));
  assert.ok(layoutSource.includes("Print"));
  assert.ok(layoutSource.includes("Select"));
});
