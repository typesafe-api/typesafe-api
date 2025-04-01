import { AbstractErrorType } from './error';
import { AbstractRequest, AbstractRequestSchema, PartialAbstractRequestSchema } from './types/request-schema';

export interface EndpointDef<
  TDefaultReq extends AbstractRequest,
  TDefaultReqSchema extends AbstractRequestSchema,
  TReq extends Partial<AbstractRequest>,
  TReqSchema extends PartialAbstractRequestSchema,
  TMergedReq extends AbstractRequest,
  TMergedReqSchema extends AbstractRequestSchema,
  TResp,
  E extends AbstractErrorType
> {
  defaultReq: TDefaultReq;
  defaultReqSchema: TDefaultReqSchema;
  req: TReq;
  reqSchema: TReqSchema;
  mergedReq: TMergedReq;
  mergedReqSchema: TMergedReqSchema;
  resp: TResp;
  errorType: E;
}

export type AbstractEndpointDef = EndpointDef<any, any, any, any, any, any, any, AbstractErrorType>;

export type ResponseBody<T extends AbstractEndpointDef> =
  T['resp']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['resp']['headers'];
