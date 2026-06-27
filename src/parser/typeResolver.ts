import * as fs from "fs";
import * as path from "path";
import ts from "typescript";
import { ResolvedUnion } from "../models/ResolvedUnion";

export interface TypeResolverContext {
  checker: ts.TypeChecker;
  parseDiagnostics: readonly ts.Diagnostic[];
  sourceFile: ts.SourceFile;
}

export function createTypeResolverContext(
  fileName: string,
  sourceText: string,
): TypeResolverContext {
  const configPath = ts.findConfigFile(
    path.dirname(fileName),
    ts.sys.fileExists,
    "tsconfig.json",
  );
  const parsedConfig = configPath
    ? parseConfig(configPath)
    : createDefaultConfig(fileName);

  const normalizedFileName = path.resolve(fileName);
  const originalHost = ts.createCompilerHost(parsedConfig.options, true);
  const host: ts.CompilerHost = {
    ...originalHost,
    getSourceFile: (
      requestedFileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    ) => {
      if (path.resolve(requestedFileName) === normalizedFileName) {
        return ts.createSourceFile(
          requestedFileName,
          sourceText,
          languageVersion,
          true,
        );
      }

      return originalHost.getSourceFile(
        requestedFileName,
        languageVersion,
        onError,
        shouldCreateNewSourceFile,
      );
    },
    readFile: (requestedFileName) => {
      if (path.resolve(requestedFileName) === normalizedFileName) {
        return sourceText;
      }

      return originalHost.readFile(requestedFileName);
    },
    fileExists: (requestedFileName) => {
      if (path.resolve(requestedFileName) === normalizedFileName) {
        return true;
      }

      return originalHost.fileExists(requestedFileName);
    },
  };

  const rootNames = parsedConfig.fileNames.includes(normalizedFileName)
    ? parsedConfig.fileNames
    : [...parsedConfig.fileNames, normalizedFileName];

  const program = ts.createProgram(rootNames, parsedConfig.options, host);
  const sourceFile =
    program.getSourceFile(normalizedFileName) ??
    ts.createSourceFile(
      fileName,
      sourceText,
      parsedConfig.options.target ?? ts.ScriptTarget.Latest,
      true,
    );

  return {
    checker: program.getTypeChecker(),
    parseDiagnostics: program.getSyntacticDiagnostics(sourceFile),
    sourceFile,
  };
}

export function resolveStringLiteralUnion(
  checker: ts.TypeChecker,
  expression: ts.Expression,
): ResolvedUnion {
  const type = checker.getTypeAtLocation(expression);
  return resolveStringLiteralUnionType(type, new Set());
}

function parseConfig(configPath: string): ts.ParsedCommandLine {
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

  if (configFile.error) {
    return createDefaultConfig(path.dirname(configPath));
  }

  return ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
    undefined,
    configPath,
  );
}

function createDefaultConfig(fileName: string): ts.ParsedCommandLine {
  const fallbackOptions: ts.CompilerOptions = {
    allowJs: true,
    checkJs: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.Node16,
    moduleResolution: ts.ModuleResolutionKind.Node16,
    target: ts.ScriptTarget.ES2020,
    strict: false,
    skipLibCheck: true,
  };

  return {
    options: fallbackOptions,
    fileNames:
      fs.existsSync(fileName) && fs.statSync(fileName).isFile()
        ? [path.resolve(fileName)]
        : [],
    errors: [],
  };
}

function resolveStringLiteralUnionType(
  type: ts.Type,
  visited: Set<ts.Type>,
): ResolvedUnion {
  if (visited.has(type)) {
    return null;
  }

  visited.add(type);

  if (type.isStringLiteral()) {
    return [type.value];
  }

  if (type.isUnion()) {
    const values: string[] = [];

    for (const unionType of type.types) {
      const resolved = resolveStringLiteralUnionType(unionType, visited);

      if (!resolved) {
        return null;
      }

      values.push(...resolved);
    }

    return [...new Set(values)];
  }

  return null;
}
