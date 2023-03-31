# @typesafe-api/express

For context make sure to read the [main documentation](https://github.com/typesafe-api/typesafe-api/blob/main/README.md) before this file

#### Controller

Let start out by creating a `Controller` to handle our requests...

```ts
// ../../../nx-typesafe-api-example/apps/express/src/app/hello-world.ts

import { Controller, sendError, TRequest, TResponse } from '@typesafe-api/express';
import { HelloWorldEndpointDef } from '@nx-typesafe-api-example/api-spec';

export const helloWorldController: Controller<HelloWorldEndpointDef> = async (
  req: TRequest<HelloWorldEndpointDef>,
  res: TResponse<HelloWorldEndpointDef>
) => {
  // `req.query` is typesafe so you know which keys have been set in the request
  const name = req.query.yourName;

  // As an example, let's return an error the name parameter is a number
  const isNumber = (s: string) => /^\d+$/.test(s);
  if (isNumber(name)) {
    // This error object is typesafe, including the status so you can only select from the
    // statuses given in the endpoint definition
    return sendError(res, {
      statusCode: 400,
      body: {
        msg: "Surely your name isn't a number?? 😵",
      }
    });
  }

  // No surprises, this body is typesafe too!
  res.send({
    msg: `Hello ${name} from an express backend`,
    date: new Date(),
  });
};

``` 

#### Middleware

Creating middleware for our app is easy too as long as it relies on our default request options.
Here's a simple example...

```ts
// ../../../nx-typesafe-api-example/apps/express/src/app/authorize.ts

import { NextFunction, RequestHandler } from 'express';
import { ExampleApiEndpoint } from '@nx-typesafe-api-example/api-spec';
import { ReqOptions, ResOptions } from '@typesafe-api/core';
import { sendError, TRequest, TResponse } from '@typesafe-api/express';

// Create a type that can be used to represent any endpoint in our API
type AnyEndpointDef = ExampleApiEndpoint<ReqOptions, ResOptions>;

const handler = (
  req: TRequest<AnyEndpointDef>,
  res: TResponse<AnyEndpointDef>,
  next: NextFunction
) => {
  // Use {@code req.get(..)} to get headers in a typesafe way
  // Naive implementation of authentication
  // DONT TRY THIS AT HOME
  if (req.get('authorization') === 'my-api-key') {
    return next();
  }

  // This error object is typesafe, including the status so you can only select from the
  // statuses given in {@link DefaultErrorCodes} (defined in the app spec)
  sendError(res, {
    statusCode: 403,
    body: {
      msg: 'Unauthorized',
    },
  });
};

export const authorize = (): RequestHandler =>
  handler as unknown as RequestHandler;

``` 

#### Routes

Now we have a controller we just need to set up a route to it. `Controller`s are completely
compatible with `express` so this stage is optional, tho advised as it guaranties your
routes are correct.

Here is a very simple express app using our newly created `Controller`

```ts
// ../../../nx-typesafe-api-example/apps/express/src/main.ts

import express, { RequestHandler } from 'express';
import { addRoute, ExpressRoute } from '@typesafe-api/express';
import { helloWorldController } from './app/hello-world';
import {
  helloWoldRoute,
  HelloWorldEndpointDef,
} from '@nx-typesafe-api-example/api-spec';
import cors from 'cors';
import { authorize } from './app/authorize';

const app = express();

app.use(cors(), express.json());

// Define the middleware we want for the route
const middleware: RequestHandler[] = [authorize()];

// Import the route from the api-spec then add the additional fields needed for an {@link ExpressRoute}
const eHelloWorldRoute: ExpressRoute<HelloWorldEndpointDef> = {
  ...helloWoldRoute,
  middleware,
  controller: helloWorldController,
};

// Add the route to the express app
addRoute(app, eHelloWorldRoute);

// Start the server
const port = 7809;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

```
