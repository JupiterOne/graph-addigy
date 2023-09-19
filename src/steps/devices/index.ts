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
  IngestionSources,
  MappedRelationships,
  Relationships,
  Steps,
} from '../../constants';
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
        displayName: device['Host Name'] || device['Device Model Name'],
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

        ethernetMacAddress: agentEntity.ethernetMacAddress as
          | string
          | undefined,
        wifiMacAddress: agentEntity.ethernetMacAddress as string | undefined,
        macAddress: agentEntity.macAddress as string[] | undefined,
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

    await jobState.addRelationship(
      createHostAgentProtectsHostRelationship(hostAgentEntity, device),
    );
  });
}

export async function buildHostAgentHasPolicyRelationship({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.HOST_AGENT._type },
    async (hostAgentEntity) => {
      if (
        !('policyId' in hostAgentEntity) ||
        typeof hostAgentEntity.policyId !== 'string'
      ) {
        return;
      }
      const policyEntityKey = createPolicyEntityIdentifier(
        hostAgentEntity.policyId,
      );
      if (jobState.hasKey(policyEntityKey)) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            fromKey: hostAgentEntity._key,
            fromType: Entities.HOST_AGENT._type,
            toKey: policyEntityKey,
            toType: Entities.POLICY._type,
          }),
        );
      }
    },
  );
}

export const devicesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.DEVICES,
    name: 'Fetch Devices',
    entities: [Entities.HOST_AGENT],
    relationships: [],
    mappedRelationships: [MappedRelationships.HOST_AGENT_PROTECTS_ENDPOINT],
    dependsOn: [],
    ingestionSourceId: IngestionSources.DEVICES,
    executionHandler: fetchDevices,
  },
  {
    id: Steps.BUILD_HOST_AGENT_HAS_POLICY_RELATIONSHIP,
    name: 'Build Host Agent Has Policy Relationship',
    entities: [],
    relationships: [Relationships.HOST_AGENT_HAS_POLICY],
    dependsOn: [Steps.DEVICES, Steps.POLICIES],
    executionHandler: buildHostAgentHasPolicyRelationship,
  },
];
