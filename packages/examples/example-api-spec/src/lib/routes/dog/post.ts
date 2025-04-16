import { reqSchemaProcessor, routeHelper } from '../../api';
import { DogSchema } from '../../dto/dog';

import type { MyApiEndpoint } from '../../api';
import type { DogWithId } from '../../dto/dog';
import type {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';

export interface CreateDogRes extends AbstractResponse {
  body: DogWithId;
}

export const createDogReqSchemaShape = {
  body: DogSchema,
} satisfies PartialAbstractRequestSchemaShape;

const createDogProcessedSchemas = reqSchemaProcessor.processReqShape(
  createDogReqSchemaShape
);

export type CreateDogEndpointDef = MyApiEndpoint<
  typeof createDogProcessedSchemas,
  CreateDogRes
>;

export const postDogRoute: Route<CreateDogEndpointDef> = routeHelper.create({
  path: '/dog',
  method: 'post',
  processedSchemas: createDogProcessedSchemas,
});
