import { AbstractEndpointDef } from './endpoint';

// Generics are required here even though they are not directly used in this interface.
// This is used to tie endpoint defs to their respective routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Route<T extends AbstractEndpointDef> {
  path: string;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
}
