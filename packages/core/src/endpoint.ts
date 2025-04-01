import { AbstractErrorType } from './error';
import { AbstractRequest } from './types/request-schema';


export interface ResOptions {
  body: {};
  headers: {};
}
/* eslint-enable @typescript-eslint/ban-types */

export interface EndpointDef<
  DefaultReqOpt extends AbstractRequest,
  ReqOpt extends AbstractRequest,
  ResOpt extends ResOptions,
  E extends AbstractErrorType
> {
  requestOptions: {
    query: DefaultReqOpt['query'] & ReqOpt['query'];
    params: DefaultReqOpt['params'] & ReqOpt['params'];
    body: DefaultReqOpt['body'] & ReqOpt['body'];
    headers: DefaultReqOpt['headers'] & ReqOpt['headers'];
  };
  defaultReqOptions: DefaultReqOpt;
  // These are the parameters that will be required by the API client
  clientReqOptions: ReqOpt;
  responseOptions: ResOpt;
  errorType: E;
}

export type AbstractEndpointDef = EndpointDef<any, any, any, AbstractErrorType>;

export type ResponseBody<T extends AbstractEndpointDef> =
  T['responseOptions']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['responseOptions']['headers'];
