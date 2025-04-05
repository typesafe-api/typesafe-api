import { z } from 'zod';
import {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';
import {
  MyApiEndpoint,
  MyApiEndpointErrorType,
  reqSchemaProcessor,
  routeHelper,
} from '../../../api';
import { DogWithId } from '../../../dto';

const getDogReqSchemaShape = {
  params: z.object({
    _id: z.string(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const getDogProcessedSchemas =
  reqSchemaProcessor.processReqShape(getDogReqSchemaShape);

export interface GetDogRes extends AbstractResponse {
  body: DogWithId;
}

export type GetDogErrorType = MyApiEndpointErrorType<500 | 404>;

export type GetDogEndpointDef = MyApiEndpoint<
  typeof getDogProcessedSchemas,
  GetDogRes,
  GetDogErrorType
>;

export const getDogRoute: Route<GetDogEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/dog/:_id',
  processedSchemas: getDogProcessedSchemas,
});
