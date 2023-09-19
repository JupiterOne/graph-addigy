import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { IngestionSources } from './constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [IngestionSources.POLICIES]: {
    title: 'Policies',
    description: 'Fetch Policies and build their parent-child relationships',
  },
  [IngestionSources.DEVICES]: {
    title: 'Devices',
    description:
      'Fetch Devices to create Host Agents entities and mapped relationships with Host',
  },
  [IngestionSources.USERS]: {
    title: 'Users',
    description: 'Fetch Users and build relationships with policies',
  },
};
