import { AbstractErrorType } from './error';
import { AbstractRequest, AbstractRequestSchema, PartialAbstractRequestSchema } from './types/request-schema';

export interface EndpointDef<
  TDefaultReq extends AbstractRequest,
  TDefaultReqSchema extends PartialAbstractRequestSchema,
  TReq extends Partial<AbstractRequest>,
  TReqSchema extends AbstractRequestSchema,
  TMergedReq extends AbstractRequest,
  TResp,
  E extends AbstractErrorType
> {
  defaultReq: TDefaultReq;
  defaultReqSchema: TDefaultReqSchema;
  req: TReq;
  reqSchema: TReqSchema;
  mergedReq: TMergedReq;
  resp: TResp;
  errorType: E;
}

export type AbstractEndpointDef = EndpointDef<any, any, any, any, any, any, AbstractErrorType>;

export type ResponseBody<T extends AbstractEndpointDef> =
  T['resp']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['resp']['headers'];
