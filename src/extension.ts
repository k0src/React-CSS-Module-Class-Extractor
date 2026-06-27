import * as vscode from "vscode";
import { extractCssCommand } from "./commands/extractCss";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "reactCssClassExtractor.extractCss",
      extractCssCommand,
    ),
  );
}

export function deactivate(): void {}
