import { getCompilerErrors, getTestFiles } from './util';
import { parseTS } from './parse-ts';

export type AllFileErrors = {
  [key: string]: string[];
};

export interface CompilerTestResults {
  expected: AllFileErrors;
  actual: AllFileErrors;
}

export const runTests = async (
  pathPrefix: string
): Promise<CompilerTestResults> => {
  const expected: AllFileErrors = {};
  const actual: AllFileErrors = {};

  for (const file of await getTestFiles(pathPrefix)) {
    const errors = await getCompilerErrors(file);
    // Add "// " to make them the same as the parsed errors
    actual[file] = errors.map((s) => `// ${s}`);

    const { expectedErrors } = await parseTS(file);
    expected[file] = expectedErrors.slice(1);
  }

  return {
    expected,
    actual,
  };
};
