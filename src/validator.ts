import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { AddigyClient } from './addigy/client';
import { IntegrationConfig } from './config';

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
