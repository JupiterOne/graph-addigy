import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Policy } from '../../addigy/types';
import { Entities } from '../../constants';

const POLICY_PREFIX = 'addigy-policy';
export function createPolicyEntityIdentifier(id: string): string {
  return `${POLICY_PREFIX}:${id}`;
}

export function createPolicyEntity(policy: Policy): Entity {
  return createIntegrationEntity({
    entityData: {
      source: policy,
      assign: {
        _key: createPolicyEntityIdentifier(policy.policyId),
        _type: Entities.POLICY._type,
        _class: Entities.POLICY._class,
        id: policy.policyId,
        title: policy.name,
        parent: policy.parent || undefined,
        downloadPath: policy['download_path'],
        creationOn: policy['creation_time'],
        orgid: policy.orgid,
        summary: policy.name,
        content: policy.name,
      },
    },
  });
}
