import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { urlJoin } from 'url-join-ts';
import { ResponseBody, ResponseHeaders, AbstractEndpointDef } from '../endpoint';
import { Route } from '../route';
import deepMerge from 'deepmerge';
import { AbstractApiClient } from './api-client';
import { AbstractRequest } from '../types/request-schema';

export interface TAxiosResponse<T extends AbstractEndpointDef> extends AxiosResponse<ResponseBody<T>> {
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
export const replaceUrlParams = (path: string, params: Record<string, unknown>): string => {
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      const pattern = new RegExp(`(:${key})(/|$)`);
      path = path.replace(pattern, `${value}$2`);
    }
  }

  return path;
};

const getRequestOpts = async <E extends AbstractEndpointDef, DefaultReqOpt extends AbstractRequest>(
  defaultReqOpt: DefaultReqOpt,
  req: E['req']
) => {
  const mergeOptions: deepMerge.Options = {
    arrayMerge: (destinationArray: any[], sourceArray: any[]) => sourceArray,
  };
  return {
    params: deepMerge(defaultReqOpt.params, req.params, mergeOptions),
    query: deepMerge(defaultReqOpt.query, req.query, mergeOptions),
    body: deepMerge(defaultReqOpt.body, req.body, mergeOptions),
    headers: deepMerge(defaultReqOpt.headers, req.headers, mergeOptions),
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
  const { params, query, body, headers } = await getRequestOpts(defaultReqOpt, req);
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
    ...(axiosConfig),
  };

  return axios.request(config);
};

type RouteRequestCallable<T extends AbstractEndpointDef> = (
  options: T['req']
) => Promise<TAxiosResponse<T>>;

export const createRouteRequest = <T extends AbstractEndpointDef>(
  apiClient: AbstractApiClient<T['defaultReq']>,
  route: Route<T>
): RouteRequestCallable<T> => {
  return async (options: T['req']): Promise<TAxiosResponse<T>> => {
    return callRoute<T>(apiClient, route, options);
  };
};
