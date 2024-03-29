# typesafe-api

### Let your compiler tell you if your API is broken.

We have typesafe frontends and typesafe backends, why not typesafe APIs?

This library will enable you to define your API spec in pure TS, easily create an API client to 
consume it, and implement routes, handlers and middleware on the server side.

This makes for speedy integration and oh so easy maintenance, you'll never miss a parameter in a request again!

#### Recommended Repo Architecture

The following dependency diagram show the suggested project architecture you should use to 
define your API. 

![alt text](../../docs/images/repo-archetecture.png "Repo architecture diagram")

This can be implemented using either:

Polyrepo

* Publish your API spec as a npm module then import it into backend and consuming services. Use 
[npm link](https://docs.npmjs.com/cli/v7/commands/npm-link) during development it will save you tones of time!


Monorepo

* [NX](https://nx.dev/) is a great way to implement this and solves a lot of the issues
  associated with monorepo. This works really well with `typesafe-api` as it saves quite a bit of dependency wrangling but obviously 
it's not for everyone. 

## Getting started

Here is a minimal example to get you started...

* N.B. this example implements some dummy authentication. Just in case... please don't
implement authentication like this in a production app you will have a bad time!  

### API Spec 

We are going to define an basic API with just one endpoint.

When defining an API endpoint there are two main concepts we need to think about.

1)  `EndpointDef`
    
    You need to create an custom `EndpointDef` for each endpoint in your API. This type represents
    the interface for the API endpoint e.g.
     * URL params
     * Query params, 
     * The request body 
     * Any headers that must be set
     * The expected response type
     * What error codes can be expected to be returned by the endpoint
 
2) `Route`
    
    This is an object that represents the API path and method that should be used when calling the 
    endpoint
    
First let's define some useful interfaces for our API

```ts
// ../../../nx-typesafe-api-example/libs/api-spec/src/api.ts

import {
  AbstractEndpointDef,
  EndpointDef,
  ErrorType,
  ReqOptions,
  ResOptions,
  TypesafeHttpError,
} from '@typesafe-api/core';

// These are the options that will be sent with every request to our API. In this example
// we are going to implement some dummy authentication for our API using the
// "authorization" header. If you don't have any default parameters then just use {@link ReqOptions}
// instead of defining a custom interface
export interface DefaultReqOpts extends ReqOptions {
  headers: {
    // If using express these headers keys must always be lowercase
    authorization: string;
  };
}

// Here we define the standard error codes we expect to see. All API should expect a 500
// (nothing is perfect). As we are implementing authentication let's add 403 as well
// You can add error codes to specific endpoints later
export type DefaultErrorCodes = 500 | 403;

export interface ApiErrorBody {
  msg: string;
}

export type ApiErrorType<S extends number> = ErrorType<S, ApiErrorBody>;

export type AbstractApiErrorType = ApiErrorType<number>;

export class ApiHttpError extends TypesafeHttpError<AbstractApiErrorType> {}

// Writing a helper function like this can make it easier to throw errors and keep them typesafe
export const throwHttpError = <T extends AbstractEndpointDef>(statusCode: T["errorType"]["statusCode"], msg: string) => {
  throw new ApiHttpError({
    statusCode: statusCode,
    body: {
      msg,
    },
  });
};

// Create an interface to help us build our endpoints, this just saves adding {@code DefaultReqOpts}
// and {@code DefaultErrorType} to every endpoint we create
export type ExampleApiEndpoint<
  ReqOpt extends ReqOptions,
  RespOpt extends ResOptions,
  E extends AbstractApiErrorType = ApiErrorType<DefaultErrorCodes>
> = EndpointDef<DefaultReqOpts, ReqOpt, RespOpt, E>;

```

Now let's define an endpoint...
 
```ts
// ../../../nx-typesafe-api-example/libs/api-spec/src/routes/hello-world.ts

import { ReqOptions, ResOptions, Route } from '@typesafe-api/core';
import { ApiErrorType, DefaultErrorCodes, ExampleApiEndpoint } from '../api';

// Define the all parameters that are required to make the request
export interface HelloWorldReq extends ReqOptions {
  query: {
    yourName: string;
  };
}

// Define the response type we wil receive for the request
export interface HelloWorldResp extends ResOptions {
  body: {
    msg: string;
    date: Date;
  };
  headers: {
    example: string;
  };
}

// Define any error that may be thrown by the endpoint, the default is just `500`
export type HelloWorldErrors = ApiErrorType<DefaultErrorCodes | 400>;

// Create the endpoint definition this type encapsulates the full endpoint spec
export type HelloWorldEndpointDef = ExampleApiEndpoint<
  HelloWorldReq,
  HelloWorldResp,
  HelloWorldErrors
>;

// Define the route at which the endpoint belongs
export const helloWoldRoute: Route<HelloWorldEndpointDef> = {
  method: 'get',
  path: '/hello-world',
};

```

Now we have our route and endpoint defined we can very easily create an `ApiClient` for it.

