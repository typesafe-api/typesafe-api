import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

import {
  CompilerOptions,
  Definition,
  generateSchema,
  getProgramFromFiles,
} from 'typescript-json-schema';
import * as fs from 'fs';

export interface GenerateJsonSchemaParams {
  files: string[];
  tsConfigFile: string;
}

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

export const generateJsonSchema = (params: GenerateJsonSchemaParams) => {
  const { tsConfigFile, files } = params;

  const program = getProgramFromFiles(files, getCompilerOptions(tsConfigFile));

  const endpointDefTypes = new Set<string>();
  for (const file of files) {
    fs.readFileSync(file)
      .toString('utf-8')
      .split(/\s/)
      .filter((s) => s.endsWith('EndpointDef'))
      .forEach((endpointDef) => endpointDefTypes.add(endpointDef));
  }

  const schemas: Record<string, Definition> = {};
  for (const endpointDef of endpointDefTypes.values()) {
    schemas[endpointDef] = generateSchema(program, endpointDef);
  }

  return schemas;
};
