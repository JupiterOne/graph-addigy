import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';

import { Entities, Steps } from '../constants';
// import { createUserEntity } from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateUsers(async (user) => {
    // const userEntity = await jobState.addEntity(createUserEntity(user));
    // create relationships
    // if(user.id){
    //   const userId = user.id;
    //   const
    // }
  });
}
export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'Addigy User',
        _type: Entities.USER._type,
        _class: Entities.USER._class,
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchUsers,
  },
];
