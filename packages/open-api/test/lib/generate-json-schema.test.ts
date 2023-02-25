import path from 'node:path';
import { generateJsonSchema } from '@typesafe-api/open-api';

it('Generate schema', async () => {
  const schemas = generateJsonSchema({
    tsConfigFile: path.join(__dirname, '../../../core/tsconfig.spec.json'),
    files: [path.join(__dirname, '../../../core/test/example-routes.ts')],
  });

  expect(Object.keys(schemas)).toEqual([
    'CreateDogEndpointDef',
    'GetDogsEndpointDef',
    'GetDogEndpointDef',
    'HeaderTestEndpointDef',
    'InternalErrorTestEndpointDef',
  ]);
});
