import { IntegrationConfig } from './config';
import { Device, User } from './types';
import { Addigy } from 'addigy';
import { AlertStatus } from './types';

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
  iterateGroups(arg0: (group: any) => Promise<void>) {
    throw new Error('Method not implemented.');
  }
  constructor(readonly config: IntegrationConfig) {}

  public async verifyAuthentication(): Promise<void> {
    // TODO make the most light-weight request possible to validate
    // authentication works with the provided credentials, throw an err if
    // authentication fails
    const addigy = new Addigy({
      clientId: 'bae53815f34029be57659bdbf434b298061b6846',
      clientSecret:
        '124706cbe583f959182ab7310dee8e95bc1bb51df159cce83aff8e1533f00a3d5a81d5641acba615',
      adminUsername: 'joao.pedro@contractor.jupiterone.com',
      adminPassword: 'K$gD@S7n#5r@Zpm',
    });

    // didn't work though sdk
    const authObject = await addigy.getAuthObject();
    authObject.orgId = 'dbe4ca5c-7374-4246-a4a0-86a6dc501875';
    authObject.authToken = 'd6b4c539-0f16-479a-9a90-15b2b7d5df81';
    authObject.emailAddress = 'joao.pedro@contractor.jupiterone.com';

    const users = await addigy.getUsers(authObject);
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(iteratee: ResourceIteratee<User>): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const addigy = new Addigy({
      clientId: 'bae53815f34029be57659bdbf434b298061b6846',
      clientSecret:
        '124706cbe583f959182ab7310dee8e95bc1bb51df159cce83aff8e1533f00a3d5a81d5641acba615',
      adminUsername: 'joao.pedro@contractor.jupiterone.com',
      adminPassword: 'K$gD@S7n#5r@Zpm',
    });
    const authObject = await addigy.getAuthObject();
    authObject.orgId = 'dbe4ca5c-7374-4246-a4a0-86a6dc501875';
    authObject.authToken = '2878282c-23c2-4d6c-94f1-d6384a0050f3';
    authObject.emailAddress = 'joao.pedro@contractor.jupiterone.com';

    const users: User[] = (await addigy.getUsers(authObject)) as User[];

    for (const user of users) {
      await iteratee(user);
    }
  }

  public async iterateDevices(
    iteratee: ResourceIteratee<Device>,
  ): Promise<void> {
    const addigy = new Addigy({
      clientId: 'bae53815f34029be57659bdbf434b298061b6846',
      clientSecret:
        '124706cbe583f959182ab7310dee8e95bc1bb51df159cce83aff8e1533f00a3d5a81d5641acba615',
      adminUsername: 'joao.pedro@contractor.jupiterone.com',
      adminPassword: 'K$gD@S7n#5r@Zpm',
    });

    const authObject = await addigy.getAuthObject();
    authObject.orgId = 'dbe4ca5c-7374-4246-a4a0-86a6dc501875';
    authObject.authToken = '2878282c-23c2-4d6c-94f1-d6384a0050f3';
    authObject.emailAddress = 'joao.pedro@contractor.jupiterone.com';

    const devices: Device[] = (await addigy.getDevices()) as Device[];
    console.log(devices[0].serial_number);
    for (const device of devices) {
      await iteratee(device);
    }
  }
  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  // public async iterateGroups(
  //   iteratee: ResourceIteratee<Group>,
  // ): Promise<void> {
  //   // TODO paginate an endpoint, invoke the iteratee with each record in the
  //   // page
  //   //
  //   // The provider API will hopefully support pagination. Functions like this
  //   // should maintain pagination state, and for each page, for each record in
  //   // the page, invoke the `ResourceIteratee`. This will encourage a pattern
  //   // where each resource is processed and dropped from memory.

  //   const groups: Group[] = [
  //     {
  //       id: 'acme-group-1',
  //       name: 'Group One',
  //       users: [
  //         {
  //           id: 'acme-user-1',
  //         },
  //       ],
  //     },
  //   ];

  //   for (const group of groups) {
  //     await iteratee(group);
  //   }
  // }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
