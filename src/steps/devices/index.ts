import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';

import { Entities, Relationships, Steps } from '../constants';
import { createDeviceEntity } from './converter';
import { createAPIClient } from '../../client';

export async function fetchDevices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateDevices(async (device) => {
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
