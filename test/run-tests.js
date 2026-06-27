const fs = require("fs");
const path = require("path");
const { createTypeResolverContext } = require("../out/src/parser/typeResolver");
const {
  extractClassesFromSourceFile,
  flattenGeneratedClasses,
} = require("../out/src/parser/astWalker");
const { formatCssClasses } = require("../out/src/services/formatter");

function extractFixture(name) {
  const file = path.resolve(__dirname, "fixtures", `${name}.tsx`);
  const text = fs.readFileSync(file, "utf8");
  const { checker, sourceFile } = createTypeResolverContext(file, text);

  return flattenGeneratedClasses(
    extractClassesFromSourceFile(sourceFile, checker),
  );
}

function normalizeExpected(css) {
  return css.replace(/\n$/, "");
}

function assertEqual(name, actual, expected) {
  if (actual !== expected) {
    throw new Error(
      `${name} failed.\nExpected:\n${expected}\n\nActual:\n${actual}`,
    );
  }
}

for (const name of ["simple", "template"]) {
  const actual = formatCssClasses(extractFixture(name));
  const expected = normalizeExpected(
    fs.readFileSync(path.resolve(__dirname, "expected", `${name}.css`), "utf8"),
  );
  assertEqual(name, actual, expected);
}

assertEqual(
  "imported",
  extractFixture("imported").join(","),
  "button-sm,button-md,button-lg",
);
assertEqual(
  "nested",
  extractFixture("nested").join(","),
  "root,button-solid,button-ghost",
);

console.log("All tests passed.");
