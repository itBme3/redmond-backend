import { environment as productionEnv }  from './environment.prod'

export const environment = {
  ...productionEnv,
  production: false,
  log: true,
};