import ts from "typescript";
import { ExtractedClass } from "../models/ExtractedClass";
import { expandTemplateExpression } from "./templateExpansion";

const CSS_MODULE_IDENTIFIER = "styles";

export function visitCssModuleReference(
  node: ts.Node,
  checker: ts.TypeChecker,
): ExtractedClass | null {
  if (ts.isPropertyAccessExpression(node)) {
    return visitPropertyAccess(node);
  }

  if (ts.isElementAccessExpression(node)) {
    return visitElementAccess(node, checker);
  }

  return null;
}

function visitPropertyAccess(
  node: ts.PropertyAccessExpression,
): ExtractedClass | null {
  if (
    !ts.isIdentifier(node.expression) ||
    node.expression.text !== CSS_MODULE_IDENTIFIER
  ) {
    return null;
  }

  const className = node.name.text;

  return {
    originalText: node.getText(),
    baseName: className,
    isTemplate: false,
    templateVariables: [],
    resolvedValues: [],
    generatedClasses: [className],
  };
}

function visitElementAccess(
  node: ts.ElementAccessExpression,
  checker: ts.TypeChecker,
): ExtractedClass | null {
  if (
    !ts.isIdentifier(node.expression) ||
    node.expression.text !== CSS_MODULE_IDENTIFIER
  ) {
    return null;
  }

  const argument = node.argumentExpression;

  if (
    ts.isStringLiteral(argument) ||
    ts.isNoSubstitutionTemplateLiteral(argument)
  ) {
    return {
      originalText: node.getText(),
      baseName: argument.text,
      isTemplate: false,
      templateVariables: [],
      resolvedValues: [],
      generatedClasses: [argument.text],
    };
  }

  if (ts.isTemplateExpression(argument)) {
    return expandTemplateExpression(argument, checker);
  }

  return null;
}
