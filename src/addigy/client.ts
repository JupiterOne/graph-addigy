/* eslint-disable no-useless-catch */
import { IntegrationConfig } from '../config';
import { Device, IAddigyInternalAuthObject, Policy, User } from './types';
import { Addigy } from 'addigy';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';
import fetch, { RequestInit, Response, FetchError } from 'node-fetch';
import { retry } from '@lifeomic/attempt';
import PQueue from 'p-queue';
import { URL } from 'url';
import { IntegrationProviderPermanentAPIError } from '../util/error';
import got from 'got';
import { v4 as uuidv4 } from 'uuid';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

interface OnApiRequestErrorParams {
  url: string;
  err: FetchError;
  attemptNum: number;
  attemptsRemaining: number;
  code?: string;
}
interface CreateAddigyClientParams {
  host: string;
  clientId: string;
  clientSecret: string;
  adminUsername: string;
  adminPassword: string;
  request?: RequestFunction;
  onApiRequestError?: (params: OnApiRequestErrorParams) => void;
}
interface CreateAddigyClientHelperParams {
  clientId: string;
  clientSecret: string;
  adminUsername: string;
  adminPassword: string;
  host: string;
  logger: IntegrationLogger;
}
type RequestFunction = (
  url: string,
  options?: RequestInit | undefined,
) => Promise<Response>;

const defaultApiTimeoutMs = 60000; // 1 minute
const noRetryStatusCodes: number[] = [400, 401, 403, 404, 413];

function isSuccessfulStatusCode(status: number) {
  return status >= 200 && status < 400;
}

async function request(
  requestFn: RequestFunction,
  url: string,
  options?: RequestInit | undefined,
): Promise<Response> {
  const response = await requestFn(url, options);

  if (isSuccessfulStatusCode(response.status)) {
    return response;
  }

  if (noRetryStatusCodes.includes(response.status)) {
    throw new IntegrationProviderPermanentAPIError({
      endpoint: url,
      statusText: 'Received non-retryable status code in API response',
      status: response.status,
    });
  }

  throw new IntegrationProviderAPIError({
    endpoint: url,
    statusText: response.statusText,
    status: response.status,
  });
}

export function createAPIClient({
  host,
  clientId,
  clientSecret,
  adminUsername,
  adminPassword,
  logger,
}: CreateAddigyClientHelperParams) {
  const client = new AddigyClient({
    host,
    clientId,
    clientSecret,
    adminUsername,
    adminPassword,
    onApiRequestError(requestError) {
      logger.info(requestError, 'Error making API requests (will retry)');
    },
  });

  return client;
}

export class AddigyClient {
  // private readonly queue: PQueue;
  private readonly host: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly adminUsername: string;
  private readonly adminPassword: string;
  private readonly request: RequestFunction;
  reqHeaders: any;

  private readonly onApiRequestError:
    | ((params: OnApiRequestErrorParams) => void)
    | undefined;

  constructor(options: CreateAddigyClientParams) {
    this.host = options.host;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.adminUsername = options.adminUsername;
    this.adminPassword = options.adminPassword;
    this.request = options.request || fetch;
    this.onApiRequestError = options.onApiRequestError;
    this.reqHeaders = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      'client-id': this.clientId,
      'client-secret': this.clientSecret,
    };
    // this.queue = new PQueue({ concurrency: 1, intervalCap: 1, interval: 50 });
  }

  async getAuthObject(): Promise<IAddigyInternalAuthObject> {
    const postBody: any = {
      username: this.adminUsername,
      password: this.adminPassword,
    };

    try {
      if (!this.adminUsername || !this.adminPassword)
        throw new Error(
          "The function you are using hits Addigy's internal API, but no username or password was provided in the constructor. Please fill out the adminUsername and adminPassword parameters.",
        );
      const response = await this._addigyRequest(
        'https://prod.addigy.com/signin/',
        {
          method: 'POST',
          json: postBody,
        },
      );
      console.log('------------------- Response: ', response);
      const authObject = {
        orgId: response.body.orgid,
        authToken: response.body.authtoken,
        emailAddress: response.body.email,
      };

      return authObject;
    } catch (err) {
      throw err;
    }
  }

  async fetchUsers(authObject: IAddigyInternalAuthObject): Promise<object[]> {
    try {
      const response = await this._addigyRequest(
        'https://app-prod.addigy.com/api/account',
        {
          headers: {
            Cookie: `auth_token=${authObject.authToken};`,
            origin: 'https://app-prod.addigy.com',
          },
          method: 'GET',
        },
      );
      return JSON.parse(response.body).users;
    } catch (err) {
      throw err;
    }
  }

  async fetchDevices(): Promise<Device[]> {
    try {
      const response = await this._addigyRequest(`${this.host}/devices`, {
        headers: this.reqHeaders,
      });
      return JSON.parse(response.body);
    } catch (err) {
      throw err;
    }
  }

  async fetchPolicies(): Promise<Policy[]> {
    try {
      const response = await this._addigyRequest(`${this.host}/policies`, {
        headers: this.reqHeaders,
      });
      return JSON.parse(response.body);
    } catch (err) {
      throw err;
    }
  }

  // public async iterateDevices(
  //   iteratee: ResourceIteratee<Device>,
  // ): Promise<void> {
  //   const devices = await this.fetchDevices() as Device[];
  //   for (const device of devices) {
  //     await iteratee(device);
  //   }
  // }

  private async _addigyRequest(url: string, options: any): Promise<any> {
    try {
      const response = await got(url, options);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
