import { reqSchemaProcessor, routeHelper } from '../../api';

import type { MyApiEndpoint } from '../../api';
import type {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';

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
