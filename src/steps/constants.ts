import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  USERS: 'fetch-users',
  DEVICES: 'fetch-devices',
  POLICIES: 'fetch-policies',
};

export const Entities: Record<
  'USER' | 'HOST_AGENT' | 'POLICY',
  StepEntityMetadata
> = {
  USER: {
    resourceName: 'User',
    _type: 'addigy_user',
    _class: ['User'],
  },
  HOST_AGENT: {
    resourceName: 'Addigy Device',
    _type: 'addigy_hostagent',
    _class: ['HostAgent'],
  },
  POLICY: {
    resourceName: 'Policy',
    _type: 'addigy_policy',
    _class: ['Policy'],
  },
};

export const Relationships: Record<
  'HOST_AGENT_HAS_POLICY',
  StepRelationshipMetadata
> = {
  HOST_AGENT_HAS_POLICY: {
    _type: 'addigy_hostagent_has_policy',
    sourceType: Entities.HOST_AGENT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.POLICY._type,
  },
};

export const MappedRelationships: Record<
  'HOST_AGENT_PROTECTS_ENDPOINT',
  StepMappedRelationshipMetadata
> = {
  HOST_AGENT_PROTECTS_ENDPOINT: {
    _type: 'addigy_hostagent_protects_user_endpoint',
    sourceType: Entities.HOST_AGENT._type,
    _class: RelationshipClass.PROTECTS,
    targetType: 'user_endpoint',
    direction: RelationshipDirection.FORWARD,
  },
};
