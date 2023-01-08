import { relativeToCWD } from '@typesafe-api/serverless';

it('relativeToCWD(..)', async () => {
  const expectedRelPath = 'my-example/_id/testing';
  const absPath = `${process.cwd()}/${expectedRelPath}`;
  const relativePath = relativeToCWD(absPath);
  expect(relativePath).toBe(expectedRelPath);
});
