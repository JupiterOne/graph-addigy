import { devicesSteps } from './devices';
import { policiesSteps } from './policy';
import { userSteps } from './user';

const integrationSteps = [...policiesSteps, ...devicesSteps, ...userSteps];

export { integrationSteps };
