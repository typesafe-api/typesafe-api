import { Controller } from './controller';
import { ErrorRequestHandler, RequestHandler, Router } from 'express';
import { AbstractEndpointDef, Route } from '@typesafe-api/core';

export interface ExpressRoute<T extends AbstractEndpointDef> extends Route {
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
  r[method](path, middleware, controller);
};
