import { Environment } from '../models/environment.model';
import { Header, Route, RouteResponse } from '../models/route.model';

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
export const IsEmpty = (obj) => {
  return (
    [Object, Array].includes((obj || {}).constructor) &&
    !Object.entries(obj || {}).length
  );
};

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
