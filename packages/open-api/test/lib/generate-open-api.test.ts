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

  expect(apiSpec).toEqual({
    info: {
      title: 'Test API',
      version: '1',
    },
    openapi: '3.0.3',
    paths: {
      '/dog': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    items: {
                      properties: {
                        _id: {
                          type: 'string',
                        },
                        breed: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                      },
                      required: ['_id', 'breed', 'name'],
                      type: 'object',
                    },
                    type: 'array',
                  },
                },
              },
              description: undefined,
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
              headers: {},
            },
          },
        },
        post: {
          requestBody: {
            properties: {
              breed: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
            },
            required: ['breed', 'name'],
            type: 'object',
          },
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      _id: {
                        type: 'string',
                      },
                      breed: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                    required: ['_id', 'breed', 'name'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
              headers: {},
            },
          },
        },
      },
      '/dog/:_id': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      _id: {
                        type: 'string',
                      },
                      breed: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                    required: ['_id', 'breed', 'name'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
              headers: {},
            },
            '404': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
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
              description: undefined,
              headers: {},
            },
          },
        },
      },
      '/header-tst': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      headerValue: {
                        type: 'string',
                      },
                    },
                    required: ['headerValue'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
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
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
              headers: {
                'test-header': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      '/internal-error': {
        get: {
          responses: {
            '200': {
              content: {
                'application/json': {
                  schema: {
                    properties: {},
                    type: 'object',
                  },
                },
              },
              description: undefined,
              headers: {},
            },
            '500': {
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      msg: {
                        type: 'string',
                      },
                    },
                    required: ['msg'],
                    type: 'object',
                  },
                },
              },
              description: undefined,
              headers: {},
            },
          },
        },
      },
    },
  });
});
