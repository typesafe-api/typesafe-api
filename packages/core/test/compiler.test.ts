import { runCompilerTests } from '@typesafe-api/compiler-test';

it('Compiler tests', async () => {
  const { expected, actual } = await runCompilerTests(__dirname + '/../');
  expect(expected).toEqual(actual);
}, 30000);
