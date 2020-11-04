import { MockoonResponse } from './server.model';
import { ServerErrorCodes } from '../enums/errors.enum';

export interface ServerEvents {
  error: (errorCode: ServerErrorCodes, originalError?: Error) => void;
  stopped: () => void;
  'creating-proxy': () => void;
  started: () => void;
  'entering-request': () => void;
  'response-close': (response: MockoonResponse) => void;
}
