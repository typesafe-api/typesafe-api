import { generateOpenApi } from '../../src/lib/generate-open-api';
import { endpointDefinitions } from '@typesafe-api/open-api';
import path from 'node:path';

it('generateOpenApi(..)', async () => {
  const endpointDefs = await endpointDefinitions({
    tsConfigFile: path.join(__dirname, '../../../core/tsconfig.spec.json'),
    files: [path.join(__dirname, '../../../core/test/example-routes.ts')],
  });

  const title = 'Test API';
  const version = '1';

  const apiSpec = await generateOpenApi({
    endpointDefs,
    title,
    version,
  });

  console.log(JSON.stringify(apiSpec, null, 2));

  expect(apiSpec).toEqual({
    info: {
      title: 'Test API',
      version: '1',
    },
    openapi: '3.0.3',
    paths: {
      '/dog': {
        post: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                      breed: {
                        type: 'string',
                      },
                    },
                    required: ['_id', 'breed', 'name'],
                  },
                },
              },
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                  },
                },
              },
              headers: {},
            },
          },
          parameters: [
            {
              in: 'header',
              name: 'myheader',
              schema: {
                type: 'string',
              },
              required: true,
            },
          ],
          requestBody: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              breed: {
                type: 'string',
              },
            },
            required: ['breed', 'name'],
          },
        },
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        breed: {
                          type: 'string',
                        },
                      },
                      required: ['_id', 'breed', 'name'],
                    },
                  },
                },
              },
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                  },
                },
              },
              headers: {},
            },
          },
          parameters: [
            {
              in: 'query',
              name: 'breed',
              schema: {
                type: 'string',
              },
              required: false,
            },
            {
              in: 'header',
              name: 'myheader',
              schema: {
                type: 'string',
              },
              required: true,
            },
          ],
        },
      },
      '/dog/search': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        breed: {
                          type: 'string',
                        },
                      },
                      required: ['_id', 'breed', 'name'],
                    },
                  },
                },
              },
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                  },
                },
              },
              headers: {},
            },
          },
          parameters: [
            {
              in: 'query',
              name: 'searchQuery',
              schema: {
                type: 'string',
              },
              required: true,
            },
            {
              in: 'query',
              name: 'breed',
              schema: {
                type: 'string',
              },
              required: false,
            },
            {
              in: 'header',
              name: 'myheader',
              schema: {
                type: 'string',
              },
              required: true,
            },
          ],
        },
      },
      '/dog/:_id': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      _id: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                      breed: {
                        type: 'string',
                      },
                    },
                    required: ['_id', 'breed', 'name'],
                  },
                },
              },
              headers: {},
            },
            '404': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                  },
                },
              },
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                  },
                },
              },
              headers: {},
            },
          },
          parameters: [
            {
              in: 'path',
              name: '_id',
              schema: {
                type: 'string',
              },
              required: true,
            },
            {
              in: 'header',
              name: 'myheader',
              schema: {
                type: 'string',
              },
              required: true,
            },
          ],
        },
      },
      '/header-tst': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      headerValue: {
                        type: 'string',
                      },
                    },
                    required: ['headerValue'],
                  },
                },
              },
              headers: {
                'test-header': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                  },
                },
              },
              headers: {
                'test-header': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
          parameters: [
            {
              in: 'header',
              name: 'myheader',
              schema: {
                type: 'string',
              },
              required: true,
            },
          ],
        },
      },
      '/internal-error': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                  },
                },
              },
              headers: {},
            },
          },
          parameters: [
            {
              in: 'header',
              name: 'myheader',
              schema: {
                type: 'string',
              },
              required: true,
            },
          ],
        },
      },
    },
  });
});
