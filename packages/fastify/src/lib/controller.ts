import type { AbstractEndpointDef, ResponseBody } from '@typesafe-api/core';
import type { FastifyRequest, FastifyReply } from 'fastify';

type ToExclude = Record<string, never>;

export interface TRequest<T extends AbstractEndpointDef>
  extends FastifyRequest<{
    Params: Exclude<T['mergedReq']['params'], ToExclude>;
    Body: Exclude<T['mergedReq']['body'], ToExclude>;
    Querystring: Exclude<T['mergedReq']['query'], ToExclude>;
    Headers: Exclude<T['mergedReq']['headers'], ToExclude>;
  }> {}

export type BodyOrError<T extends AbstractEndpointDef> =
  | ResponseBody<T>
  | T['errorType'];

export interface TResponse<T extends AbstractEndpointDef>
  extends FastifyReply {
  header(
    name: keyof T['resp']['headers'],
    value?: string | number | string[]
  ): this;
}

export type Controller<T extends AbstractEndpointDef> = (
  req: TRequest<T>,
  res: TResponse<T>
) => Promise<void>;

export const sendError = <T extends AbstractEndpointDef>(
  res: TResponse<T>,
  errorType: T['errorType']
): void => {
  res.status(errorType.statusCode).send(errorType);
};
