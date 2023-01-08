import {relativeToCWD} from '@typesafe-api/serverless';

it('relativeToCWD(..) escapes square brackets', async () => {
  const absPath = process.cwd() + '/my-example/[_id]/testing';
  const relativePath = relativeToCWD(absPath);
  expect(relativePath).toBe("my-example/\\[_id\\]/testing")
})
