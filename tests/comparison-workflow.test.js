import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const propertyDetailPath = join(
  __dirname,
  "..",
  "src",
  "components",
  "Panel",
  "PanelPropertyDetail.jsx"
);
const comparisonPath = join(
  __dirname,
  "..",
  "src",
  "components",
  "PropertyComparison",
  "PropertyComparison.jsx"
);
const comparisonResultsPath = join(
  __dirname,
  "..",
  "src",
  "components",
  "PropertyComparison",
  "ListComparisonResults.jsx"
);

const propertyDetailSource = readFileSync(propertyDetailPath, "utf8");
const comparisonSource = readFileSync(comparisonPath, "utf8");
const comparisonResultsSource = readFileSync(comparisonResultsPath, "utf8");

// NOTE FOR JUNIOR DEVS:
// Workflow covered:
// 1) From property details, user clicks "Compare".
// 2) Comparison panel opens with steps (Search -> Results -> Property).
// 3) Clicking a comparison result advances to the property detail step.

test("property details exposes compare action", () => {
  assert.ok(propertyDetailSource.includes("comparable_properties"));
  assert.ok(propertyDetailSource.includes("togglePanel('compare')"));
});

test("comparison panel includes stepper flow", () => {
  assert.ok(comparisonSource.includes("CalciteStepper"));
  assert.ok(comparisonSource.includes("heading={translateText(\"Search\")}"));
  assert.ok(comparisonSource.includes("heading={translateText(\"Results\")}"));
  assert.ok(comparisonSource.includes("heading={translateText(\"Property\")}"));
});

test("comparison results advance to property detail", () => {
  assert.ok(comparisonResultsSource.includes("setSecondaryResultFeature"));
  assert.ok(comparisonResultsSource.includes("setCurrentStep(2)"));
});
