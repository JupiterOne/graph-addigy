// Providers often supply types with their API libraries.

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
  authToken: string;
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
