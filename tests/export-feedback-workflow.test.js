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
// Export and feedback are required workflows. This ensures the layout includes
// the components that power those flows.

test("layout workflow includes export and feedback components", () => {
  assert.ok(layoutSource.includes("<Export"));
  assert.ok(layoutSource.includes("<Feedback"));
});
