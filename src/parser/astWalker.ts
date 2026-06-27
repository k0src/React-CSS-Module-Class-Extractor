import ts from "typescript";
import { ExtractedClass } from "../models/ExtractedClass";
import { OrderedSet } from "../utils/orderedSet";
import { visitCssModuleReference } from "./nodeVisitors";

export function extractClassesFromSourceFile(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
): ExtractedClass[] {
  const extracted: ExtractedClass[] = [];
  const generatedClassNames = new OrderedSet<string>();

  function visit(node: ts.Node): void {
    const cssClass = visitCssModuleReference(node, checker);

    if (cssClass) {
      const before = generatedClassNames.toArray().length;
      generatedClassNames.addMany(cssClass.generatedClasses);

      if (generatedClassNames.toArray().length > before) {
        extracted.push(cssClass);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return extracted;
}

export function flattenGeneratedClasses(
  extractedClasses: ExtractedClass[],
): string[] {
  const ordered = new OrderedSet<string>();

  for (const extractedClass of extractedClasses) {
    ordered.addMany(extractedClass.generatedClasses);
  }

  return ordered.toArray();
}
