import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';

import {
  Entities,
  IngestionSources,
  Relationships,
  Steps,
} from '../../constants';
import { createPolicyEntity, createPolicyEntityIdentifier } from './converter';
import { createAPIClient } from '../../client';

export async function fetchPolicies({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iteratePolicies(async (policy) => {
    await jobState.addEntity(createPolicyEntity(policy));
  });
}

export async function buildPolicyToPolicyRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.POLICY._type },
    async (policyEntity) => {
      const policyParentId = policyEntity.parent as string;

      if (!policyParentId) {
        return;
      }

      const parentPolicyEntityKey =
        createPolicyEntityIdentifier(policyParentId);
      if (!jobState.hasKey(parentPolicyEntityKey)) {
        return;
      }
      await jobState.addRelationship(
        createDirectRelationship({
          _class: Relationships.POLICY_CONTAINS_POLICY._class,
          fromKey: parentPolicyEntityKey,
          fromType: Entities.POLICY._type,
          toKey: policyEntity._key,
          toType: Entities.POLICY._type,
          properties: {
            _type: Relationships.POLICY_CONTAINS_POLICY._type,
          },
        }),
      );
    },
  );
}

export const policiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.POLICIES,
    name: 'Fetch Policies',
    entities: [Entities.POLICY],
    relationships: [],
    dependsOn: [],
    ingestionSourceId: IngestionSources.POLICIES,
    executionHandler: fetchPolicies,
  },
  {
    id: Steps.BUILD_POLICY_TO_POLICY_RELATIONSHIP,
    name: 'Build Policy to Policy Relationship',
    entities: [],
    relationships: [Relationships.POLICY_CONTAINS_POLICY],
    dependsOn: [Steps.POLICIES],
    ingestionSourceId: IngestionSources.POLICIES,
    executionHandler: buildPolicyToPolicyRelationship,
  },
];
