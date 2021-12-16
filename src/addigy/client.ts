/* eslint-disable no-useless-catch */
import {
  Device,
  IAddigyInternalAuthObject,
  Policy,
  Method,
  User,
  AccountResponse,
} from './types';
import PQueue from 'p-queue';
import { retry } from '@lifeomic/attempt';
import {
  IntegrationLogger,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';
import fetch, { RequestInit, Response, FetchError } from 'node-fetch';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

const defaultApiTimeoutMs = 60000; // 1 minute

interface OnApiRequestErrorParams {
  url: string;
  err: FetchError;
  attemptNum: number;
  attemptsRemaining: number;
  code?: string;
}

type RequestFunction = (
  url: string,
  options?: RequestInit | undefined,
) => Promise<Response>;

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
    throw new IntegrationProviderAPIError({
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

export class AddigyClient {
  private readonly queue: PQueue;
  // private readonly host: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly adminUsername: string;
  private readonly adminPassword: string;
  private readonly request: RequestFunction;

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
    this.queue = new PQueue({ concurrency: 1, intervalCap: 1, interval: 50 });
  }

  public async getAuthObject(): Promise<IAddigyInternalAuthObject> {
    const postBody: any = {
      username: this.adminUsername,
      password: this.adminPassword,
    };

    try {
      if (!this.adminUsername || !this.adminPassword)
        throw new Error(
          "The function you are using hits Addigy's internal API, but no username or password was provided in the constructor. Please fill out the adminUsername and adminPassword parameters.",
        );

      const authObject = await this.makeRequest<IAddigyInternalAuthObject>(
        `signin/`,
        Method.POST,
        postBody,
      );

      return authObject;
    } catch (err) {
      throw err;
    }
  }

  private async makeRequest<T>(
    path: string,
    method: Method,
    body?: {},
    headers?: {},
    url?: string,
  ): Promise<T> {
    const options: RequestInit = {
      method,
      timeout: defaultApiTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'client-id': this.clientId,
        'client-secret': this.clientSecret,
        ...headers,
      },
    };

    if (method == Method.POST && body) {
      options.body = JSON.stringify(body);
    }

    console.log({ options });
    const domain = url ? url : 'https://prod.addigy.com/';
    const fullUrl = domain + path; //this.getResourceUrl(path);

    // The goal here is to retry and ensure the final error includes information
    // about the host we could not connect to, since users define the host and
    // may mis-type the value.
    const requestWithRetry = (): Promise<Response> =>
      retry(async () => request(this.request, fullUrl, options), {
        maxAttempts: 3,
        handleError: (err, attemptContext) => {
          if (err.retryable === false) {
            attemptContext.abort();
            return;
          }

          const fetchErr = err as FetchError;

          if (attemptContext.attemptsRemaining && this.onApiRequestError) {
            // If there are no attempts remaining, we will just bubble up the
            // entire error by default.
            this.onApiRequestError({
              url: fullUrl,
              code: fetchErr.code,
              err,
              attemptNum: attemptContext.attemptNum,
              attemptsRemaining: attemptContext.attemptsRemaining,
            });
          }
        },
      });

    const response = await this.queue.add(requestWithRetry);

    if (response.status === 200) {
      return response.json();
    } else {
      throw new IntegrationProviderAPIError({
        endpoint: fullUrl,
        statusText: response.statusText,
        status: response.status,
      });
    }
  }

  public async fetchUsers(
    authObject: IAddigyInternalAuthObject,
  ): Promise<User[]> {
    try {
      const response = await this.makeRequest<AccountResponse>(
        `api/account`,
        Method.GET,
        {},
        {
          Cookie: `auth_token=${authObject.authtoken};`,
          origin: 'https://app-prod.addigy.com',
        },
        'https://app-prod.addigy.com/',
      );
      return response.users;
    } catch (err) {
      throw err;
    }
  }

  public async fetchDevices(): Promise<Device[]> {
    try {
      const devices = await this.makeRequest<Device[]>(
        `api/devices`,
        Method.GET,
        {},
      );

      return devices;
    } catch (err) {
      throw err;
    }
  }

  public async fetchPolicies(): Promise<Policy[]> {
    try {
      const policies = await this.makeRequest<Policy[]>(
        `api/policies`,
        Method.GET,
        {},
      );
      return policies;
    } catch (err) {
      throw err;
    }
  }
}
