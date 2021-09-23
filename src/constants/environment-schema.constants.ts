import * as Joi from 'joi';
import { v4 as uuid } from 'uuid';
import { HighestMigrationId } from '../libs/migrations';
import { Environment } from '../models/environment.model';
import {
  Header,
  ResponseRule,
  Route,
  RouteResponse
} from '../models/route.model';

export const EnvironmentDefault: Environment = {
  get uuid() {
    return uuid();
  },
  lastMigration: HighestMigrationId,
  name: 'New environment',
  endpointPrefix: '',
  latency: 0,
  port: 3000,
  hostname: '0.0.0.0',
  routes: [],
  proxyMode: false,
  proxyHost: '',
  proxyRemovePrefix: false,
  https: false,
  cors: true,
  headers: [],
  proxyReqHeaders: [],
  proxyResHeaders: []
};

export const RouteDefault: Route = {
  get uuid() {
    return uuid();
  },
  documentation: '',
  method: 'get',
  endpoint: '',
  responses: [],
  enabled: true,
  randomResponse: false,
  sequentialResponse: false
};

export const RouteResponseDefault: RouteResponse = {
  get uuid() {
    return uuid();
  },
  body: '{}',
  latency: 0,
  statusCode: 200,
  label: '',
  headers: [],
  filePath: '',
  sendFileAsBody: false,
  rules: [],
  rulesOperator: 'OR',
  disableTemplating: false,
  fallbackTo404: false
};

export const ResponseRuleDefault: ResponseRule = {
  target: 'body',
  modifier: '',
  value: '',
  operator: 'equals'
};

export const HeaderDefault: Header = {
  key: '',
  value: ''
};

const UUIDSchema = Joi.string()
  .uuid()
  .failover(() => uuid())
  .required();

const HeaderSchema = Joi.object<Header>({
  key: Joi.string().allow('').required(),
  value: Joi.string().allow('').required()
});

export const RouteSchema = Joi.object<Route>({
  uuid: UUIDSchema,
  documentation: Joi.string()
    .allow('')
    .failover(RouteDefault.documentation)
    .required(),
  method: Joi.string()
    .valid('get', 'post', 'put', 'patch', 'delete', 'head', 'options')
    .failover(RouteDefault.method)
    .required(),
  endpoint: Joi.string().allow('').failover(RouteDefault.endpoint).required(),
  responses: Joi.array()
    .items(
      Joi.object<RouteResponse>({
        uuid: UUIDSchema,
        body: Joi.string()
          .allow('')
          .failover(RouteResponseDefault.body)
          .required(),
        latency: Joi.number()
          .min(0)
          .failover(RouteResponseDefault.latency)
          .required(),
        statusCode: Joi.number()
          .min(100)
          .max(999)
          .failover(RouteResponseDefault.statusCode)
          .required(),
        label: Joi.string()
          .allow('')
          .failover(RouteResponseDefault.label)
          .required(),
        headers: Joi.array()
          .items(HeaderSchema, Joi.any().strip())
          .failover(RouteResponseDefault.headers)
          .required(),
        filePath: Joi.string()
          .allow('')
          .failover(RouteResponseDefault.filePath)
          .required(),
        sendFileAsBody: Joi.boolean()
          .failover(RouteResponseDefault.sendFileAsBody)
          .required(),
        rules: Joi.array()
          .items(
            Joi.object<ResponseRule>({
              target: Joi.string()
                .valid('body', 'query', 'header', 'params', 'request_number')
                .failover(ResponseRuleDefault.target)
                .required(),
              modifier: Joi.string()
                .allow('')
                .failover(ResponseRuleDefault.modifier)
                .required(),
              value: Joi.string()
                .allow('')
                .failover(ResponseRuleDefault.value)
                .required(),
              operator: Joi.string()
                .valid('equals', 'regex', 'null', 'empty_array')
                .failover(ResponseRuleDefault.operator)
                .required()
            }),
            Joi.any().strip()
          )
          .failover(RouteResponseDefault.rules)
          .required(),
        rulesOperator: Joi.string()
          .valid('OR', 'AND')
          .failover(RouteResponseDefault.rulesOperator)
          .required(),
        disableTemplating: Joi.boolean()
          .failover(RouteResponseDefault.disableTemplating)
          .required(),
        fallbackTo404: Joi.boolean()
          .failover(RouteResponseDefault.fallbackTo404)
          .required()
      }),
      Joi.any().strip()
    )
    .failover(RouteDefault.responses)
    .required(),
  enabled: Joi.boolean().failover(RouteDefault.enabled).required(),
  randomResponse: Joi.boolean()
    .failover(RouteDefault.randomResponse)
    .required(),
  sequentialResponse: Joi.boolean()
    .failover(RouteDefault.sequentialResponse)
    .required()
});

export const EnvironmentSchema = Joi.object<Environment>({
  uuid: UUIDSchema,
  lastMigration: Joi.number()
    .failover(EnvironmentDefault.lastMigration)
    .required(),
  name: Joi.string().allow('').failover(EnvironmentDefault.name).required(),
  endpointPrefix: Joi.string()
    .allow('')
    .failover(EnvironmentDefault.endpointPrefix)
    .required(),
  latency: Joi.number().min(0).failover(EnvironmentDefault.latency).required(),
  port: Joi.number()
    .min(0)
    .max(65535)
    .failover(EnvironmentDefault.port)
    .required(),
  hostname: Joi.string().failover(EnvironmentDefault.hostname).required(),
  routes: Joi.array()
    .items(RouteSchema, Joi.any().strip())
    .failover(EnvironmentDefault.routes)
    .required(),
  proxyMode: Joi.boolean().failover(EnvironmentDefault.proxyMode).required(),
  proxyHost: Joi.string()
    .allow('')
    .failover(EnvironmentDefault.proxyHost)
    .required(),
  proxyRemovePrefix: Joi.boolean()
    .failover(EnvironmentDefault.proxyRemovePrefix)
    .required(),
  https: Joi.boolean().failover(EnvironmentDefault.https).required(),
  cors: Joi.boolean().failover(EnvironmentDefault.cors).required(),
  headers: Joi.array()
    .items(HeaderSchema, Joi.any().strip())
    .failover(EnvironmentDefault.headers)
    .required(),
  proxyReqHeaders: Joi.array()
    .items(HeaderSchema, Joi.any().strip())
    .failover(EnvironmentDefault.proxyReqHeaders)
    .required(),
  proxyResHeaders: Joi.array()
    .items(HeaderSchema, Joi.any().strip())
    .failover(EnvironmentDefault.proxyResHeaders)
    .required()
})
  .failover(EnvironmentDefault)
  .default(EnvironmentDefault)
  .options({ stripUnknown: true });
