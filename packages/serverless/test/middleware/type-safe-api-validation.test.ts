import { CreateDogEndpointDef, postDogRoute } from 'example-api-spec';
import { TypesafeApiEvent, validate, OnValidationError } from '../../src';

describe('validate', () => {
  it('Should pass validation', async () => {
    const request: CreateDogEndpointDef['mergedReq'] = {
      params: {},
      query: {},
      body: {
        name: 'name of the dog',
        breed: 'breed of the dog',
      },
      headers: {
        myheader: 'myheader',
      },
    };

    const event = {
      typesafeApi: request,
    } as TypesafeApiEvent<CreateDogEndpointDef>;

    const onError: OnValidationError<CreateDogEndpointDef> = jest.fn();

    await validate(
      {
        onError,
        route: postDogRoute,
      },
      event
    );

    expect(onError).not.toHaveBeenCalled();
  });

  it('Should pass validation', async () => {
    const event = {
      typesafeApi: {
        params: {},
        query: {
          badKey: 'example',
        },
        body: {
          name: 'name of the dog',
          // breed is missing
        },
        headers: {
          // myheader is missing
        },
      },
    } as TypesafeApiEvent<CreateDogEndpointDef>;

    const onError: OnValidationError<CreateDogEndpointDef> = jest.fn(
      async (zodError) => {
        expect(zodError.errors).toEqual([
          {
            code: 'invalid_type',
            expected: 'never',
            received: 'string',
            path: ['query', 'badKey'],
            message: 'Expected never, received string',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['body', 'breed'],
            message: 'Required',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['headers', 'myheader'],
            message: 'Required',
          },
        ]);
      }
    );

    await validate(
      {
        onError,
        route: postDogRoute,
      },
      event
    );

    expect(onError).toBeCalledTimes(1);
  });
});
