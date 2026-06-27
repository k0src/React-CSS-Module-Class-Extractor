import { ResolvedUnion } from "./ResolvedUnion";

export interface TemplateVariable {
  name: string;
  resolvedValues: ResolvedUnion;
}

export interface ExtractedClass {
  originalText: string;
  baseName: string;
  isTemplate: boolean;
  templateVariables: TemplateVariable[];
  resolvedValues: ResolvedUnion[];
  generatedClasses: string[];
}
