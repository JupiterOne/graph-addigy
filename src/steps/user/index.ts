import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { createUserEntity } from './converter';
import { createAPIClient } from '../../client';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateUsers(async (user) => {
    await jobState.addEntity(createUserEntity(user));

    // TODO: Assign some policies to users to test this logic
    // const userEntity = await jobState.addEntity(createUserEntity(user));

    // for( const policy of user.policies ) {
    //   const policyEntity = await jobState.findEntity(policy);
    //   if (policyEntity) {
    //     await jobState.addRelationship(
    //       createDirectRelationship({
    //         _class: RelationshipClass.HAS,
    //         from: userEntity,
    //         to: policyEntity,
    //       }),
    //     );
    //   }
    // }
  });
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'Addigy Users',
        _type: Entities.USER._type,
        _class: Entities.USER._class,
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
];
