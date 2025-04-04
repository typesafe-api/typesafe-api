import { z } from 'zod';
import {
  DefaultReqAndSchema,
  AbstractErrorType,
  AbstractProcessedSchemas,
  RouteHelper,
  ApiEndpointHelper,
  BaseErrorCodes,
  TypesafeHttpError,
  AbstractRequestSchema,
  PartialAbstractRequestSchemaShape,
  RequestSchemaProcessor,
  schemaHelpers,
  AbstractResponse,
} from '../../../../core/src';

/*
 * Default request
 */

const apiDefaultRequestSchemaShape = {
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: z.object({
    myheader: z.string(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const apiDefaultRequestSchema = z.object(
  apiDefaultRequestSchemaShape
) satisfies AbstractRequestSchema;

type ApiDefaultReqAndSchema = DefaultReqAndSchema<
  typeof apiDefaultRequestSchema
>;
type ApiDefaultReq = ApiDefaultReqAndSchema['req'];

/*
 * Error types
 */

type ApiDefaultErrorCodes = BaseErrorCodes | 403;
interface ApiErrorBody {
  errMsg: string;
}
type ApiErrorType<T extends number> = AbstractErrorType<T, ApiErrorBody>;
type AnyApiErrorType = ApiErrorType<number>;
type ApiDefaultErrorType = ApiErrorType<ApiDefaultErrorCodes>;

/*
 * Api Endpoint
 */

type ApiEndpoint<
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyApiErrorType = ApiDefaultErrorType
> = ApiEndpointHelper<ApiDefaultReqAndSchema, TProcessedReqSchemas, TResp, E>;

type AnyApiEndpoint = ApiEndpoint<
  AbstractProcessedSchemas,
  AbstractResponse,
  ApiErrorType<number>
>;

/*
 * Api error class
 */

class ApiHttpError<T extends AnyApiEndpoint> extends TypesafeHttpError<T> {
  constructor(statusCode: T['errorType']['statusCode'], errMsg: string) {
    super({
      statusCode,
      body: {
        errMsg,
      },
    });
  }
}

/*
 * Create helpers
 */

const routeHelper = new RouteHelper(apiDefaultRequestSchema);
const reqSchemaProcessor = new RequestSchemaProcessor(
  apiDefaultRequestSchemaShape
);
