import * as path from "path";
import * as vscode from "vscode";
import {
  extractClassesFromSourceFile,
  flattenGeneratedClasses,
} from "../parser/astWalker";
import { createTypeResolverContext } from "../parser/typeResolver";
import { copyCssToClipboard } from "../services/clipboard";
import { formatCssClasses } from "../services/formatter";
import { showError, showWarning } from "../services/notifications";

const SUPPORTED_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);

export async function extractCssCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    showWarning("No active editor.");
    return;
  }

  const document = editor.document;
  const extension = path.extname(document.fileName).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    showWarning("No CSS module references found.");
    return;
  }

  try {
    const sourceText = document.getText();
    const { checker, parseDiagnostics, sourceFile } = createTypeResolverContext(
      document.fileName,
      sourceText,
    );

    if (parseDiagnostics.length > 0) {
      showError("Unable to parse current file.");
      return;
    }

    const extractedClasses = extractClassesFromSourceFile(sourceFile, checker);
    const classNames = flattenGeneratedClasses(extractedClasses);

    if (classNames.length === 0) {
      showWarning("No CSS module references found.");
      return;
    }

    await copyCssToClipboard(formatCssClasses(classNames), classNames.length);
  } catch {
    showError("Unable to parse current file.");
  }
}
