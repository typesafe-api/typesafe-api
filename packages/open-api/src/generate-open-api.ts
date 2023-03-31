import {
  HeadersObject,
  OpenAPIObject,
  ParameterObject,
  RequestBodyObject,
  ResponsesObject,
} from 'openapi3-ts';
import { EndpointDefinition } from './endpoint-definitions';
import {
  ParameterLocation,
  PathsObject,
} from 'openapi3-ts/dist/mjs/model/OpenApi';
import { OperationObject, ResponseObject } from 'openapi3-ts/src/model/OpenApi';
import { Definition } from 'typescript-json-schema';
import jsonSchemaParser, { Schema } from 'json-schema-parser';

interface ParsedJsonSchema {
  properties: {
    responseOptions: {
      description: string;
      properties: {
        body: Schema;
        headers: Schema;
      };
    };
    requestOptions: {
      properties: {
        body: Schema;
        query: Schema;
        params: Schema;
        headers: Schema;
      };
    };
    errorType: {
      description?: string;
      properties: {
        statusCode: {
          enum: number[];
        };
        body: Schema;
      };
    };
  };
}

export interface GenerateOpenApiParams {
  endpointDefs: EndpointDefinition[];
  title: string;
  version: string;
}

const parseHeaders = (headers: Schema): HeadersObject => {
  const { properties } = headers;
  const headersObj: HeadersObject = {};
  for (const key of Object.keys(properties)) {
    headersObj[key] = {
      schema: properties[key],
    };
  }
  return headersObj;
};

const parseRequestBody = (
  parsedSchema: ParsedJsonSchema
): RequestBodyObject | undefined => {
  const { body } = parsedSchema.properties.requestOptions.properties;

  const noBodyRequired =
    body.type === 'object' && !Object.keys(body.properties).length;
  if (noBodyRequired) {
    return undefined;
  }

  return {
    content: {
      'application/json': {
        schema: body,
      },
    },
  };
};

const parseResponseOptions = (
  parsedSchema: ParsedJsonSchema
): ResponseObject => {
  const { properties, description = '' } =
    parsedSchema.properties.responseOptions;
  const { body, headers } = properties;
  return {
    description,
    content: {
      'application/json': {
        schema: body,
      },
    },
    headers: parseHeaders(headers),
  };
};

const parseErrorResponses = (
  parsedSchema: ParsedJsonSchema
): ResponsesObject => {
  const { headers } = parsedSchema.properties.responseOptions.properties;
  const errorTypeProps = parsedSchema.properties.errorType.properties;
  const description = parsedSchema.properties.errorType.description ?? '';
  const statusCodes = errorTypeProps.statusCode.enum;
  const body = errorTypeProps.body;

  const responses: ResponsesObject = {};
  for (const statusCode of statusCodes) {
    responses[statusCode.toString(10)] = {
      description,
      content: {
        'application/json': {
          schema: body,
        },
      },
      headers: parseHeaders(headers),
    };
  }

  return responses;
};

const parseParameters = (parsedSchema: ParsedJsonSchema): ParameterObject[] => {
  const parsedParams: ParameterObject[] = [];

  const addParams = (location: ParameterLocation, obj: Schema) => {
    // If we have only 1 optional field in the typescript type then it is treated as a union e.g. {name: string} | {}.
    // The last element of {@code obj.anyOf} is all we need to process as the first is just an empty
    // object
    const selectedObj = obj.anyOf ? obj.anyOf[obj.anyOf.length - 1] : obj;

    for (const [name, schema] of Object.entries(selectedObj.properties) as [
      string,
      Schema
    ]) {
      parsedParams.push({
        in: location,
        name,
        schema,
        required: !!selectedObj.required?.includes(name),
      });
    }
  };

  const { query, params, headers } =
    parsedSchema.properties.requestOptions.properties;

  addParams('query', query);

  addParams('path', params);

  addParams('header', headers);

  return parsedParams;
};

const buildOperationObject = (jsonSchema: Definition): OperationObject => {
  const parsedSchema = jsonSchemaParser.parse(jsonSchema);

  const operation: OperationObject = {
    responses: {
      '200': parseResponseOptions(parsedSchema),
      ...parseErrorResponses(parsedSchema),
    },
  };

  const parameters = parseParameters(parsedSchema);
  if (parameters.length) {
    operation.parameters = parameters;
  }

  const requestBody = parseRequestBody(parsedSchema);
  if (requestBody) {
    operation.requestBody = requestBody;
  }

  return operation;
};

const parseEndpointDefs = async (
  endpointDefs: EndpointDefinition[]
): Promise<PathsObject> => {
  const pathsObj: PathsObject = {};
  for (const endpointDef of endpointDefs) {
    const { route, jsonSchema } = endpointDef;
    const { path, method } = route;

    if (!pathsObj[path]) {
      pathsObj[path] = {};
    }

    pathsObj[path][method] = buildOperationObject(jsonSchema);
  }
  return pathsObj;
};

export const generateOpenApi = async (
  params: GenerateOpenApiParams
): Promise<OpenAPIObject> => {
  const { title, version, endpointDefs } = params;
  return {
    info: {
      title,
      version,
    },
    openapi: '3.0.3',
    paths: await parseEndpointDefs(endpointDefs),
  };
};
