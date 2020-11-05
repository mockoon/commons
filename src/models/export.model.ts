import { Environment } from './environment.model';
import { Route } from './route.model';

export type ExportDataEnvironment = { type: 'environment'; item: Environment };
export type ExportDataRoute = { type: 'route'; item: Route };

export type ExportData = (ExportDataEnvironment | ExportDataRoute)[];

export type Export = {
  source: string;
  data: ExportData;
};
