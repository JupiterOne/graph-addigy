import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';

import { Entities, Relationships, Steps } from '../constants';
import { createHostAgentEntity } from './converter';
import { createAPIClient } from '../../client';

export async function fetchDevices({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateDevices(async (device) => {
    const deviceEntity = await jobState.addEntity(
      createHostAgentEntity(device),
    );

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

    // TODO: Create mapped relationship to user_endpoint|device entitites
  });
}

export const devicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.HOST_AGENT],
    relationships: [Relationships.HOST_AGENT_HAS_POLICY],
    dependsOn: [Steps.POLICIES],
    executionHandler: fetchDevices,
  },
];
