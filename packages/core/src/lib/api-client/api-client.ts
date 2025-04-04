import { AxiosRequestConfig } from 'axios';
import { AbstractRequest } from '../types/request-schema';

export type ApiClientParams<TDefaultRequest extends AbstractRequest> = {
  baseUrl?: string;
  parent?: AbstractApiClient<TDefaultRequest>;
  axiosConfig?: AxiosRequestConfig;
};

export abstract class AbstractApiClient<T extends AbstractRequest> {
  constructor(protected params: ApiClientParams<T>) {}

  public getBaseUrl(): string {
    const { parent, baseUrl } = this.params;
    const derivedBaseUrl = parent?.getBaseUrl() || baseUrl;
    if (!derivedBaseUrl) {
      throw new Error('baseUrl could not be derived from parent or baseUrl');
    }
    return derivedBaseUrl;
  }

  public async getDefaultReqOptions(): Promise<T> {
    const parent = this.params.parent;
    if (!parent) {
      throw Error(
        'getDefaultReqOptions(..) must be overridden if client has no parent'
      );
    }
    return parent.getDefaultReqOptions();
  }

  public async getDefaultAxiosConfig(): Promise<AxiosRequestConfig> {
    const parent = this.params.parent;
    if (!parent) {
      return this.params.axiosConfig ?? {};
    }
    return parent.getDefaultAxiosConfig();
  }

  public getChildParams(): ApiClientParams<T> {
    return {
      parent: this,
    };
  }
}
