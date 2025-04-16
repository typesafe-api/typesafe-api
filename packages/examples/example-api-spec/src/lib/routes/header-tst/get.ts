import { reqSchemaProcessor, routeHelper } from '../../api';

import type { MyApiEndpoint } from '../../api';
import type {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';

const headerTestReqSchemaShape = {} satisfies PartialAbstractRequestSchemaShape;

const headerTestProcessedSchemas = reqSchemaProcessor.processReqShape(
  headerTestReqSchemaShape
);

export interface HeaderTestResp extends AbstractResponse {
  body: {
    headerValue: string;
  };
  headers: {
    'test-header': string;
  };
}

export type HeaderTestEndpointDef = MyApiEndpoint<
  typeof headerTestProcessedSchemas,
  HeaderTestResp
>;

export const headerTestRoute: Route<HeaderTestEndpointDef> = routeHelper.create(
  {
    method: 'get',
    path: '/header-tst',
    processedSchemas: headerTestProcessedSchemas,
  }
);
