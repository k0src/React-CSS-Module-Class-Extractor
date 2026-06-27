import ts from "typescript";
import { ExtractedClass, TemplateVariable } from "../models/ExtractedClass";
import { ResolvedUnion } from "../models/ResolvedUnion";
import { cartesianProduct } from "../utils/cartesian";
import { getExpressionPlaceholder } from "../utils/stringUtils";
import { resolveStringLiteralUnion } from "./typeResolver";

interface TemplatePart {
  text: string;
  expression?: ts.Expression;
  variableName?: string;
  resolvedValues?: ResolvedUnion;
}

export function expandTemplateExpression(
  template: ts.TemplateExpression,
  checker: ts.TypeChecker,
): ExtractedClass {
  const parts: TemplatePart[] = [{ text: template.head.text }];
  const templateVariables: TemplateVariable[] = [];

  for (const span of template.templateSpans) {
    const name = getExpressionPlaceholder(span.expression);
    const resolvedValues = resolveStringLiteralUnion(checker, span.expression);

    parts.push({
      text: "",
      expression: span.expression,
      variableName: name,
      resolvedValues,
    });
    parts.push({ text: span.literal.text });

    templateVariables.push({
      name,
      resolvedValues,
    });
  }

  const generatedClasses = expandParts(parts);

  return {
    originalText: template.getText(),
    baseName: parts
      .map((part) => part.text || part.variableName || "")
      .join(""),
    isTemplate: true,
    templateVariables,
    resolvedValues: templateVariables.map(
      (variable) => variable.resolvedValues,
    ),
    generatedClasses,
  };
}

function expandParts(parts: TemplatePart[]): string[] {
  const valueGroups = parts.map((part) => {
    if (!part.expression) {
      return [part.text];
    }

    return part.resolvedValues ?? [part.variableName ?? "value"];
  });

  return cartesianProduct(valueGroups).map((values) => values.join(""));
}
