import { z } from 'zod';
import {
  DefaultReqAndSchema,
  AbstractErrorType,
  AbstractProcessedSchemas,
  RouteHelper,
  ApiEndpointHelper,
  BaseErrorCodes,
  AbstractHttpError,
  TypesafeHttpError,
} from '../src';
import {
  AbstractRequestSchema,
  PartialAbstractRequestSchemaShape,
} from '../src/types/request-schema';
import { RequestSchemaProcessor, schemaHelpers } from '../src/util/schema';
import { AbstractResponse } from '../src/types/response-schema';

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

export type ApiDefaultErrorCodes = BaseErrorCodes | 403;
export type ApiErrorBody = {
  errMsg: string;
};
export type ApiErrorType<T extends number> = AbstractErrorType<T, ApiErrorBody>;
export type AnyApiErrorType = ApiErrorType<number>;
export type ApiDefaultErrorType = ApiErrorType<ApiDefaultErrorCodes>;

export type ApiDefaultReqAndSchema = DefaultReqAndSchema<
  typeof myApiDefaultRequestSchema
>;
export type ApiDefaultReq = ApiDefaultReqAndSchema['req'];

export type ApiEndpoint<
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyApiErrorType = ApiDefaultErrorType
> = ApiEndpointHelper<ApiDefaultReqAndSchema, TProcessedReqSchemas, TResp, E>;

export type AnyApiEndpoint = ApiEndpoint<
  AbstractProcessedSchemas,
  AbstractResponse,
  ApiErrorType<number>
>;

export class ApiHttpError<
  T extends AnyApiEndpoint
> extends TypesafeHttpError<T> {
  constructor(statusCode: T['errorType']['statusCode'], errMsg: string) {
    super({
      statusCode,
      body: {
        errMsg,
      },
    });
  }
}
