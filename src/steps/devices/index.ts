import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';

import { Entities, Steps } from '../constants';
import { createDeviceEntity } from './converter';

export async function fetchDevices({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = await jobState.addEntity(createDeviceEntity(device));

    // create relationships
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
    relationships: [],
    dependsOn: [],
    executionHandler: fetchDevices,
  },
];
