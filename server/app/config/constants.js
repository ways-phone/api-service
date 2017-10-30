import path from 'path';
import merge from 'lodash/merge';

const defaultConfig = {
  env: process.env.NODE_ENVIRO,
  get envs() {
    return {
      test: process.env.NODE_ENVIRO === 'test',
      development: process.env.NODE_ENVIRO === 'development',
      production: process.env.NODE_ENVIRO === 'production',
    };
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 8080,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '/api',
  userRoles: ['client', 'admin'],

  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  security: {
    sessionSecret: process.env.SESSION_SECRET || 'thisisasecretkey',
    sessionExpiration: Number(process.env.SESSION_EXPIRATION) || 60 * 60 * 24 * 1, // one day
    saltRounds: Number(process.env.SALT_ROUNDS) || 12,
  },
};

const environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGO_URI || 'mongodb://express:thisisapassword1@localhost/ways-api-dev',
      pass: process.env.MONGO_PWD,
    },
    security: {
      saltRounds: 4,
    },
  },
  test: {
    port: 5678,
    mongo: {
      uri: 'mongodb://localhost/ways-api-test',
    },
    security: {
      saltRounds: 4,
    },
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGO_URI,
      pass: process.env.MONGO_PWD,
    },
  },
};

export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENVIRO] || {});
