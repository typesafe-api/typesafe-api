import { AbstractErrorType } from './error';
import { AbstractRequest } from './types/request-schema';

export interface EndpointDef<
  TDefaultReq extends AbstractRequest,
  TReq extends Partial<AbstractRequest>,
  TMergedReq extends AbstractRequest,
  TResp,
  E extends AbstractErrorType
> {
  defaultReq: TDefaultReq;
  req: TReq;
  mergedReq: TMergedReq;
  resp: TResp;
  errorType: E;
}

export type AbstractEndpointDef = EndpointDef<any, any, any, any, AbstractErrorType>;

export type ResponseBody<T extends AbstractEndpointDef> =
  T['resp']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['resp']['headers'];
