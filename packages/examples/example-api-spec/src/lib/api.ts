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
  AbstractRequestSchema,
  PartialAbstractRequestSchemaShape,
  RequestSchemaProcessor,
  schemaHelpers,
  AbstractResponse,
} from '@typesafe-api/core';

/*
 * Default request
 */

// TODO update this to reflect all the parameters that should be included in every request
// TODO a very common use case would be to have the authorization token as a header.
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

export type MyApiDefaultReqAndSchema = DefaultReqAndSchema<
  typeof myApiDefaultRequestSchema
>;
export type MyApiDefaultReq = MyApiDefaultReqAndSchema['req'];

/*
 * Error types
 */

export type MyApiDefaultErrorCodes = BaseErrorCodes | 403;
export type MyApiEndpointErrorType<T extends number> = EasyEndpointErrorType<
  MyApiDefaultErrorCodes,
  T
>;
export type MyApiDefaultErrorType = EasyErrorType<MyApiDefaultErrorCodes>;

/*
 * Api Endpoint
 */

export type MyApiEndpoint<
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyEasyErrorType = MyApiDefaultErrorType
> = EasyApiEndpointHelper<
  MyApiDefaultReqAndSchema,
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
