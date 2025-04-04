import { AxiosError, AxiosRequestConfig } from 'axios';
import { internalServerErrorBody, startApp } from './example-express';
import {
  GetDogEndpointDef,
  GetDogErrorType,
  HeaderTestEndpointDef,
  defaultReqOptions,
  RootApiClient,
  clearDogDB,
  scoobyDoo,
} from 'example-api-spec';
import {
  EasyErrorBody,
  ErrorHandlers,
  handleError,
  ResponseBody,
} from '@typesafe-api/core';

export const OBJECT_ID_STRING = /^[a-f\d]{24}$/i;

const defaultHeaderTestResp: ResponseBody<HeaderTestEndpointDef> = {
  headerValue: defaultReqOptions.headers.myheader,
};

const getDogErrorHandlers: ErrorHandlers<GetDogEndpointDef> = {
  400: jest.fn(),
  403: jest.fn(),
  404: jest.fn(),
  500: jest.fn(),
};

const zeroContent: AxiosRequestConfig = { maxContentLength: 0 };

const expectMaxContentSizeError = async (resp: Promise<unknown>) =>
  expect(resp).rejects.toThrow(/maxContentLength size of 0 exceeded/);

let baseUrl: string;
let server: any;
let rootApiClient: RootApiClient;

beforeAll(async () => {
  const appStarted = await startApp();
  baseUrl = appStarted.baseUrl;
  server = appStarted.server;
  clearDogDB();

  const apiParams = { baseUrl, defaultReqOptions };
  rootApiClient = new RootApiClient(apiParams);
});

afterAll(async () => {
  clearDogDB();
  server.close();
});

it('Test Root API (headers and default params)', async () => {
  const hitEndpont = async (options: HeaderTestEndpointDef['req']) => {
    const resp = await rootApiClient.headerTest(options);
    return resp.data;
  };

  // Test with no options
  expect(await hitEndpont({})).toStrictEqual(defaultHeaderTestResp);

  // Test headers object but not key-values
  expect(await hitEndpont({ headers: {} })).toStrictEqual(
    defaultHeaderTestResp
  );

  // Test with custom value
  const customValue = 'custom-value';
  const expectedCustom: ResponseBody<HeaderTestEndpointDef> = {
    headerValue: customValue,
  };
  expect(
    await hitEndpont({ headers: { myheader: customValue } })
  ).toStrictEqual(expectedCustom);
});

it('Test response headers', async () => {
  const resp = await rootApiClient.headerTest({});
  expect(resp.data).toStrictEqual(defaultHeaderTestResp);
  expect(resp.headers['test-header']).toBe(defaultHeaderTestResp.headerValue);
});

it('Test default axios config', async () => {
  const axiosTestClient = new RootApiClient({
    baseUrl,
    axiosConfig: zeroContent,
  });
  await expectMaxContentSizeError(axiosTestClient.headerTest({}));
});

it('Test request axios config', async () => {
  const axiosTestClient = new RootApiClient({
    baseUrl,
  });
  const resp = axiosTestClient.headerTest({}, zeroContent);
  await expectMaxContentSizeError(resp);
});

it('Dog API', async () => {
  const dogClient = rootApiClient.dog();

  // Create a dog
  const createResp = await dogClient.createDog({
    body: scoobyDoo,
  });
  const respBody = createResp.data;
  const { _id } = respBody;
  expect(_id).toMatch(OBJECT_ID_STRING);
  const dogWithId = {
    ...scoobyDoo,
    _id,
  };
  expect(respBody).toStrictEqual(dogWithId);

  // Try to get the same dog
  const getOneResp = await dogClient.getDog({
    params: {
      _id,
    },
  });
  expect(getOneResp.data).toStrictEqual(dogWithId);

  // Get all the dogs
  const getAllResp = await dogClient.getDogs({
    query: {},
  });
  expect(getAllResp.data).toStrictEqual([dogWithId]);

  // Try to get a dog that doesn't exist
  const fakeId = 'not-a-real-dog';
  try {
    await dogClient.getDog({
      params: {
        _id: fakeId,
      },
    });
  } catch (err) {
    // Check the error is returned as expected
    const e = err as AxiosError<GetDogErrorType>;
    const expectedError: EasyErrorBody = {
      msg: `No dog with _id ${fakeId} could be found`,
    };
    expect(e.response?.data).toStrictEqual(expectedError);
    expect(e.response?.status).toBe(404);

    // Test handle error works correctly
    handleError(e, getDogErrorHandlers);
    expect(getDogErrorHandlers['404']).toBeCalled();
    expect(getDogErrorHandlers['500']).toBeCalledTimes(0);
  }
});

it('Test default error handling', async () => {
  try {
    await rootApiClient.internalErrorTest({});
  } catch (err) {
    // Check the error is returned as expected
    const e = err as AxiosError<GetDogErrorType>;
    expect(e.response?.data).toStrictEqual(internalServerErrorBody);
    expect(e.response?.status).toBe(500);
  }
});
