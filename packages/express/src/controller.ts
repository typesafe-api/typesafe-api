import { NextFunction } from 'express';
import {
  AbstractEndpointDef,
  ResponseBody,
} from '@typesafe-api/core';
import { Request, Response } from 'express-serve-static-core';

type ToExclude = Record<string, never>;

export interface TRequest<T extends AbstractEndpointDef>
  extends Request<
    Exclude<T['mergedReq']['params'], ToExclude>,
    ResponseBody<T>,
    Exclude<T['mergedReq']['body'], ToExclude>,
    Exclude<T['mergedReq']['query'], ToExclude>
  > {
  get(name: keyof T['mergedReq']['headers']): string | undefined;
  get(name: keyof T['mergedReq']['headers']): string[] | undefined;
}

type BodyOrError<T extends AbstractEndpointDef> =
  | ResponseBody<T>
  | T['errorType'];

export interface TResponse<T extends AbstractEndpointDef>
  extends Response<BodyOrError<T>> {
  set(field: keyof T['resp']['headers']): this;
  set(field: keyof T['resp']['headers'], value?: string | string[]): this;
}

export type Controller<T extends AbstractEndpointDef> = (
  req: TRequest<T>,
  res: TResponse<T>,
  next: NextFunction
) => Promise<void>;

export const sendError = <T extends AbstractEndpointDef>(
  res: TResponse<T>,
  errorType: T['errorType']
): void => {
  res.status(errorType.statusCode).send(errorType);
};
