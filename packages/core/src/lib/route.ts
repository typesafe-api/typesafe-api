import type { AbstractEndpointDef } from './endpoint';
import type { PartialAbstractRequestSchema } from './types';
import type { AbstractProcessedSchemas } from './util';

export interface RouteSchemas<T extends AbstractEndpointDef> {
  defaultReqSchema: T['defaultReqSchema'];
  reqSchema: T['reqSchema'];
  mergedReqSchema: T['mergedReqSchema'];
}

// Setting patch or method to null can be used to deploy a route without exposing it through the API
type RoutePath = string | null;
type RouteMethod = 'get' | 'post' | 'patch' | 'put' | 'delete' | null;

// Generics are required here even though they are not directly used in this interface.
// This is used to tie endpoint defs to their respective routes
export interface Route<T extends AbstractEndpointDef> {
  path: RoutePath;
  method: RouteMethod;
  schemas: RouteSchemas<T>;
}

export class RouteHelper<TDefaultSchema extends PartialAbstractRequestSchema> {
  constructor(private defaultReqSchema: TDefaultSchema) {}

  create<TEndpointDef extends AbstractEndpointDef>(params: {
    path: RoutePath;
    method: RouteMethod;
    processedSchemas: AbstractProcessedSchemas;
  }): Route<TEndpointDef> {
    const { path, method, processedSchemas } = params;
    const { reqSchema, mergedReqSchema } = processedSchemas;
    return {
      path,
      method,
      schemas: {
        defaultReqSchema: this.defaultReqSchema,
        reqSchema,
        mergedReqSchema,
      },
    };
  }
}
