import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import {
  Entities,
  IngestionSources,
  Relationships,
  Steps,
  USER_TO_POLICIES_DATA,
} from '../../constants';
import { createUserEntity } from './converter';
import { createAPIClient } from '../../client';
import { createPolicyEntityIdentifier } from '../policy/converter';

type UserToPoliciesMapType = Map<string, string[] | null>;

function isValidUserToPoliciesMap(
  userToPoliciesMap: unknown,
): userToPoliciesMap is UserToPoliciesMapType {
  return !!userToPoliciesMap;
}

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const userToPoliciesMap: UserToPoliciesMapType = new Map();

  await apiClient.iterateUsers(async (user) => {
    const userEntity = await jobState.addEntity(createUserEntity(user));
    userToPoliciesMap.set(userEntity._key, user.policies);
  });

  await jobState.setData(USER_TO_POLICIES_DATA, userToPoliciesMap);
}

export async function buildUserHasPolicyRelationships({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const userToPoliciesMap = await jobState.getData(USER_TO_POLICIES_DATA);

  if (!isValidUserToPoliciesMap(userToPoliciesMap)) {
    return;
  }

  for (const [userKey, policies] of userToPoliciesMap) {
    if (!policies || !policies.length) {
      // If the user is an admin and has access to all policies
      // this will return as [] or null.
      await jobState.iterateEntities(
        { _type: Entities.POLICY._type },
        async (policyEntity) => {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              fromKey: userKey,
              fromType: Entities.USER._type,
              toKey: policyEntity._key,
              toType: Entities.POLICY._type,
            }),
          );
        },
      );
    } else {
      for (const policy of policies) {
        const policyEntityKey = createPolicyEntityIdentifier(policy);
        if (jobState.hasKey(policyEntityKey)) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              fromKey: userKey,
              fromType: Entities.USER._type,
              toKey: policyEntityKey,
              toType: Entities.POLICY._type,
            }),
          );
        }
      }
    }
  }
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [],
    dependsOn: [],
    ingestionSourceId: IngestionSources.USERS,
    executionHandler: fetchUsers,
  },
  {
    id: Steps.BUILD_USER_HAS_POLICY_RELATIONSHIP,
    name: 'Build User Has Policy Relationships',
    entities: [],
    relationships: [Relationships.USER_HAS_POLICY],
    dependsOn: [Steps.USERS, Steps.POLICIES],
    executionHandler: buildUserHasPolicyRelationships,
  },
];
