
import { environment as devEnv } from './environment.dev'

export const environment = {
  ...devEnv,
  production: true,
  environmentName: 'staging',
};
