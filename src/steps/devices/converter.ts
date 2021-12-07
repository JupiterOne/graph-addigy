import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Device } from '../../types';
import { Entities } from '../constants';

export function createDeviceEntity(device: Device): Entity {
  return createIntegrationEntity({
    entityData: {
      source: device,
      assign: {
        _key: device.agentid,
        _type: Entities.DEVICE._type,
        _class: Entities.DEVICE._class,
        id: device.serial_number,
        name: device.deviceName || '',
        user: device.currentUser,
        displayName: device.deviceName || '',
        category: device.deviceModelName || '',
        make: 'Apple',
        model: device.hardwareModel || '',
        serial: device.serial_number || '',
      },
    },
  });
}
