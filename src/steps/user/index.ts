import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { createUserEntity } from './converter';
import { createAPIClient } from '../../client';
import { createPolicyEntityIdentifier } from '../policy/converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));

    if (!user.policies || !user.policies.length) {
      // If the user is an admin and has access to all policies
      // this will return as [] or null.
      await jobState.iterateEntities(
        { _type: Entities.POLICY._type },
        async (policyEntity) => {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: userEntity,
              to: policyEntity,
            }),
          );
        },
      );
    } else {
      for (const policy of user.policies) {
        const policyEntity = await jobState.findEntity(
          createPolicyEntityIdentifier(policy),
        );
        if (policyEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: userEntity,
              to: policyEntity,
            }),
          );
        }
      }
    }
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.USER_HAS_POLICY],
    dependsOn: [Steps.POLICIES],
    executionHandler: fetchUsers,
  },
];
