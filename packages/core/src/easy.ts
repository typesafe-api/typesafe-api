import {
  ApiEndpointHelper,
  DefaultReqAndSchema,
  EndpointDef,
  EndpointReqModelsAndSchemas,
} from './endpoint';
import { AbstractErrorType, TypesafeHttpError } from './error';
import { AbstractRequestSchema } from './types';
import { AbstractResponse } from './types/response-schema';
import { AbstractProcessedSchemas } from './util';

/*
 * Error types
 */

export interface EasyErrorBody {
  msg: string;
}
export type EasyErrorType<T extends number> = AbstractErrorType<
  T,
  EasyErrorBody
>;
export type EasyEndpointErrorType<
  DefaultErrorCodes extends number,
  EndpointErrorCodes extends number
> = EasyErrorType<DefaultErrorCodes | EndpointErrorCodes>;
export type AnyEasyErrorType = EasyErrorType<number>;

/*
 * Api Endpoint
 */

export type EasyApiEndpointHelper<
  TDefaultReqAndSchema extends DefaultReqAndSchema<AbstractRequestSchema>,
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyEasyErrorType
> = ApiEndpointHelper<TDefaultReqAndSchema, TProcessedReqSchemas, TResp, E>;

export type EasyAnyEndpoint =
  EndpointDef<
    DefaultReqAndSchema<AbstractRequestSchema>,
    EndpointReqModelsAndSchemas<AbstractProcessedSchemas>,
    AbstractResponse,
    EasyErrorType<number>
  >;

/*
 * Api error class
 */

export class EasyTypesafeHttpError<
  T extends EasyAnyEndpoint
> extends TypesafeHttpError<T> {
  constructor(statusCode: T['errorType']['statusCode'], msg: string) {
    super({
      statusCode,
      body: {
        msg,
      },
    });
  }
}
