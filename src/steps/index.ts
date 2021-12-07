import { accountSteps } from './account';
import { accessSteps } from './access';
import { devicesSteps } from './devices';
import { userSteps } from './user';

const integrationSteps = [...devicesSteps, ...userSteps];

export { integrationSteps };
