import {
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { AddigyClient } from './addigy/client';

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
   * Used to hit internal API endpoing
   */
  adminUsername: string;
  adminPassword: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { instance, logger } = context;
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

  const client = new AddigyClient({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    adminUsername: config.adminUsername,
    adminPassword: config.adminPassword,
  });

  try {
    await client.fetchPolicies();
  } catch (err) {
    throw new IntegrationValidationError(
      `Failed to authenticate with the addigy API: ${err.message}`,
    );
  }
}
