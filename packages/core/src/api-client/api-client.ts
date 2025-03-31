import { ReqOptions } from '../endpoint';

export type ApiClientParams<DefaultReqOpt extends ReqOptions> = {
  baseUrl?: string;
  parent?: AbstractApiClient<DefaultReqOpt>;
};

export abstract class AbstractApiClient<T extends ReqOptions> {
  constructor(private params: ApiClientParams<T>) {}

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
      throw Error('getDefaultReqOptions(..) must be overridden if client has no parent');
    }
    return parent.getDefaultReqOptions();
  }

  public getChildParams(): ApiClientParams<T> {
    return {
      parent: this,
    };
  }
}
