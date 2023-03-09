import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

import {
  CompilerOptions,
  Definition,
  generateSchema,
  getProgramFromFiles,
} from 'typescript-json-schema';
import {
  File as ParsedTs,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  TypescriptParser,
  VariableDeclaration,
} from 'typescript-parser';
import { AbstractEndpointDef, Route } from '@typesafe-api/core';
import * as fs from 'fs';

export interface GenerateJsonSchemaParams {
  files: string[];
  tsConfigFile: string;
}

export interface EndpointDefinition {
  typeName: string;
  route: Route<AbstractEndpointDef>;
  srcFile: string;
  jsonSchema: Definition;
}

const parser = new TypescriptParser();

const getCompilerOptions = (tsConfigFile: string): CompilerOptions => {
  const tsConfig = JSON.parse(readFileSync(tsConfigFile).toString('utf8'));

  let parentOptions: CompilerOptions = {};
  const parentFile = tsConfig.extends;
  if (parentFile) {
    const resolvedParentFile = join(dirname(tsConfigFile), parentFile);
    parentOptions = getCompilerOptions(resolvedParentFile);
  }

  return {
    ...parentOptions,
    ...tsConfig.compilerOptions,
  };
};

const getRoute = async (
  fileName: string,
  parsed: ParsedTs,
  typeName: string
): Promise<Route<AbstractEndpointDef>> => {
  const routeVar = parsed.declarations.find((dec) => {
    if (!(dec instanceof VariableDeclaration)) {
      return false;
    }

    return dec.type === `Route<${typeName}>`;
  }) as VariableDeclaration | undefined;

  if (!routeVar) {
    throw Error(
      `Failed to find route for ${typeName} \n\n` +
        `Please ensure there is a route defined in the file` +
        "and it is annotated with the Route<$yourEndpointDefinitionType> type when it's initialized"
    );
  }

  if (!routeVar.isExported) {
    throw Error(
      `Route variable "${routeVar.name}" in ${fileName} is not exported you need to add the "export" keyword?`
    );
  }

  const module = await import(fileName);
  return module[routeVar.name];
};

export const endpointDefinitions = async (
  params: GenerateJsonSchemaParams
): Promise<EndpointDefinition[]> => {
  const { tsConfigFile, files } = params;

  const program = getProgramFromFiles(files, getCompilerOptions(tsConfigFile));
  const definitions: EndpointDefinition[] = [];

  for (const file of files) {
    console.log(`Parsing ${file} ...`);
    const parsed = await parser.parseSource(
      fs.readFileSync(file).toString('utf-8')
    );

    const endpointDefTypeNames: string[] = parsed.declarations
      .filter((dec) => {
        const isTypeDef =
          dec instanceof InterfaceDeclaration ||
          dec instanceof TypeAliasDeclaration;
        return isTypeDef && dec.name.endsWith('EndpointDef');
      })
      .map((dec) => dec.name);

    for (const typeName of endpointDefTypeNames.values()) {
      definitions.push({
        route: await getRoute(file, parsed, typeName),
        typeName,
        srcFile: file,
        jsonSchema: generateSchema(program, typeName, { required: true }),
      });
    }
  }

  return definitions;
};
