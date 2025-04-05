import { z } from 'zod';
import {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
  schemaHelpers,
} from '@typesafe-api/core';
import { DogWithId } from '../../../dto/dog';
import { MyApiEndpoint, reqSchemaProcessor, routeHelper } from '../../../api';

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
