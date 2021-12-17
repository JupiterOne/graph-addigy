import {
  IntegrationLogger,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import {
  AddigyClient,
  createAPIClient,
  ResourceIteratee,
} from '../../addigy/client';
import { Policy } from '../../addigy/types';
import { IntegrationConfig } from '../../config';

import { Entities, Steps } from '../constants';
import { createPolicyEntity } from './converter';

async function iteratePolicies(
  client: AddigyClient,
  logger: IntegrationLogger,
  iteratee: ResourceIteratee<Policy>,
): Promise<void> {
  const policies = await client.fetchPolicies();
  for (const policy of policies) {
    await iteratee(policy);
  }
}

export async function fetchPolicies({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const { config } = instance;
  const client = createAPIClient({
    host: config.host,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    adminUsername: config.adminUsername,
    adminPassword: config.adminPassword,
    logger,
  });
  await iteratePolicies(client, logger, async (policy) => {
    // to be used later:
    // const policyEntity = await jobState.addEntity(createPolicyEntity(policy));
    await jobState.addEntity(createPolicyEntity(policy));
  });
}

export const policiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.POLICIES,
    name: 'Fetch Policies',
    entities: [
      {
        resourceName: 'Addigy Policy',
        _type: Entities.POLICY._type,
        _class: Entities.POLICY._class,
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchPolicies,
  },
];
