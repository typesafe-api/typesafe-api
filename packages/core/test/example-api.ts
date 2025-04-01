import { z } from 'zod';
import {
  DefaultReqAndSchema,
  ErrorType,
  TypesafeHttpError,
  AbstractProcessedSchemas,
  RouteHelper,
  ApiEndpointHelper,
} from '../src';
import {
  AbstractRequestSchema,
  PartialAbstractRequestSchemaShape,
} from '../src/types/request-schema';
import { RequestSchemaProcessor, schemaHelpers } from '../src/util/schema';

export const myApiDefaultRequestSchemaShape = {
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: z.object({
    myheader: z.string(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

export const reqSchemaProcessor = new RequestSchemaProcessor(
  myApiDefaultRequestSchemaShape
);

export const myApiDefaultRequestSchema = z.object(
  myApiDefaultRequestSchemaShape
) satisfies AbstractRequestSchema;

export const routeHelper = new RouteHelper(myApiDefaultRequestSchema);

export interface ApiErrorBody {
  msg: string;
}

export type ApiErrorType<S extends number> = ErrorType<S, ApiErrorBody>;

export type AbstractApiErrorType = ApiErrorType<number>;

export class ApiHttpError extends TypesafeHttpError<AbstractApiErrorType> {}

export const throwHttpError = (statusCode: number, msg: string) => {
  throw new ApiHttpError({
    statusCode: statusCode,
    body: {
      msg,
    },
  });
};

export type DefaultErrorCodes = 500;

export type MyDefaultReqAndSchema = DefaultReqAndSchema<
  typeof myApiDefaultRequestSchema
>;

export type ApiEndpoint<
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp,
  E extends AbstractApiErrorType = ApiErrorType<DefaultErrorCodes>
> = ApiEndpointHelper<MyDefaultReqAndSchema, TProcessedReqSchemas, TResp, E>;
