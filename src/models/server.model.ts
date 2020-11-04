import { Response } from 'express';
import { Environment } from './environment.model';

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

export type MockoonResponse = Response;
