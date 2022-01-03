import {
  AddigyClient,
  // createAddigyClient,
} from './addigy/client';

// import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';

import { Device, User, Policy } from './addigy/types';

import { IntegrationConfig } from './config';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {
    //Set up the client
    this.setUpClient();
  }

  client: AddigyClient;

  /**
   * Set up the connection to Salesforce with oauth info
   */
  setUpClient(): void {
    this.client = new AddigyClient({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      adminUsername: this.config.adminUsername,
      adminPassword: this.config.adminPassword,
      // logger,
    });
  }

  //   public async verifyAuthentication(): Promise<void> {

  //   }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(iteratee: ResourceIteratee<User>): Promise<void> {
    const authObject = await this.client.getAuthObject();
    const users = await this.client.fetchUsers(authObject);
    for (const user of users) {
      await iteratee(user);
    }
  }

  /**
   * Iterates each device resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateDevices(
    iteratee: ResourceIteratee<Device>,
  ): Promise<void> {
    const devices = await this.client.fetchDevices();
    for (const device of devices) {
      await iteratee(device);
    }
  }

  public async iteratePolicies(
    iteratee: ResourceIteratee<Policy>,
  ): Promise<void> {
    const policies = await this.client.fetchPolicies();
    for (const policy of policies) {
      await iteratee(policy);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
