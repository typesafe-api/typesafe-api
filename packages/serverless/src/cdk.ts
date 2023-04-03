import { IResource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AbstractEndpointDef } from '@typesafe-api/core';
import { TypesafeApiSeverlessFnc } from './handler';

export class CdkLambdaFunctionBuilder {
  protected resourceMap: Record<string, IResource> = {};

  constructor(private api: RestApi) {
  }

  addFunction(functionDef: TypesafeApiSeverlessFnc<AbstractEndpointDef>): this {
    const { route } = functionDef;

    this.resourceForPath(route.path);

    return this;
  }

  protected resourceForPath(path: string): IResource {
    // Remove the leading / from the path
    path = path.startsWith('/') ? path.substring(1) : path;

    const pathParts = path.split('/');

    let lastResource: IResource = this.api.root;
    let resourceMapKey = '';
    for (const part of pathParts) {
      resourceMapKey = resourceMapKey + '/' + part;

      // Create the resource if it doesn't exist
      if (!this.resourceMap[resourceMapKey]) {
        // Handle path parameters, typesafe-api expects `/foo/:bar` notation
        // where as cdk expects `/foo/{bar}`
        const resourceName = part.startsWith(':')
          ? `{${part.substring(1)}}`
          : part;

        this.resourceMap[resourceMapKey] = lastResource.addResource(resourceName);
      }

      lastResource = this.resourceMap[resourceMapKey]
    }

    return lastResource;
  }
}
