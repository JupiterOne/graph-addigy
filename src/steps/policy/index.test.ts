import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { Recording, setupAddigyRecording } from '../../../test/recording';

import { integrationConfig } from '../../../test/config';

import { fetchPolicies, fetchPolicyToPolicyRelationship } from '.';
import { Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchPolicies', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: 'fetchPoliciesShouldCollectData',
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

    expect(context.jobState.collectedEntities?.length).toBeTruthy;
    expect(context.jobState.collectedRelationships).toHaveLength(0);
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['Policy'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'addigy_policy' },
          _key: { type: 'string' },
          id: { type: 'string' },
          title: { type: 'string' },
          downloadPath: { type: 'string' },
          creationTime: { type: 'string' }, // TODO: Change this type
          orgid: { type: 'string' },
          icon: { type: 'string' },
          summary: { type: 'string' },
          content: { type: 'string' },
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
});

describe('#buildPolicyToPolicyRelationships', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: 'buildPolicyToPolicyRelationshipsShouldCollectData',
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
    await fetchPolicyToPolicyRelationship(context);

    expect(context.jobState.collectedRelationships?.length).toBeTruthy;

    // Policy to Policy relationship
    expect(
      context.jobState.collectedRelationships.filter(
        (r) => r._type === Relationships.POLICY_CONTAINS_POLICY._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: RelationshipClass.CONTAINS },
          _type: { const: Relationships.POLICY_CONTAINS_POLICY._type },
        },
      },
    });
  });
});
