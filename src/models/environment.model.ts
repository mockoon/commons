import { Header, Route } from './route.model';

export type Environment = {
  uuid: string;
  lastMigration: number;
  name: string;
  port: number;
  endpointPrefix: string;
  latency: number;
  routes: Route[];
  proxyMode: boolean;
  proxyRemovePrefix: boolean;
  proxyHost: string;
  proxyReqHeaders: Header[];
  proxyResHeaders: Header[];
  https: boolean;
  cors: boolean;
  headers: Header[];
};

export type Environments = Environment[];
