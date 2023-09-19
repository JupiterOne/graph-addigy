import { buildStepTestConfig } from '../../../test/config';
import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { setupAddigyRecording, Recording } from '../../../test/recording';
import { Steps } from '../../constants';

let recording: Recording;

afterEach(async () => {
  if (recording) {
    await recording.stop();
  }
});

describe(Steps.USERS, () => {
  test('success', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: Steps.USERS,
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: false,
      },
    });

    const stepConfig = buildStepTestConfig(Steps.USERS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});

describe(Steps.BUILD_USER_HAS_POLICY_RELATIONSHIP, () => {
  test('success', async () => {
    recording = setupAddigyRecording({
      directory: __dirname,
      name: Steps.BUILD_USER_HAS_POLICY_RELATIONSHIP,
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
      Steps.BUILD_USER_HAS_POLICY_RELATIONSHIP,
    );
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
