import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { integrationSteps } from './steps';
import { IntegrationConfig, instanceConfigFields } from './config';
import { validateInvocation } from './validator';

export const invocationConfig: IntegrationInvocationConfig<IntegrationConfig> =
  {
    instanceConfigFields,
    validateInvocation,
    integrationSteps,
  };
