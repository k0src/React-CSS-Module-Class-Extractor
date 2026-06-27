import * as vscode from "vscode";

export function showInfo(message: string): void {
  vscode.window.showInformationMessage(message);
}

export function showWarning(message: string): void {
  vscode.window.showWarningMessage(message);
}

export function showError(message: string): void {
  vscode.window.showErrorMessage(message);
}
