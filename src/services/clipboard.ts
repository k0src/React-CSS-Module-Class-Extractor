import * as vscode from "vscode";
import { showInfo } from "./notifications";

export async function copyCssToClipboard(
  css: string,
  classCount: number,
): Promise<void> {
  await vscode.env.clipboard.writeText(css);
  showInfo(
    `Copied ${classCount} CSS ${classCount === 1 ? "class" : "classes"}.`,
  );
}
