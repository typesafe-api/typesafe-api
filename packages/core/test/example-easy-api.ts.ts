import { z } from 'zod';
import {
  DefaultReqAndSchema,
  AbstractProcessedSchemas,
  RouteHelper,
  BaseErrorCodes,
  EasyDefaultErrorType,
  EasyApiEndpointHelper,
  AnyEasyErrorType,
  EasyAnyEndpoint,
  EasyTypesafeHttpError,
  EasyEndpointErrorType,
  EasyErrorType,
} from '../src';
import {
  AbstractRequestSchema,
  PartialAbstractRequestSchemaShape,
} from '../src/types/request-schema';
import { RequestSchemaProcessor, schemaHelpers } from '../src/util/schema';
import { AbstractResponse } from '../src/types/response-schema';

/*
 * Default request
 */

export const myApiDefaultRequestSchemaShape = {
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: z.object({
    myheader: z.string(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

export const myApiDefaultRequestSchema = z.object(
  myApiDefaultRequestSchemaShape
) satisfies AbstractRequestSchema;

export type ApiDefaultReqAndSchema = DefaultReqAndSchema<
  typeof myApiDefaultRequestSchema
>;
export type ApiDefaultReq = ApiDefaultReqAndSchema['req'];

/*
 * Error types
 */

type ApiEasyDefaultErrorCodes = BaseErrorCodes | 403;
type ApiEasyEndpointErrorType<T extends number> = EasyEndpointErrorType<ApiEasyDefaultErrorCodes, T>
type ApiEasyDefaultErrorType = EasyErrorType<ApiEasyDefaultErrorCodes>;

/*
 * Api Endpoint
 */

export type ApiEasyEndpoint<
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyEasyErrorType = ApiEasyDefaultErrorType
> = EasyApiEndpointHelper<
  ApiDefaultReqAndSchema,
  TProcessedReqSchemas,
  TResp,
  E
>;

export type ApiEasyAnyEndpoint = EasyAnyEndpoint<ApiEasyDefaultErrorType>;

/*
 * Api error class
 */

export class ApiEasyHttpError<
  T extends ApiEasyAnyEndpoint
> extends EasyTypesafeHttpError<T> {}

/*
 * Create helpers
 */

export const easyRouteHelper = new RouteHelper(myApiDefaultRequestSchema);
export const easyReqSchemaProcessor = new RequestSchemaProcessor(
  myApiDefaultRequestSchemaShape
);
