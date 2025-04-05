import { z } from 'zod';
import {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';
import { DogSchema, DogWithId } from '../../dto/dog';
import { MyApiEndpoint, reqSchemaProcessor, routeHelper } from '../../api';

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
