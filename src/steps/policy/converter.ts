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
        _key: 'addigy-policy:' + policy.policyId,
        _type: Entities.POLICY._type,
        _class: Entities.POLICY._class,
        id: policy.policyId,
        title: policy.name,
        parent: policy.parent, // TODO: investigate if this is how policies are nested
        downloadPath: policy.downloadPath,
        creationTime: policy.creationTime, // TODO: Fix this property type
        color: policy.color,
        orgid: policy.orgid,
        icon: policy.icon,
        summary: policy.name,
        content: policy.name,
      },
    },
  });
}
