import {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';
import { MyApiEndpoint, reqSchemaProcessor, routeHelper } from '../../api';

const internalErrorTestReqSchemaShape =
  {} satisfies PartialAbstractRequestSchemaShape;

const internalErrorTestProcessedSchemas = reqSchemaProcessor.processReqShape(
  internalErrorTestReqSchemaShape
);

export type InternalErrorTestEndpointDef = MyApiEndpoint<
  typeof internalErrorTestProcessedSchemas,
  AbstractResponse
>;

export const internalErrorTestRoute: Route<InternalErrorTestEndpointDef> =
  routeHelper.create({
    method: 'get',
    path: '/internal-error',
    processedSchemas: internalErrorTestProcessedSchemas,
  });
