import axios from 'axios';
import deepMerge from 'deepmerge';
import { urlJoin } from 'url-join-ts';

import type {
  ResponseBody,
  ResponseHeaders,
  AbstractEndpointDef,
} from '../endpoint';
import type { Route } from '../route';
import type { AbstractApiClient } from './api-client';
import type { AbstractRequest } from '../types/request-schema';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface TAxiosResponse<T extends AbstractEndpointDef>
  extends AxiosResponse<ResponseBody<T>> {
  headers: ResponseHeaders<T>;
}

/**
 * e.g.
 *
 * params = {a: 1, b: 2}
 * path = "/something/:a/:b"
 * return value would be "/something/1/2"
 *
 * @param path
 * @param params
 */
export const replaceUrlParams = (
  path: string,
  params: Record<string, unknown>
): string => {
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      const pattern = new RegExp(`(:${key})(/|$)`);
      path = path.replace(pattern, `${value}$2`);
    }
  }

  return path;
};

const safeObj = (obj: Record<string, unknown>): Record<string, unknown> =>
  obj ?? {};

const mergeOptions: deepMerge.Options = {
  arrayMerge: (destinationArray: unknown[], sourceArray: unknown[]) =>
    sourceArray,
};

const customMerge = (
  destination: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> =>
  deepMerge(safeObj(destination), safeObj(source), mergeOptions);

const getRequestOpts = async <
  E extends AbstractEndpointDef,
  DefaultReqOpt extends AbstractRequest
>(
  defaultReqOpt: DefaultReqOpt,
  req: E['req']
): Promise<AbstractEndpointDef['mergedReq']> => {
  return {
    params: customMerge(defaultReqOpt.params, req.params),
    query: customMerge(defaultReqOpt.query, req.query),
    body: customMerge(defaultReqOpt.body, req.body),
    headers: customMerge(defaultReqOpt.headers, req.headers),
  };
};

const callRoute = async <E extends AbstractEndpointDef>(
  apiClient: AbstractApiClient<E['defaultReq']>,
  route: Route<E>,
  req: E['req'],
  axiosConfig: AxiosRequestConfig = {}
): Promise<TAxiosResponse<E>> => {
  const defaultReqOpt = await apiClient.getDefaultReqOptions();
  const defaultAxiosConfig = await apiClient.getDefaultAxiosConfig();
  const { params, query, body, headers } = await getRequestOpts(
    defaultReqOpt,
    req
  );
  const { method } = route;

  if (!method) {
    throw new Error(`You cannot call a route without a method`);
  }

  if (!route.path) {
    throw new Error(`You cannot call a route without a path`);
  }

  // Build the url
  const routePath = replaceUrlParams(route.path, params);
  const url = urlJoin(apiClient.getBaseUrl(), routePath);

  // Make the request
  const config: AxiosRequestConfig = {
    validateStatus: (status) => status >= 200 && status < 300,
    ...defaultAxiosConfig,
    method,
    url,
    // Just in case this has slipped in as part of the default axios config
    baseURL: undefined,
    params: query,
    data: body,
    headers,
    ...axiosConfig,
  };

  return axios.request(config);
};

type RouteRequestCallable<T extends AbstractEndpointDef> = (
  req: T['req'],
  axiosConfig?: AxiosRequestConfig
) => Promise<TAxiosResponse<T>>;

export const createRouteRequest = <T extends AbstractEndpointDef>(
  apiClient: AbstractApiClient<T['defaultReq']>,
  route: Route<T>
): RouteRequestCallable<T> => {
  return async (
    req: T['req'],
    axiosConfig?: AxiosRequestConfig
  ): Promise<TAxiosResponse<T>> => {
    return callRoute<T>(apiClient, route, req, axiosConfig);
  };
};
