import { AbstractEndpointDef } from './endpoint';

// Generics are required here even though they are not directly used in this interface.
// This is used to tie endpoint defs to their respective routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Route<T extends AbstractEndpointDef> {
  // Setting patch or method to null can be used to deploy a route without exposing it through the API
  path: string | null;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete' | null;
  reqSchema: T['reqSchema'];
}
