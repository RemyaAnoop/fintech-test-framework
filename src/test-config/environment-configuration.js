const envts = {
  local: {
    name: 'local',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    uiBaseUrl: process.env.UI_BASE_URL || 'http://localhost:3000',
    apiTimeout: 10000,
    authToken: 'test-token',
  },
  dev: {
    name: 'dev',
    apiBaseUrl: process.env.API_BASE_URL || 'https://dev.example.com/api',
    uiBaseUrl: process.env.UI_BASE_URL || 'https://dev.example.com',
    apiTimeout: 12000,
    authToken: process.env.API_TOKEN || '',
  },
  staging: {
    name: 'staging',
    apiBaseUrl: process.env.API_BASE_URL || 'https://staging.example.com/api',
    uiBaseUrl: process.env.UI_BASE_URL || 'https://staging.example.com',
    apiTimeout: 15000,
    authToken: process.env.API_TOKEN || '',
  },  
};

function getEnvironmentConfig(envName) {
  const envConfig = envts[envName];
  if (!envConfig) {
    throw new Error(`Unknown environment "${envName}". Expected one of: ${Object.keys(envts).join(', ')}`);
  }
  return envConfig;
}

const environments = {
  local: getEnvironmentConfig('local'),
  dev: getEnvironmentConfig('dev'),
  staging: getEnvironmentConfig('staging'),
};  

const environmentName = (process.env.TEST_ENV || 'local').toLowerCase();
if (!environments[environmentName]) {
  throw new Error(`Unknown TEST_ENV "${environmentName}". Expected one of: ${Object.keys(environments).join(', ')}.`);
}

export const environment = environments[environmentName];