```ts
// ../../../nx-typesafe-api-example/libs/api-spec/src/api-client.ts

import {AbstractApiClient, createRouteRequest} from '@typesafe-api/core';
import {helloWoldRoute, HelloWorldEndpointDef} from './routes';
import {DefaultReqOpts} from './api';

// Create custom class that we will use as the super class for all our client classes
// that support {@link DefaultReqOpts}
class CustomApiClient extends AbstractApiClient<DefaultReqOpts> {}

// Create a client for our endpoint
class HelloApiClient extends CustomApiClient {

  // Use createRouteRequest(..) to create a method to execute your request
  private _helloWorld = createRouteRequest<HelloWorldEndpointDef>(this, helloWoldRoute);

  // Abstract away the details of the request, devs writing calling code shouldn't need
  // to think about them
  public helloWorld = (yourName: string) => this._helloWorld({query: {yourName}});
}

// Depending how many endpoints you have you may want to start nesting your API clients like this
export class RootApiClient extends CustomApiClient {

  // You can also add a custom constructor to abstract away the details of your
  // default request options
  constructor(baseUrl: string, private apiKey: string) {
    super({
      baseUrl,
    });
  }

  public async getDefaultReqOptions(): Promise<DefaultReqOpts> {
    return {
      headers: {
        authorization: this.apiKey
      }
    };
  }

// Here we add the {@link HelloApiClient} as a child of {@link RootApiClient}
  public helloApi = (): HelloApiClient => new HelloApiClient(this.getChildParams());
}

```

Great that's our API spec all sorted. Now all that remains make sure __everything is exported__ in 
your entry point for your module e.g.

```ts
// ../../../nx-typesafe-api-example/libs/api-spec/src/index.ts

export * from './routes';
export * from './api-client';
export * from './api';

```
 
Now publish your spec as an npm module. In this example we are using an [NX](https://nx.dev/) monorepo
so the spec is imported from `@nx-typesafe-api-example/api-spec`.

### Backend

The following backends currently have full support (follow the link to view docs):

* [Express](../express/README.md)

If you don't use any of these you should still get a lot out of importing the `EndpointDef`s and `Routes` into your project.

Contributions very welcome if you find a way to fully integrate with any other server frameworks :)

### Frontend

Great so now we have a working endpoint we want to use it. In this example we will use  a simple 
react app. However, the steps are very similar for any backend systems you want to consume your API.

One you have your API spec installed you can define a component similar to this

```tsx
// ../../../nx-typesafe-api-example/apps/frontend/src/app/app.tsx

import React, { useState } from 'react';
import { ErrorHandlers, handleError } from '@typesafe-api/core';
import {
  HelloWorldEndpointDef,
  RootApiClient,
} from '@nx-typesafe-api-example/api-spec';
import {
  Box,
  Button,
  CardHeader,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';

const expressUrl = 'http://localhost:7809';
const serverlessUrl = ' http://localhost:7810/dev';

enum Backend {
  EXPRESS = 'express',
  SERVERLESS = 'serverless',
}

export function App() {
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [responseText, setResponseText] = useState('');
  const [backend, setBackend] = useState(Backend.EXPRESS);

  // Init the API client
  const baseUrl = backend === Backend.EXPRESS ? expressUrl : serverlessUrl;
  const helloApi = new RootApiClient(baseUrl, apiKey).helloApi();

  // Set up error handlers in case the API call fails
  // (the compiler will tell you if you are missing any error codes)
  const callHelloWorldError: ErrorHandlers<HelloWorldEndpointDef> = {
    500: (err) => {
      alert('Something went wrong please check console logs');
      console.error(err);
    },
    403: () => alert('Your API key is not valid.'),
    400: (err) => {
      const response = err.response;
      if (!response) {
        throw err;
      }
      setResponseText(response.data.body.msg);
    },
  };

  // Define onClick function that calls the endpoint and handles any errors
  const onClick = async () => {
    try {
      const response = await helloApi.helloWorld(name);
      const { msg } = response.data;
      setResponseText(msg);
    } catch (err) {
      handleError(err as any, callHelloWorldError);
    }
  };

  const nameLabel = 'Enter your name';
  const apiKeyLabel = 'Enter your API key (it\'s "my-api-key")';
  const margin = 5;
  return (
    <Container style={{ width: '50%' }}>
      <CardHeader
        title="frontend using typesafe-api"
        variant="contained"
        style={{ textAlign: 'center' }}
      />
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Backend</FormLabel>
        <RadioGroup
          onChange={(e) => setBackend(e.target.value as Backend)}
          value={backend}
        >
          <FormControlLabel
            control={<Radio />}
            label="Express"
            value={Backend.EXPRESS}
          />
          <FormControlLabel
            control={<Radio />}
            label="Serverless"
            value={Backend.SERVERLESS}
          />
        </RadioGroup>
      </FormControl>
      <form noValidate autoComplete="off centre">
        <TextField
          label={nameLabel}
          fullWidth
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label={apiKeyLabel}
          fullWidth
          onChange={(e) => setApiKey(e.target.value)}
        />
      </form>
      <Typography align="center">
        <Box m={margin}>
          <Button variant="contained" color="primary" onClick={onClick}>
            Say hi
          </Button>
        </Box>
        <Box m={margin}>{responseText}</Box>
      </Typography>
    </Container>
  );
}

export default App;

```

And that's it you now have a typesafe API. The full source code for this example can be found
 [here](https://github.com/stuart-clark-45/nx-typesafe-api-example) if you want to try it for yourself.
 
## Feature Ideas / Improvements / TODOs
* Support for serverless middleware
* Documentation for serverless integrations
* Create reference docs for `typesafe-api`
* Allow for clients in out languages to created (convert to json schema first?)
* Generate api docs from `Route`s and `EndpointDef`s
 
 
