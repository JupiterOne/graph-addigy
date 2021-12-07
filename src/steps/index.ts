import { devicesSteps } from './devices';
import { userSteps } from './user';

const integrationSteps = [...devicesSteps, ...userSteps];

export { integrationSteps };
