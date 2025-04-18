import { exec } from 'child_process';

import glob from 'glob-promise';

export const EXPECTED_ERRORS_START = '@expected-compiler-errors-start';

interface Out {
  stdout: string;
  stderr: string;
}

const executeCmd = (command: string, callback: (out: Out) => void): void => {
  exec(command, function (error, stdout, stderr) {
    callback({ stdout, stderr });
  });
};

const shell = (cmd: string): Promise<Out> =>
  new Promise((resolve) => {
    executeCmd(cmd, resolve);
  });

export const getTestFiles = (prefix = ''): Promise<string[]> => {
  const path = prefix + '__ts_type_test__/**/*.ts';
  console.log(`Selecting compiler tests using ${path}`);
  return glob(path);
};

export const getCompilerErrors = async (
  fullFilePath: string
): Promise<string[]> => {
  const { stderr } = await shell(`npx ts-node ${fullFilePath}`);
  return (
    stderr
      // Remove print of diagnosticText as it results in duplicated errors
      .split(/\s+diagnosticText: /)[0]
      // Process one line at at time
      .split(/\n+/)
      // Find the lines with errors on them and select the error message from the match results
      .map((s) => {
        const matchResult = s.match(/\(\d+,\d+\): error TS\d+: .+/);
        return matchResult ? matchResult[0] : null;
      })
      // Filter out undefined elements
      .filter((s): s is string => s !== null)
  );
};
