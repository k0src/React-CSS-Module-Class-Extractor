export function formatCssClasses(classNames: string[]): string {
  return classNames.map((className) => `.${className} {\n\n}`).join("\n\n");
}
