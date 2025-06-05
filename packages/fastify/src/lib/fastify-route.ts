import type { Controller, TRequest, TResponse } from './controller';
import type { AbstractEndpointDef, Route } from '@typesafe-api/core';
import type {
  FastifyInstance,
  preHandlerHookHandler,
  HTTPMethods,
} from 'fastify';

export interface FastifyRoute<T extends AbstractEndpointDef> extends Route<T> {
  preHandler?: preHandlerHookHandler | preHandlerHookHandler[];
  controller: Controller<T>;
}

export const addRoutes = (
  f: FastifyInstance,
  routes: FastifyRoute<AbstractEndpointDef>[]
): void => {
  for (const route of routes) {
    addRoute(f, route);
  }
};

export const addRoute = <T extends AbstractEndpointDef>(
  f: FastifyInstance,
  route: FastifyRoute<T>
): void => {
  const { method, path, controller, preHandler } = route;
  if (!method) {
    throw new Error('Method is required');
  }
  if (!path) {
    throw new Error('Path is required');
  }
  if (!controller) {
    throw new Error('Controller is required');
  }

  f.route({
    method: method.toUpperCase() as HTTPMethods,
    url: path,
    preHandler,
    handler: async (req, reply) =>
      controller(req as TRequest<T>, reply as TResponse<T>),
  });
};
