import {
  createDirectRelationship,
  IntegrationLogger,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import {
  AddigyClient,
  createAPIClient,
  ResourceIteratee,
} from '../../addigy/client';
import { Device } from '../../addigy/types';
import { IntegrationConfig } from '../../config';

import { Entities, Relationships, Steps } from '../constants';
import { createDeviceEntity } from './converter';

async function iterateDevices(
  client: AddigyClient,
  logger: IntegrationLogger,
  iteratee: ResourceIteratee<Device>,
): Promise<void> {
  const devices = await client.fetchDevices();
  for (const device of devices) {
    await iteratee(device);
  }
}

export async function fetchDevices({
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

  await iterateDevices(client, logger, async (device) => {
    const deviceEntity = await jobState.addEntity(createDeviceEntity(device));

    const policyEntity = await jobState.findEntity(device['policy_id']);
    if (policyEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: deviceEntity,
          to: policyEntity,
        }),
      );
    }
  });
  await client.fetchDevices();
}

export const devicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [
      {
        resourceName: 'Addigy Device',
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
      },
    ],
    relationships: [Relationships.DEVICE_HAS_POLICY],
    dependsOn: [Steps.POLICIES],
    executionHandler: fetchDevices,
  },
];
