import {
  createDirectRelationship,
  createMappedRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  Relationship,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';

import {
  Entities,
  MappedRelationships,
  Relationships,
  Steps,
} from '../constants';
import { createHostAgentEntity } from './converter';
import { createAPIClient } from '../../client';
import { Device } from '../../addigy/types';
import { createPolicyEntityIdentifier } from '../policy/converter';

/**
 * Creates a mapped relationship between a HostAgent and Host.
 *
 * @param agentEntity the HostAgent that protects the host
 * @param device a HostAsset that is protected by the HostAgent
 */
export function createHostAgentProtectsHostRelationship(
  agentEntity: Entity,
  device: Device,
): Relationship {
  return createMappedRelationship({
    _class: RelationshipClass.PROTECTS,
    _type: MappedRelationships.HOST_AGENT_PROTECTS_ENDPOINT._type,
    _mapping: {
      sourceEntityKey: agentEntity._key,
      relationshipDirection: RelationshipDirection.FORWARD,
      targetFilterKeys: [['_type', '_key']],
      targetEntity: {
        _class: ['Device'],
        _type: 'user_endpoint',
        _key: device['Serial Number'],
        id: device.UDID,
        udid: device.UDID,
        hostname: device['Host Name'],
        ipAddress: device['Local IP'],
        platform: device['OS Platform'],
        osVersion: device['OS Version'],
        category: device['Device Model Name'],
        make: 'Apple',
        model: device['Hardware Model'],
        serial: device['Serial Number'], // This is needed by Device Schema
        serialNumber: device['Serial Number'],
      },
    },
  });
}

export async function fetchDevices({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await apiClient.iterateDevices(async (device) => {
    const hostAgentEntity = await jobState.addEntity(
      createHostAgentEntity(device),
    );

    const policyEntity = await jobState.findEntity(
      createPolicyEntityIdentifier(device['policy_id']),
    );
    if (policyEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: hostAgentEntity,
          to: policyEntity,
        }),
      );
    }

    await jobState.addRelationship(
      createHostAgentProtectsHostRelationship(hostAgentEntity, device),
    );
  });
}

export const devicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.HOST_AGENT],
    relationships: [Relationships.HOST_AGENT_HAS_POLICY],
    mappedRelationships: [MappedRelationships.HOST_AGENT_PROTECTS_ENDPOINT],
    dependsOn: [Steps.POLICIES],
    executionHandler: fetchDevices,
  },
];
