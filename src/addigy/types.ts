// Providers often supply types with their API libraries.

export enum AlertStatus {
  Acknowledged = 'Acknowledged',
  Resolved = 'Resolved',
  Unattended = 'Unattended',
}

export interface AccountResponse {
  users: User[];
}
export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  addigy_role: string;
  policies: string[];
  scopes: [];
}

export enum Method {
  GET = 'get',
  POST = 'post',
}

export interface Policy {
  creationTime: number;
  name: string;
  parent: string;
  downloadPath: string;
  policyId: string;
  color: string;
  orgid: string;
  icon: string;
}
export interface Device {
  // There are a lot more properties from the
  // Device endpoint but they have weird property
  // names such as spaces that are not properly parsed
  iMEI: string;
  policyId: string;
  locales: string[];
  languages: string[];
  timezone: string;
  clientIp: string;
  meId: string;
  iCCID: string;
  UDID: string;
  approvedPatchesApplied: number;
  online: boolean;
  agentid: string;
}

export interface Group {
  id: string;
  name: string;
  users?: Array<{ id: string; name: string }>;
}

export interface IAddigyConfig {
  /** the API credentials from Addigy */
  clientId: string;
  clientSecret: string;
  /** user account credentials with owner/power user role */
  adminUsername?: string;
  adminPassword?: string;
}

export interface IAddigyInternalAuthObject {
  orgId: string;
  authtoken: string;
  emailAddress: string;
}

export interface Payload {
  addigy_payload_type:
    | 'com.addigy.syspolicy.system-extension-policy.com.apple.system-extension-policy'
    | 'com.addigy.TCC.configuration-profile-policy.com.apple.TCC.configuration-profile-policy'
    | 'com.addigy.syspolicy.kernel-extension-policy.com.apple.syspolicy.kernel-extension-policy';
  payload_type:
    | 'com.apple.system-extension-policy'
    | 'com.apple.syspolicy.kernel-extension-policy'
    | 'com.apple.TCC.configuration-profile-policy';
  payload_version: number;
  payload_identifier: string;
  payload_uuid: string;
  payload_group_id: string;
  payload_display_name: string;
}
