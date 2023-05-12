# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

1.1.0 - 2023-05-12

### Added

- New properties added to entities:

  | Entity             | Properties                                                           |
  | ------------------ | -------------------------------------------------------------------- |
  | `addigy_hostagent` | `serialNumber`, `macAddress`, `wifiMacAddress`, `ethernetMacAddress` |
  | `user_endpoint`    | `macAddress`, `wifiMacAddress`, `ethernetMacAddress`                 |

[1.0.3] - 2023-01-27

### Fixed

- Mapped `Device.displayName` was set to null

[1.0.2] - 2022-02-07

### Added

- New properties added to entities:

  | Entity             | Properties                                    |
  | ------------------ | --------------------------------------------- |
  | `addigy_hostagent` | `totalMemory`, `totalDiskSpace`, `lastOnline` |

[1.0.1] - 2022-01-06

### Added

- Added simple managed question to query for all secure MacOS Devices.

[1.0.0] - 2022-01-06

- Initial version for development and testing
