import { Environment } from './environment.model';
import { Header } from './route.model';

export interface MockoonServerOptions {
  /**
   * Method used by the library to refresh the environment information
   */
  refreshEnvironmentFunction?: (environmentUUID: string) => Environment;

  /**
   * List of duplicated routes UUIDs in the environment
   */
  duplicatedRouteUUIDs?: Set<string>;
}

/**
 * Transaction object containing req/res information after response is closed
 */
export type Transaction = {
  request: {
    method: string;
    urlPath: string | null;
    route: string | null;
    params: { name: string; value: string }[];
    queryParams: { name: string; value: string }[];
    body: any;
    headers: Header[];
  };
  response: {
    statusCode: number;
    headers: Header[];
    body: string;
  };
  proxied: boolean;
  routeUUID: string;
  routeResponseUUID: string;
};
