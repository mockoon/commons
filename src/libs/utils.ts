import { Request, Response } from 'express';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { parse as urlParse } from 'url';
import { Environment } from '../models/environment.model';
import { Header, Route, RouteResponse } from '../models/route.model';
import { Transaction } from '../models/server.model';

/**
 * Extract the content-type from an array of headers
 *
 * @param headers
 */
export const GetContentType = (headers: Header[]): string | null => {
  const contentTypeHeader = headers.find(
    (header) => header.key.toLowerCase() === 'content-type'
  );

  if (contentTypeHeader) {
    return contentTypeHeader.value;
  }

  return null;
};

/**
 * Return a route response's content-type.
 * Environment's content-type is overridden by route's content-type
 *
 * @param environment
 * @param routeResponse
 */
export const GetRouteResponseContentType = (
  environment: Environment,
  routeResponse: RouteResponse
) => {
  const routeResponseContentType = GetContentType(routeResponse.headers);
  const environmentContentType = GetContentType(environment.headers);

  return routeResponseContentType || environmentContentType || '';
};

/**
 * Test if URL is valid
 *
 * @param URL
 */
export const IsValidURL = (address: string): boolean => {
  try {
    const myURL = new URL(address);

    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Test a header validity
 *
 * @param headerName
 */
export const TestHeaderValidity = (headerName: string) => {
  if (
    headerName &&
    headerName.match(/[^A-Za-z0-9\-\!\#\$\%\&\'\*\+\.\^\_\`\|\~]/g)
  ) {
    return true;
  }

  return false;
};

/**
 * Check if an Object or Array is empty
 *
 * @param obj
 */
export const IsEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

/**
 * Return a Set of the duplicated route UUIDs in an environment
 *
 * @param environment
 */
export const ListDuplicatedRouteUUIDs = (
  environment: Environment
): Set<string> => {
  const duplicates = new Set<string>();

  environment.routes.forEach((route: Route, routeIndex: number) => {
    environment.routes.forEach((otherRoute: Route, otherRouteIndex: number) => {
      if (
        otherRouteIndex > routeIndex &&
        otherRoute.endpoint === route.endpoint &&
        otherRoute.method === route.method
      ) {
        duplicates.add(otherRoute.uuid);
      }
    });
  });

  return duplicates;
};

/**
 * Sort by ascending order
 *
 * @param a
 * @param b
 */
export const AscSort = (a, b) => {
  if (a.key < b.key) {
    return -1;
  } else {
    return 1;
  }
};

/**
 * Transform http headers objects to Mockoon's Header key value object
 *
 * @param object
 */
export const TransformHeaders = (
  headers: IncomingHttpHeaders | OutgoingHttpHeaders
): Header[] =>
  Object.keys(headers).reduce<Header[]>((newHeaders, key) => {
    const headerValue = headers[key];
    let value = '';

    if (headerValue !== undefined) {
      if (Array.isArray(headerValue)) {
        value = headerValue.join(',');
      } else {
        value = headerValue.toString();
      }
    }

    newHeaders.push({ key, value });

    return newHeaders;
  }, []);

/**
 * Create a Transaction object from express req/res.
 * To be used after the response closes
 *
 * @param request
 * @param response
 */
export const CreateTransaction = (
  request: Request,
  response: Response
): Transaction => ({
  request: {
    method: request.method,
    urlPath: urlParse(request.originalUrl).pathname,
    route: request.route ? request.route.path : null,
    params: request.params
      ? Object.keys(request.params).map((paramName) => ({
          name: paramName,
          value: request.params[paramName]
        }))
      : [],
    queryParams: request.query
      ? Object.keys(request.query).map((queryParamName) => ({
          name: queryParamName,
          value: request.query[queryParamName] as string
        }))
      : [],
    body: request.body,
    headers: TransformHeaders(request.headers).sort(AscSort)
  },
  response: {
    statusCode: response.statusCode,
    headers: TransformHeaders(response.getHeaders()).sort(AscSort),
    body: response.body
  },
  routeResponseUUID: response.routeResponseUUID,
  routeUUID: response.routeUUID,
  proxied: request.proxied || false
});
