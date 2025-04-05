import { runTests } from '@typesafe-api/ts-type-test';

it('ts-type-test', async () => {
  const { expected, actual } = await runTests(__dirname + '/../');
  expect(expected).toEqual(actual);
}, 30000);
