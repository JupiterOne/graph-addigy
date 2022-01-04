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
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateUsers(async (user) => {
    // to be used later:
    // const userEntity = await jobState.addEntity(createUserEntity(user));
    await jobState.addEntity(createUserEntity(user));
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
