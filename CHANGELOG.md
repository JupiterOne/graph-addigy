# v2.0.1 (Wed Sep 20 2023)

#### 🐛 Bug Fix

- export ingestion config [#31](https://github.com/JupiterOne/graph-addigy/pull/31) (ronald.arias@contractor.jupiterone.com)

#### Authors: 1

- Ronald Arias ([@RonaldEAM](https://github.com/RonaldEAM))

---

# v2.0.0 (Tue Sep 19 2023)

#### 💥 Breaking Change

- INT-8951 - Update integration [#30](https://github.com/JupiterOne/graph-addigy/pull/30) (ronald.arias@contractor.jupiterone.com)

#### 🐛 Bug Fix

- DEVICE-23 - Add new properties to `addigy_hostagent` [#29](https://github.com/JupiterOne/graph-addigy/pull/29) ([@austinkelleher](https://github.com/austinkelleher))
- v1.0.3 [#24](https://github.com/JupiterOne/graph-addigy/pull/24) (ronald.arias@contractor.jupiterone.com)
- INT-6595 - add displayName to device mapped relationship [#23](https://github.com/JupiterOne/graph-addigy/pull/23) (ronald.arias@contractor.jupiterone.com)
- add addigy policy org and location level [#20](https://github.com/JupiterOne/graph-addigy/pull/20) ([@mcpeach9](https://github.com/mcpeach9))
- Update Integration Documentation [#21](https://github.com/JupiterOne/graph-addigy/pull/21) ([@zemberdotnet](https://github.com/zemberdotnet))
- Changed Title [#18](https://github.com/JupiterOne/graph-addigy/pull/18) ([@janettelynch](https://github.com/janettelynch) [@VDubber](https://github.com/VDubber))
- Fixed bug [#19](https://github.com/JupiterOne/graph-addigy/pull/19) ([@janettelynch](https://github.com/janettelynch))
- Added some properties to the device entity [#11](https://github.com/JupiterOne/graph-addigy/pull/11) ([@ceelias](https://github.com/ceelias))
- Adding simple managed question [#9](https://github.com/JupiterOne/graph-addigy/pull/9) ([@ceelias](https://github.com/ceelias))
- Release v1.0 [#8](https://github.com/JupiterOne/graph-addigy/pull/8) ([@ceelias](https://github.com/ceelias))
- updated the docs to explain process to set up addigy [#7](https://github.com/JupiterOne/graph-addigy/pull/7) ([@ceelias](https://github.com/ceelias))
- Added and refactored some of the properties being ingested [#6](https://github.com/JupiterOne/graph-addigy/pull/6) ([@ceelias](https://github.com/ceelias))
- Added relationships for policy and user [#5](https://github.com/JupiterOne/graph-addigy/pull/5) ([@ceelias](https://github.com/ceelias))
- Add tests [#4](https://github.com/JupiterOne/graph-addigy/pull/4) ([@ceelias](https://github.com/ceelias))
- HostAgent Protects Device [#3](https://github.com/JupiterOne/graph-addigy/pull/3) ([@ceelias](https://github.com/ceelias))
- Integration cleanup [#2](https://github.com/JupiterOne/graph-addigy/pull/2) ([@ceelias](https://github.com/ceelias))
- Initial implementation of graph [#1](https://github.com/JupiterOne/graph-addigy/pull/1) (joao.pedro@contractor.jupiterone.com [@ceelias](https://github.com/ceelias) [@jpodlasnisky](https://github.com/jpodlasnisky))

#### ⚠️ Pushed to `main`

- Initial commit ([@jpodlasnisky](https://github.com/jpodlasnisky))

#### Authors: 9

- Austin Kelleher ([@austinkelleher](https://github.com/austinkelleher))
- Chris Elias ([@ceelias](https://github.com/ceelias))
- Diane Cash ([@mcpeach9](https://github.com/mcpeach9))
- Janette Lynch ([@janettelynch](https://github.com/janettelynch))
- João Pedro Podlasnisky dos Santos ([@jpodlasnisky](https://github.com/jpodlasnisky))
- Joao Pedro Podlasnisky dos Santos (joao.pedro@contractor.jupiterone.com)
- Matthew Zember ([@zemberdotnet](https://github.com/zemberdotnet))
- Ronald Arias ([@RonaldEAM](https://github.com/RonaldEAM))
- Samuel Poulton ([@VDubber](https://github.com/VDubber))

---

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
