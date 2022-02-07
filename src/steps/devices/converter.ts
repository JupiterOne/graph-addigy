import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Device } from '../../addigy/types';
import { Entities } from '../constants';

const HOST_AGENT_PREFIX = 'addigy-hostagent';
export function createHostAgentEntityIdentifier(id: string): string {
  return `${HOST_AGENT_PREFIX}:${id}`;
}

export function createHostAgentEntity(device: Device): Entity {
  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _key: createHostAgentEntityIdentifier(device.agentid),
        _type: Entities.HOST_AGENT._type,
        _class: Entities.HOST_AGENT._class,
        id: device.agentid,
        name: device['Device Name'],
        user: device['Current User'], // TODO: see if this can map to a User|Person Entity
        displayName: device['Device Name'],
        category: device['Device Model Name'],
        make: 'Apple',
        model: device['Hardware Model'],
        serial: device['Serial Number'],
        policyId: device['policy_id'],
        function: ['endpoint-protection'],
        appleSilicon: device['Is Apple Silicon'],
        systemVersion: device['System Version'],
        firewallEnabled: device['Firewall Enabled'] || undefined,
        fileVaultEnabled: device['FileVault Enabled'] || undefined,
        platform: device['OS Platform'] || undefined,
        totalMemory: device['Total Memory (GB)'] || undefined,
        totalDiskSpace: device['Total Disk Space (GB)'] || undefined,
        lastOnline: device['Last Online'] || undefined,
      },
    },
  });
}
