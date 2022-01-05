import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';

import { Entities, Relationships, Steps } from '../constants';
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

export async function fetchPolicyToPolicyRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.POLICY._type },
    async (policyEntity) => {
      const policyParentId = policyEntity.parent as string;

      if (policyParentId) {
        // If this role has a parent, build the role to role relationship
        const parentPolicyEntityId =
          createPolicyEntityIdentifier(policyParentId);
        const parentPolicyEntity = await jobState.findEntity(
          parentPolicyEntityId,
        );

        if (parentPolicyEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: Relationships.POLICY_CONTAINS_POLICY._class,
              from: parentPolicyEntity,
              to: policyEntity,
              properties: {
                _type: Relationships.POLICY_CONTAINS_POLICY._type,
              },
            }),
          );
        }
      }
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
    executionHandler: fetchPolicies,
  },
  {
    id: Steps.FETCH_POLICY_TO_POLICY_RELATIONSHIP,
    name: 'Fetch Policies',
    entities: [],
    relationships: [Relationships.POLICY_CONTAINS_POLICY],
    dependsOn: [Steps.POLICIES],
    executionHandler: fetchPolicyToPolicyRelationship,
  },
];
