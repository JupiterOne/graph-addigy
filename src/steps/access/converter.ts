import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { Group, User } from '../../types';

import { Entities } from '../constants';

export function createUserEntity(user: User): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        username: 'testusername',
        email: 'test@test.com',
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/User.json
        firstName: 'John',
      },
    },
  });
}

export function createGroupEntity(group: Group): Entity {
  return createIntegrationEntity({
    entityData: {
      source: group,
      assign: {
        _type: Entities.GROUP._type,
        _class: Entities.GROUP._class,
        email: 'testgroup@test.com',
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/UserGroup.json
        logoLink: 'https://test.com/logo.png',
      },
    },
  });
}

export function createAccountUserRelationship(
  account: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: user,
  });
}
export function createAccountGroupRelationship(
  account: Entity,
  group: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: group,
  });
}

export function createGroupUserRelationship(
  group: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: group,
    to: user,
  });
}
