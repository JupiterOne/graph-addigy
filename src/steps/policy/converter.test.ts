import { Policy } from '../../addigy/types';
import { createPolicyEntity } from './converter';

describe('#createPolicyEntity', () => {
  test('should convert to entity', () => {
    const policy = {
      creation_time: 1635863715,
      orgid: 'dbe4ca5c-7374-4246-a4a0-86a6dc501875',
      icon: 'fa fa-university',
      parent: null,
      color: '#000000',
      name: 'JupiterOne',
      policyId: 'a8b36bef-42d1-4a96-bfdf-f39e36fa5bc2',
      download_path:
        'https://prod.addigy.com/download/addigy_agent/dbe4ca5c-7374-4246-a4a0-86a6dc501875/a8b36bef-42d1-4a96-bfdf-f39e36fa5bc2',
    } as any;

    const entity = createPolicyEntity(policy as Policy);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'addigy-policy:a8b36bef-42d1-4a96-bfdf-f39e36fa5bc2',
        _type: 'addigy_policy',
        _class: ['Policy'],
        id: 'a8b36bef-42d1-4a96-bfdf-f39e36fa5bc2',
        title: 'JupiterOne',
        parent: null,
        color: '#000000',
        orgid: 'dbe4ca5c-7374-4246-a4a0-86a6dc501875',
        icon: 'fa fa-university',
        summary: 'JupiterOne',
        content: 'JupiterOne',
        _rawData: [
          {
            name: 'default',
            rawData: policy,
          },
        ],
      }),
    );
  });
});
