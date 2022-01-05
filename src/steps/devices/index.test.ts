import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

import { Recording, setupAddigyRecording } from '../../../test/recording';

import { integrationConfig } from '../../../test/config';

import { fetchDevices } from '.';
import { fetchPolicies } from '../policy';
import { Relationships } from '../constants';

describe('#fetchDevices', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: 'fetchDevicesShouldCollectData',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: false,
      },
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });
    await fetchDevices(context);

    expect(context.jobState.collectedEntities?.length).toBeTruthy;
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['HostAgent'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'addigy_hostagent' },
          _key: { type: 'string' },
          id: { type: 'string' },
          displayName: { type: 'string' },
          policyId: { type: 'string' },
          name: { type: 'string' },
          createdOn: { type: 'number' },
          createdBy: { type: 'string' },
          updatedOn: { type: 'number' },
          updatedBy: { type: 'string' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
        required: [],
      },
    });
  });

  test('should build device to policy relationship', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: 'fetchDevicesShouldBuildPolicyRelationship',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: false,
      },
    });

    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });
    await fetchPolicies(context);
    await fetchDevices(context);

    // Check that device to policy relationship was built
    expect(context.jobState.collectedRelationships?.length).toBeTruthy;

    // Device to Policy relationship
    expect(
      context.jobState.collectedRelationships.filter(
        (r) => r._type === Relationships.HOST_AGENT_HAS_POLICY._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: RelationshipClass.HAS },
          _type: { const: Relationships.HOST_AGENT_HAS_POLICY._type },
        },
      },
    });
  });
});
