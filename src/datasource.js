import { RESTDataSource } from 'apollo-datasource-rest';
import DataLoader from 'dataloader';

const fs = require('fs').promises;

const buildPaginationContext = (cursor, limit, context) =>
  JSON.stringify({
    cursor,
    ...context,
    model_type: 'PaginationContext',
    maxItemsPerPage: limit,
  });

export class API extends RESTDataSource {
  get baseURL() {
    if (process.env.NODE_ENV !== 'production' && !process.env.API) {
      return 'https://localhost:9091/';
    }
    return 'https://' + process.env.API + '/';
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token);
  }

  ouiDataloader = new DataLoader(async (keys) => {
    const results = await this.get('portal/manufacturer/oui/list', {
      ouiList: keys,
    });

    return keys.map((key) => results[key]);
  });

  profileLoader = new DataLoader(async (keys) => {
    const results = await this.get('portal/profile/equipmentCounts', {
      profileIdSet: keys,
    });

    return keys.map((id) => results.find((i) => i.value1 === id));
  });

  async createToken(userId, password) {
    return this.post('management/v1/oauth2/token', {
      userId,
      password,
    });
  }
  async updateToken(refreshToken) {
    return this.post('management/v1/oauth2/refreshToken', {
      refreshToken,
    });
  }

  async createUser(user) {
    return this.post('portal/portalUser', {
      ...user,
    });
  }
  async getUser(portalUserId) {
    return this.get('portal/portalUser', {
      portalUserId,
    });
  }
  async updateUser(user) {
    return this.put('portal/portalUser', {
      ...user,
    });
  }
  async deleteUser(portalUserId) {
    return this.delete('portal/portalUser', {
      portalUserId,
    });
  }
  async getAllUsers(customerId, cursor, limit, context) {
    return this.get('portal/portalUser/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }

  async getCustomer(customerId) {
    return this.get('portal/customer', {
      customerId,
    });
  }
  async updateCustomer(customer) {
    return this.put('portal/customer', {
      ...customer,
    });
  }
  async findCustomer() {
    return this.get('portal/customer/find', {
      criteria: '',
      maxResults: 10,
    });
  }

  async createLocation(location) {
    return this.post('portal/location', {
      ...location,
    });
  }
  async getLocation(locationId) {
    return this.get('portal/location', {
      locationId,
    });
  }
  async updateLocation(location) {
    return this.put('portal/location', {
      ...location,
    });
  }
  async deleteLocation(locationId) {
    return this.delete('portal/location', {
      locationId,
    });
  }
  async getAllLocations(customerId) {
    return this.get('portal/location/allForCustomer', {
      customerId,
    });
  }

  async createEquipment(equipment) {
    return this.post('portal/equipment', {
      ...equipment,
      equipmentType: 'AP',
    });
  }
  async getEquipment(equipmentId) {
    return this.get('portal/equipment', {
      equipmentId,
    });
  }
  async updateEquipment(equipment) {
    return this.put('portal/equipment', {
      ...equipment,
    });
  }
  async deleteEquipment(equipmentId) {
    return this.delete('portal/equipment', {
      equipmentId,
    });
  }
  async getAllEquipment(customerId, cursor, limit, context) {
    return this.get('portal/equipment/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }
  async filterEquipment(customerId, locationIds, equipmentType, cursor, limit, context) {
    if (locationIds && locationIds.length === 0) {
      return null;
    }
    return this.get('portal/equipment/forCustomerWithFilter', {
      customerId,
      locationIds,
      equipmentType,
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }
  async updateEquipmentBulk(items) {
    return this.put('portal/equipment/rrmBulk', {
      items,
    });
  }
  async updateEquipmentFirmware(equipmentId, firmwareVersionId) {
    return this.post(
      `portal/equipmentGateway/requestFirmwareUpdate?equipmentId=${equipmentId}&firmwareVersionId=${firmwareVersionId}`
    );
  }
  async requestEquipmentSwitchBank(equipmentId) {
    return this.post(
      `portal/equipmentGateway/requestApSwitchSoftwareBank?equipmentId=${equipmentId}`
    );
  }
  async requestEquipmentReboot(equipmentId) {
    return this.post(`portal/equipmentGateway/requestApReboot?equipmentId=${equipmentId}`);
  }
  async requestEquipmentFactoryReset(equipmentId) {
    return this.post(`portal/equipmentGateway/requestApFactoryReset?equipmentId=${equipmentId}`);
  }

  async getEquipmentStatus(customerId, equipmentIds, statusDataTypes) {
    return this.get('portal/status/forEquipmentWithFilter', {
      customerId,
      equipmentIds,
      statusDataTypes,
    });
  }

  async getClientSession(customerId, macAddress) {
    return this.get('portal/client/session/inSet', {
      customerId,
      clientMacs: [macAddress],
    });
  }
  async filterClientSessions(customerId, locationIds, cursor, limit, context) {
    return this.get('portal/client/session/forCustomer', {
      customerId,
      locationIds,
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }

  async createProfile(profile) {
    const newProfile = await this.post('portal/profile', {
      ...profile,
    });

    if (profile.profileType === 'ssid') {
      const {
        details: { passpointProfileId, passpointConfig },
      } = profile;

      if (passpointConfig === 'accessSSID') {
        this.get('portal/profile', {
          profileId: passpointProfileId.value,
        }).then((profile) => {
          this.put('portal/profile', {
            ...profile,
            details: {
              ...profile.details,
              associatedAccessSsidProfileIds: profile.details.associatedAccessSsidProfileIds
                ? [...profile.details.associatedAccessSsidProfileIds, newProfile.id]
                : [newProfile.id],
            },
          });
        });
      } else if (passpointConfig === 'osuSSID') {
        this.get('portal/profile', {
          profileId: passpointProfileId.value,
        }).then((profile) => {
          if (profile.details.osuSsidProfileId) {
            this.get('portal/profile', {
              profileId: profile.details.osuSsidProfileId,
            }).then((ssidProfile) => {
              this.put('portal/profile', {
                ...ssidProfile,
                childProfileIds: ssidProfile.childProfileIds.filter((i) => i !== profile.id),
              });
            });
          }

          this.put('portal/profile', {
            ...profile,
            details: {
              ...profile.details,
              osuSsidProfileId: newProfile.id,
            },
          });
        });
      }
    }

    return newProfile;
  }
  async getProfile(profileId) {
    return this.get('portal/profile', {
      profileId,
    });
  }
  async updateProfile(profile) {
    if (profile.profileType === 'ssid') {
      const {
        id,
        details: { passpointProfileId = {}, passpointConfig },
      } = profile;

      const oldProfile = await this.get('portal/profile', { profileId: id });
      if (oldProfile.childProfileIds.length) {
        const childProfiles =
          (await this.get('portal/profile/inSet', {
            profileIdSet: oldProfile.childProfileIds,
          })) || [];

        const passpointProfile = childProfiles.find(
          (profile) => profile.profileType === 'passpoint'
        );

        if (passpointProfile) {
          if (
            !passpointProfileId.value ||
            passpointProfile.id !== parseInt(passpointProfileId.value, 10)
          ) {
            this.put('portal/profile', {
              ...passpointProfile,
              details: {
                ...passpointProfile.details,
                ...(passpointProfile.details.osuSsidProfileId === parseInt(id, 10) && {
                  osuSsidProfileId: null,
                }),
                ...(passpointProfile.details.associatedAccessSsidProfileIds && {
                  associatedAccessSsidProfileIds: passpointProfile.details.associatedAccessSsidProfileIds.filter(
                    (i) => i !== parseInt(id, 10)
                  ),
                }),
              },
            });
          }
        }
      }

      if (passpointProfileId.value) {
        if (passpointConfig === 'accessSSID') {
          this.get('portal/profile', {
            profileId: passpointProfileId.value,
          }).then((profile) => {
            this.put('portal/profile', {
              ...profile,
              details: {
                ...profile.details,
                ...(profile.details.osuSsidProfileId === parseInt(id, 10) && {
                  osuSsidProfileId: null,
                }),
                associatedAccessSsidProfileIds: profile.details.associatedAccessSsidProfileIds
                  ? [...profile.details.associatedAccessSsidProfileIds, id]
                  : [id],
              },
            });
          });
        } else if (passpointConfig === 'osuSSID') {
          this.get('portal/profile', {
            profileId: passpointProfileId.value,
          }).then((profile) => {
            if (profile.details.osuSsidProfileId) {
              this.get('portal/profile', {
                profileId: profile.details.osuSsidProfileId,
              }).then((ssidProfile) => {
                this.put('portal/profile', {
                  ...ssidProfile,
                  childProfileIds: ssidProfile.childProfileIds.filter((i) => i !== profile.id),
                });
              });
            }

            this.put('portal/profile', {
              ...profile,
              details: {
                ...profile.details,
                ...(profile.details.associatedAccessSsidProfileIds && {
                  associatedAccessSsidProfileIds: profile.details.associatedAccessSsidProfileIds.filter(
                    (i) => i !== parseInt(id, 10)
                  ),
                }),
                osuSsidProfileId: id,
              },
            });
          });
        }
      }
    }

    return this.put('portal/profile', {
      ...profile,
    });
  }
  async deleteProfile(profileId) {
    const deletedProfile = await this.delete('portal/profile', {
      profileId,
    });

    if (deletedProfile.profileType === 'ssid') {
      if (deletedProfile.childProfileIds.length) {
        const childProfiles =
          (await this.get('portal/profile/inSet', {
            profileIdSet: deletedProfile.childProfileIds,
          })) || [];

        const passpointProfile = childProfiles.find(
          (profile) => profile.profileType === 'passpoint'
        );
        if (passpointProfile) {
          this.put('portal/profile', {
            ...passpointProfile,
            details: {
              ...passpointProfile.details,
              ...(passpointProfile.details.osuSsidProfileId === parseInt(profileId, 10) && {
                osuSsidProfileId: null,
              }),
              ...(passpointProfile.details.associatedAccessSsidProfileIds && {
                associatedAccessSsidProfileIds: passpointProfile.details.associatedAccessSsidProfileIds.filter(
                  (i) => i !== parseInt(profileId, 10)
                ),
              }),
            },
          });
        }
      }
    }

    return deletedProfile;
  }
  async getAllProfiles({ customerId, cursor, limit, type, context }) {
    return this.get('portal/profile/forCustomer', {
      customerId,
      ...(type && { profileType: type }),
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }
  async getProfilesById(profileIdSet) {
    return this.get('portal/profile/inSet', {
      profileIdSet,
    });
  }
  async getProfileCountById(id) {
    return this.profileLoader.load(id);
  }

  async getAllAlarms(customerId, cursor, limit, context) {
    return this.get('portal/alarm/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }
  async getAllAlarmsForEquipment(customerId, equipmentIds) {
    return this.get('portal/alarm/forEquipment', {
      customerId,
      equipmentIds,
    });
  }
  async getAlarmCount(customerId, equipmentIds = [], alarmCodes = []) {
    return this.get('portal/alarm/counts', {
      customerId,
      equipmentIds,
      alarmCodes,
    });
  }

  async filterServiceMetrics(
    customerId,
    fromTime,
    toTime,
    equipmentIds,
    clientMacs,
    dataTypes,
    cursor,
    limit,
    context
  ) {
    return this.get('portal/serviceMetric/forCustomer', {
      customerId,
      fromTime,
      toTime,
      equipmentIds: equipmentIds || [],
      clientMacs: clientMacs || [],
      dataTypes,
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }
  async filterSystemEvents(
    customerId,
    fromTime,
    toTime,
    equipmentIds,
    dataTypes,
    cursor,
    limit,
    context
  ) {
    return this.get('portal/systemEvent/forCustomer', {
      customerId,
      fromTime,
      toTime,
      equipmentIds: equipmentIds || [],
      dataTypes: dataTypes || [],
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }

  async getOuiLookup(oui) {
    const result = await this.ouiDataloader.load(oui.toLowerCase());

    return result && (result.manufacturerAlias || result.manufacturerName);
  }

  async getOui(oui) {
    return this.get('portal/manufacturer/oui', {
      oui,
    });
  }
  async updateOui(oui) {
    return this.put('portal/manufacturer/oui/alias', {
      ...oui,
    });
  }
  async getAllOui() {
    return this.get('portal/manufacturer/oui/all');
  }

  async createFirmware(firmware) {
    return this.post('portal/firmware/version', {
      ...firmware,
      equipmentType: 'AP',
      validationMethod: 'MD5_CHECKSUM',
    });
  }
  async updateFirmware(firmware) {
    return this.put('portal/firmware/version', {
      ...firmware,
      equipmentType: 'AP',
      validationMethod: 'MD5_CHECKSUM',
    });
  }
  async deleteFirmware(id) {
    return this.delete('portal/firmware/version', {
      firmwareVersionId: id,
    });
  }
  async getAllFirmware(modelId) {
    return this.get('portal/firmware/version/byEquipmentType', {
      equipmentType: 'AP',
      modelId: modelId || '',
    });
  }

  async getAllFirmwareModelId() {
    return this.get('portal/firmware/model/byEquipmentType', {
      equipmentType: 'AP',
    });
  }

  async getAllFirmwareTrackAssignment() {
    return this.get('portal/firmware/trackAssignment', {
      firmwareTrackName: 'DEFAULT',
    });
  }
  async updateFirmwareTrackAssignment(firmware) {
    return this.put('portal/firmware/trackAssignment', {
      ...firmware,
    });
  }
  async deleteFirmwareTrackAssignment(firmwareTrackId, firmwareVersionId) {
    return this.delete('portal/firmware/trackAssignment', {
      firmwareTrackId,
      firmwareVersionId,
    });
  }

  async getFirmwareTrack(firmwareTrackName) {
    return this.get('portal/firmware/track/byName', {
      firmwareTrackName,
    });
  }

  async getAllStatus(customerId, statusDataTypes, cursor, limit, context) {
    return this.get('portal/status/forCustomerWithFilter', {
      customerId,
      equipmentIds: 0,
      statusDataTypes,
      paginationContext: buildPaginationContext(cursor, limit, context),
    });
  }

  async fileUpload(fileName, file) {
    const result = await this.post(`filestore/${fileName}`, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    return result && result.success && { fileName };
  }

  async ouiUpload(fileName, file) {
    return this.post(`portal/manufacturer/oui/upload?fileName=${fileName}`, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  }

  async getClients(customerId, macAddresses) {
    return this.get('portal/client/inSet', {
      customerId,
      clientMacs: macAddresses,
    });
  }
  async getBlockedClients(customerId) {
    return this.get('portal/client/blocked', {
      customerId,
    });
  }
  async updateClient(data) {
    return this.put('portal/client', {
      ...data,
    });
  }
}
