import fs from 'fs';

import { parseTS } from './parse-ts';
import { EXPECTED_ERRORS_START, getCompilerErrors, getTestFiles } from './util';

const run = async (): Promise<void> => {
  for (const file of await getTestFiles(__dirname + '/../../../**/')) {
    const { code } = await parseTS(file);

    // Remove blank lines form the end of code
    for (let i = code.length - 1; i >= 0; i--) {
      const line = code[i];
      if (!line.length || line.match(/^\s*\n$/)) {
        code.pop();
      } else {
        break;
      }
    }

    const errors = await getCompilerErrors(file);

    // Build the new code for the file
    const newCode = [
      ...code,
      '',
      `// ${EXPECTED_ERRORS_START}`,
      ...errors.map((s) => `// ${s}`),
      '',
    ].join('\n');

    fs.writeFileSync(file, newCode);
  }
};

run().catch((err) => {
  console.log(err);
  process.exit(1);
});
