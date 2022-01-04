import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Device } from '../../addigy/types';
import { Entities } from '../constants';

export function createHostAgentEntity(device: Device): Entity {
  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _key: 'addigy-hostagent:' + device.agentid,
        _type: Entities.HOST_AGENT._type,
        _class: Entities.HOST_AGENT._class,
        id: device['Serial Number'],
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
        firewallEnabled: device['Firewall Enabled'],
        // TODO: Add some more useful properties
      },
    },
  });
}
