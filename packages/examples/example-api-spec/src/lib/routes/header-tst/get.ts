import {
  PartialAbstractRequestSchemaShape,
  Route,
  AbstractResponse,
} from '@typesafe-api/core';
import {
  MyApiEndpoint,
  reqSchemaProcessor,
  routeHelper,
} from '../../api';

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

export const headerTestRoute: Route<HeaderTestEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/header-tst',
  processedSchemas: headerTestProcessedSchemas,
}); 