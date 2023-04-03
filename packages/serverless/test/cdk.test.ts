import { IResource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CdkLambdaFunctionBuilder } from '../src/cdk';
import { App, Stack } from 'aws-cdk-lib';

class TestableCdkLambdaFunctionBuilder extends CdkLambdaFunctionBuilder {
  public resourceMap: Record<string, IResource>;
  public resourceForPath(path: string): IResource {
    return super.resourceForPath(path);
  }
}

it('Test resourceForPath(..)', async () => {
  const api = new RestApi(new Stack(new App()), 'MyApi');
  const builder = new TestableCdkLambdaFunctionBuilder(api);

  // Normal path
  builder.resourceForPath('/foo/bar');

  // Path parameter
  builder.resourceForPath('/foo/:bar');

  // No leading /
  builder.resourceForPath('foo/:bar');

  expect(Object.keys(builder.resourceMap).sort()).toEqual([
    '/foo',
    '/foo/:bar',
    '/foo/bar',
  ]);
});
