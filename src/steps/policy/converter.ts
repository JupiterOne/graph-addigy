import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Policy } from '../../addigy/types';
import { Entities } from '../constants';

export function createPolicyEntity(policy: Policy): Entity {
  return createIntegrationEntity({
    entityData: {
      source: policy,
      assign: {
        _key: policy.policyId,
        _type: Entities.POLICY._type,
        _class: Entities.POLICY._class,
        id: policy.policyId,
        title: policy.name,
        parent: policy.parent,
        downloadPath: policy.downloadPath,
        creationTime: policy.creationTime,
        color: policy.color,
        orgid: policy.orgid,
        icon: policy.icon,
        summary: policy.name,
        content: policy.name,
      },
    },
  });
}
