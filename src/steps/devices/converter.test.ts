import { Device } from '../../addigy/types';
import { createHostAgentEntity } from './converter';

describe('#createHostAgentEntity', () => {
  test('should convert to entity', () => {
    const device = {
      'Serial Number': 'SerialNumber',
      agentid: 'agent-id',
      'Device Name': 'name',
      'Current User': 'user',
      'Device Model Name': 'Model name',
      'Hardware Model': 'hardware model',
      policy_id: '12334',
    } as any;

    const entity = createHostAgentEntity(device as Device);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'addigy-hostagent:agent-id',
        _type: 'addigy_hostagent',
        _class: ['HostAgent'],
        id: 'agent-id',
        name: 'name',
        displayName: 'name',
        policyId: '12334',
        _rawData: [
          {
            name: 'default',
            rawData: device,
          },
        ],
      }),
    );
  });
});
