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
import { IntegrationConfig } from '../../config';
import { User } from '../../addigy/types';

import { Entities, Steps } from '../constants';
import { createUserEntity } from './converter';

async function iterateUsers(
  client: AddigyClient,
  logger: IntegrationLogger,
  iteratee: ResourceIteratee<User>,
): Promise<void> {
  const authObject = await client.getAuthObject();
  const users = await client.fetchUsers(authObject);
  for (const user of users) {
    await iteratee(user);
  }
}

export async function fetchUsers({
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
  await iterateUsers(client, logger, async (user) => {
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
