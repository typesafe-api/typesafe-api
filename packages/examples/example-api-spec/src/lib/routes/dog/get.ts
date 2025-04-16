import { z } from 'zod';

import { reqSchemaProcessor, routeHelper } from '../../api';

import type { MyApiEndpoint } from '../../api';
import type { DogWithId } from '../../dto/dog';
import type {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';

export interface DogsWithIdRes extends AbstractResponse {
  body: DogWithId[];
}

export const getDogsReqSchemaShape = {
  query: z.object({
    breed: z.string().optional(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const getDogsProcessedSchemas = reqSchemaProcessor.processReqShape(
  getDogsReqSchemaShape
);

export type GetDogsEndpointDef = MyApiEndpoint<
  typeof getDogsProcessedSchemas,
  DogsWithIdRes
>;

export const getDogsRoute: Route<GetDogsEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/dog',
  processedSchemas: getDogsProcessedSchemas,
});
