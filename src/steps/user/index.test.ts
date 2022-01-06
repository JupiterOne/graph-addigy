import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { Recording, setupAddigyRecording } from '../../../test/recording';

import { integrationConfig } from '../../../test/config';

import { fetchUsers } from '.';
import { fetchPolicies } from '../policy';
import { Relationships } from '../constants';
import { RelationshipClass } from '@jupiterone/integration-sdk-core';

describe('#fetchUsers', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: 'fetchUsersShouldCollectData',
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
    await fetchUsers(context);

    expect(context.jobState.collectedEntities?.length).toBeTruthy;
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'addigy_user' },
          _key: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          username: { type: 'string' },
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

  test('should build user to policy relationship', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: 'fetchUsersShouldBuildPolicyRelationship',
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
    await fetchUsers(context);

    // Check that user to policy relationship was built
    expect(context.jobState.collectedRelationships?.length).toBeTruthy;

    // User to Policy relationship
    expect(
      context.jobState.collectedRelationships.filter(
        (r) => r._type === Relationships.USER_HAS_POLICY._type,
      ),
    ).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: RelationshipClass.HAS },
          _type: { const: Relationships.USER_HAS_POLICY._type },
        },
      },
    });
  });
});
