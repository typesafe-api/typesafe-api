import { z } from 'zod';
import {
  DefaultReqAndSchema,
  AbstractProcessedSchemas,
  RouteHelper,
  BaseErrorCodes,
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

export type MyApiDefaultErrorCodes = BaseErrorCodes | 403;
export type MyApiEndpointErrorType<T extends number> = EasyEndpointErrorType<MyApiDefaultErrorCodes, T>
export type MyApiDefaultErrorType = EasyErrorType<MyApiDefaultErrorCodes>;

/*
 * Api Endpoint
 */

export type MyApiEndpoint<
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyEasyErrorType = MyApiDefaultErrorType
> = EasyApiEndpointHelper<
  ApiDefaultReqAndSchema,
  TProcessedReqSchemas,
  TResp,
  E
>;

export type MyApiAnyEndpoint = EasyAnyEndpoint;

/*
 * Api error class
 */

export class MyApiHttpError<
  T extends MyApiAnyEndpoint
> extends EasyTypesafeHttpError<T> {}

/*
 * Create helpers
 */

export const routeHelper = new RouteHelper(myApiDefaultRequestSchema);
export const reqSchemaProcessor = new RequestSchemaProcessor(
  myApiDefaultRequestSchemaShape
);
