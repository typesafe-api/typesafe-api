import path from 'node:path';
import { endpointDefinitions } from '@typesafe-api/open-api';

it('Generate schema', async () => {
  const endpointDefs = await endpointDefinitions({
    tsConfigFile: path.join(__dirname, '../../../core/tsconfig.spec.json'),
    files: [path.join(__dirname, '../../../core/test/example-routes.ts')],
  });

  const processedTypes = endpointDefs.map(
    (endpointDef) => endpointDef.typeName
  );

  expect(processedTypes).toEqual([
    'CreateDogEndpointDef',
    'GetDogsEndpointDef',
    'GetDogEndpointDef',
    'HeaderTestEndpointDef',
    'InternalErrorTestEndpointDef',
  ]);
});
