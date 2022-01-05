import { User } from '../../addigy/types';
import { createUserEntity } from './converter';

describe('#createHostAgentEntity', () => {
  test('should convert to entity', () => {
    const user = {
      id: '61814bee53be1946d894db2b',
      uid: '12344332',
      name: 'First Last',
      email: 'first.last@jupiterone.com',
      role: 'power',
      policies: null,
    } as any;

    const entity = createUserEntity(user as User);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'addigy-user:61814bee53be1946d894db2b',
        _type: 'addigy_user',
        _class: ['User'],
        id: '61814bee53be1946d894db2b',
        name: 'First Last',
        email: 'first.last@jupiterone.com',
        username: 'first.last@jupiterone.com',
        _rawData: [
          {
            name: 'default',
            rawData: user,
          },
        ],
      }),
    );
  });
});
