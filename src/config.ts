import {
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from './client';

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
   * Used to hit internal API endpoint
   */
  adminUsername: string;
  adminPassword: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { instance } = context;
  const { config } = instance;

  if (
    !config.adminPassword ||
    !config.adminUsername ||
    !config.clientId ||
    !config.clientSecret
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {adminPassword, adminUsername, clientId, clientSecret}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
