import { z } from 'zod';

import { reqSchemaProcessor, routeHelper } from '../../../api';

import type { MyApiEndpoint } from '../../../api';
import type { DogWithId } from '../../../dto/dog';
import type {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';

export interface GetSearchDogsRes extends AbstractResponse {
  body: DogWithId[];
}

export const getSearchDogsReqSchemaShape = {
  query: z.object({
    searchQuery: z.string().optional(),
    breed: z.string().optional(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const getSearchDogsProcessedSchemas = reqSchemaProcessor.processReqShape(
  getSearchDogsReqSchemaShape
);

export type GetSearchDogsEndpointDef = MyApiEndpoint<
  typeof getSearchDogsProcessedSchemas,
  GetSearchDogsRes
>;

export const getSearchDogsRoute: Route<GetSearchDogsEndpointDef> =
  routeHelper.create({
    method: 'get',
    path: '/dog/search',
    processedSchemas: getSearchDogsProcessedSchemas,
  });
