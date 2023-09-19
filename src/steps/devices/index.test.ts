import { buildStepTestConfig } from '../../../test/config';
import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { setupAddigyRecording, Recording } from '../../../test/recording';
import { Steps } from '../../constants';
import { Relationship } from '@jupiterone/integration-sdk-core';

function isMappedRelationship(r: Relationship): boolean {
  return !!r._mapping;
}

function filterDirectRelationships(
  relationships: Relationship[],
): Relationship[] {
  return relationships.filter((r) => !isMappedRelationship(r));
}

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe(Steps.DEVICES, () => {
  test('success', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: Steps.DEVICES,
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: false,
      },
    });

    const stepConfig = buildStepTestConfig(Steps.DEVICES);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect({
      ...stepResults,
      // HACK: `@jupiterone/integration-sdk-testing`
      // does not currently support `toMatchStepMetadata` with mapped
      // relationships, which is causing tests to fail. We will add
      // support soon and remove this hack.
      collectedRelationships: filterDirectRelationships(
        stepResults.collectedRelationships,
      ),
    }).toMatchStepMetadata({
      ...stepConfig,
      invocationConfig: {
        ...stepConfig.invocationConfig,
        integrationSteps: stepConfig.invocationConfig.integrationSteps.map(
          (s) => {
            return {
              ...s,
              mappedRelationships: [],
            };
          },
        ),
      },
    });
  });
});

describe(Steps.BUILD_HOST_AGENT_HAS_POLICY_RELATIONSHIP, () => {
  test('success', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: Steps.BUILD_HOST_AGENT_HAS_POLICY_RELATIONSHIP,
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: false,
      },
    });

    const stepConfig = buildStepTestConfig(
      Steps.BUILD_HOST_AGENT_HAS_POLICY_RELATIONSHIP,
    );
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
