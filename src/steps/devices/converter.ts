import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Device } from '../../addigy/types';
import { Entities } from '../constants';

export function createDeviceEntity(device: Device): Entity {
  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _key: device.agentid,
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        id: device['Serial Number'],
        name: device['Device Name'],
        user: device['Current User'], // TODO: see if this can map to a User|Person Entity
        displayName: device['Device Name'],
        category: device['Device Model Name'],
        make: 'Apple',
        model: device['Hardware Model'],
        serial: device['Serial Number'],
        policyId: device['policy_id'],
      },
    },
  });
}
