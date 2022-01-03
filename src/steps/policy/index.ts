import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';

import { Entities, Steps } from '../constants';
import { createPolicyEntity } from './converter';
import { createAPIClient } from '../../client';

export async function fetchPolicies({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iteratePolicies(async (policy) => {
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
