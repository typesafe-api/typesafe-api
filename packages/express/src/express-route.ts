import { Controller, TRequest, TResponse } from './controller';
import { ErrorRequestHandler, RequestHandler, Router } from 'express';
import { AbstractEndpointDef, Route } from '@typesafe-api/core';
import { Request, Response, NextFunction } from 'express';
export interface ExpressRoute<T extends AbstractEndpointDef> extends Route<T> {
  middleware: Array<RequestHandler | ErrorRequestHandler>;
  controller: Controller<T>;
}

export const addRoutes = (r: Router, routes: ExpressRoute<any>[]): void => {
  for (const route of routes) {
    addRoute(r, route);
  }
};

export const addRoute = <T extends AbstractEndpointDef>(
  r: Router,
  route: ExpressRoute<T>
): void => {
  const { method, path, middleware, controller } = route;
  if (!method) {
    throw new Error('Method is required');
  }
  if (!path) {
    throw new Error('Path is required');
  }
  if (!controller) {
    throw new Error('Controller is required');
  }

  r[method](path, ...middleware, (req: Request, res: Response, next: NextFunction) => controller(req as TRequest<T>, res as TResponse<T>, next));
};
