import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { User } from '../../addigy/types';
import { Entities } from '../constants';

export function createUserEntity(user: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: user.id,
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.email,
      },
    },
  });
}
