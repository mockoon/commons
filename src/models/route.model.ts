export type LogicalOperators = 'AND' | 'OR';

export type RouteResponse = {
  uuid: string;
  rules: ResponseRule[];
  rulesOperator: LogicalOperators;
  statusCode: number;
  label: string;
  headers: Header[];
  body?: string;
  latency: number;
  filePath: string;
  sendFileAsBody: boolean;
  disableTemplating: boolean;
  fallbackTo404: boolean;
};

export type ResponseRuleOperators = 'equals' | 'regex' | 'null' | 'empty_array';

export type ResponseRule = {
  target: ResponseRuleTargets;
  modifier: string;
  value: string;
  operator: ResponseRuleOperators;
};

export type ResponseRuleTargets =
  | 'body'
  | 'query'
  | 'header'
  | 'params'
  | 'request_number'
  | 'cookie';

export type Route = {
  uuid: string;
  documentation: string;
  method: Method;
  endpoint: string;
  responses: RouteResponse[];
  enabled: boolean;
  randomResponse: boolean;
  sequentialResponse: boolean;
};

export type Header = { key: string; value: string };

export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'head'
  | 'options';
