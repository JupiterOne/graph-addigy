import {
  // IntegrationExecutionContext,
  // IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
// import { createAPIClient } from './addigy/client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  clientId: {
    type: 'string',
  },
  clientSecret: {
    type: 'string',
    mask: true,
  },
  adminUsername: {
    type: 'string',
  },
  adminPassword: {
    type: 'string',
    mask: true,
  },
  host: {
    type: 'string',
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  clientId: string;
  clientSecret: string;
  /**
   * User data that has owner role
   */
  adminUsername: string;
  adminPassword: string;
  host: string;
}

// export async function validateInvocation(
//   context: IntegrationExecutionContext<IntegrationConfig>,
// ) {
//   const { config } = context.instance;

//   if (!config.clientId || !config.clientSecret) {
//     throw new IntegrationValidationError(
//       'Config requires all of {clientId, clientSecret}',
//     );
//   } else if (
//     (config.adminUsername && !config.adminPassword) ||
//     (!config.adminUsername && config.adminPassword)
//   ) {
//     throw new IntegrationValidationError(
//       'If you fill one of user fields, you must fill both.',
//     );
//   }

// const apiClient = createAPIClient(config);
// await apiClient.verifyAuthentication();
// }
