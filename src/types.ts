// Providers often supply types with their API libraries.

import { Entity } from '@jupiterone/integration-sdk-core';

export enum AlertStatus {
  Acknowledged = 'Acknowledged',
  Resolved = 'Resolved',
  Unattended = 'Unattended',
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

export interface Device {
  serial_number: string;
  iMEI: string;
  remoteDesktopEnabled: boolean;
  activeManagedUsers: string[];
  batteryCicles: number;
  hasMDM: boolean;
  installedProfiles: string[];
  currentMCC: string;
  locationServiceEnabled: boolean;
  batteryFailures: number;
  uptime: number;
  isAppleSilicon: boolean;
  fileVaultKeyEscrowed: boolean;
  filesServed: number;
  policyId: string;
  firewallEnabled: boolean;
  adminUsers: string[];
  policyExecution: number;
  batteryPercentage: number;
  crashplanDaysSinceLastBackup: number;
  voiceRoamingEnabled: boolean;
  simCarrier: string;
  isSupervised: boolean;
  batteryTemperature: number;
  javaVersion: string;
  locales: string[];
  macOSXVersion: string;
  authenticatedRootVolumeEnabled: boolean;
  bootstrapTokenAllowedForAuthentication: string;
  localhostName: string;
  tmpSize: number;
  peerCount: number;
  modemFirmwareVersion: string;
  firewallBlockAllIncomingConnections: boolean;
  passcodePresent: boolean;
  languages: string[];
  subscriberCarrier: string;
  easDeviceId: string;
  deviceModelName: string;
  fileVaultEnabled: boolean;
  phoneNumber: string;
  javaVendor: string;
  thirdPartyAgents: string[];
  warrantyExpirationDate: string;
  bootstrapTokenRequiredForSoftwareUpdate: boolean;
  systemVersion: string;
  localIP: string;
  screenConnectSessionId: string;
  bandwidthSaved: number;
  timezone: string;
  clientIp: string;
  subscriberMCC: string;
  splashtopInstallationDate: string;
  policyIds: string[];
  xCodeInstalled: boolean;
  displaysSerialNumber: string;
  subscriberMNC: string;
  thirdTwoBitApplicationPaths: string;
  timeMachineDaysSinceLastBackup: number;
  ethernetMACS: null;
  gatekeeperEnabled: true;
  smartFailing: false;
  passcodeLockGracePeriodEnforced: null;
  isRecoveryLockEnabled: null;
  hardwareEncryptionCapability: null;
  hasMDMProfileApproved: boolean;
  registrationDate: string;
  deviceName: string;
  lastCloudBackupDate: string;
  batteryCharging: boolean;
  batteryCapacityLossPercentage: number;
  lastRebootTimestamp: number;
  processorSpeed: number;
  addigyIdentityUsers: string;
  wifiMACAddress: string;
  carrierSettingsVersion: string;
  warrantyDaysLeft: number;
  usedMemory: number;
  meId: string;
  firmwarePasswordAllowOrams: boolean;
  hasWireless: boolean;
  awaitingConfiguration: boolean;
  currentCarrier: string;
  batteryTemperatureFarenheit: number;
  ethernetMACAddress: null;
  dataRoamingEnabled: boolean;
  firewallAllowedApplications: string[];
  iCCID: string;
  productDescription: string;
  addigySplashtopInstalled: string;
  passcodeCompliantWithProfiles: string;
  enrolledViaDEP: boolean;
  daysSinceLastCloudBackup: string;
  bandwidthServed: number;
  totalMemory: number;
  osVersion: string;
  macUUID: string;
  thirdPartyDaemons: string[];
  secureBootLevel: string;
  udid: string;
  agentVersion: string;
  maxResidentUsers: number;
  bootstrapTokenRequiredForKernelExtensionApproval: boolean;
  approvedPatchesApplied: number;
  isRoaming: boolean;
  hostName: string;
  kernelPanic: boolean;
  passcodeCompliant: string;
  bluetoothMAC: string;
  online: boolean;
  agentid: string;
  watchmanMonitoringInstalled: boolean;
  remoteLoginEnabled: boolean;
  userEnrollment: boolean;
  lANCacheSize: number;
  activationLockEnabled: boolean;
  freeDiskPercentage: number;
  cellularTechnology: number;
  isActivationLockManageable: boolean;
  mdmLostModeEnabled: boolean;
  hardwareModel: string;
  buildVersion: string;
  lastOnline: string;
  timeMachineLastBackupDate: string;
  thirdPartyKernelExtensions: string;
  processorType: string;
  manufacturedDate: string;
  currentMNC: string;
  teamViewerClientId: string;
  externalBootLevel: string;
  passcodeLockGracePeriod: string;
  cloudBackupEnabled: boolean;
  totalDiskSpace: number;
  currentUser: string;
  displayOn: boolean;
  doNotDisturbEnabled: boolean;
  firewallBlockedApplications: string;
  addigyIdentityInstalled: boolean;
  splashtopID: string;
  systemIntegrityProtectionEnabled: boolean;
  personalHotspotEnabled: boolean;
  productName: string;
  firmwarePasswordExists: boolean;
  firmwarePasswordChangePending: boolean;
  firewallStealthModeEnabled: boolean;
  softwareUpdateDeviceID: string;
  osPlatform: string;
  freeDiskSpace: number;
}

export interface Group {
  id: string;
  name: string;
  users?: Pick<User, id>[];
}

// Those can be useful to a degree, but often theyre just full of optional
// values. Understanding the response data may be more reliably accomplished by
// reviewing the API response recordings produced by testing the wrapper client
// (./client.ts). However, when there are no types provided, it is necessary to define
// opaque types for each resource, to communicate the records that are expected
// to come from an endpoint and are provided to iterating functions.

/*
import { Opaque } from type-fest;
export type AcmeUser = Opaque<any, AcmeUser>;
export type AcmeGroup = Opaque<any, AcmeGroup>;
*/
