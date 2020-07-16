import { RESTDataSource } from 'apollo-datasource-rest';
import DataLoader from 'dataloader';

const fs = require('fs').promises;

const buildPaginationContext = (cursor, limit) =>
  JSON.stringify({
    model_type: 'PaginationContext',
    maxItemsPerPage: limit,
    cursor,
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
  async getAllUsers(customerId, cursor, limit) {
    return this.get('portal/portalUser/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit),
    });
  }

  async getCustomer(customerId) {
    return this.get('portal/customer', {
      customerId,
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
  async getAllEquipment(customerId, cursor, limit) {
    return this.get('portal/equipment/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit),
    });
  }
  async filterEquipment(customerId, locationIds, equipmentType, cursor, limit) {
    if (locationIds && locationIds.length === 0) {
      return null;
    }
    return this.get('portal/equipment/forCustomerWithFilter', {
      customerId,
      locationIds,
      equipmentType,
      paginationContext: buildPaginationContext(cursor, limit),
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

  async getEquipmentStatus(customerId, equipmentIds, statusDataTypes) {
    return this.get('portal/status/forCustomerWithFilter', {
      customerId,
      equipmentIds,
      statusDataTypes,
      paginationContext: buildPaginationContext(),
    });
  }

  async getClientSession(customerId, macAddress) {
    return this.get('portal/client/session/inSet', {
      customerId,
      clientMacs: [macAddress],
    });
  }
  async filterClientSessions(customerId, locationIds, cursor, limit) {
    return this.get('portal/client/session/forCustomer', {
      customerId,
      locationIds,
      paginationContext: buildPaginationContext(cursor, limit),
    });
  }

  async createProfile(profile) {
    return this.post('portal/profile', {
      ...profile,
    });
  }
  async getProfile(profileId) {
    return this.get('portal/profile', {
      profileId,
    });
  }
  async updateProfile(profile) {
    return this.put('portal/profile', {
      ...profile,
    });
  }
  async deleteProfile(profileId) {
    return this.delete('portal/profile', {
      profileId,
    });
  }
  async getAllProfiles({ customerId, cursor, limit, type }) {
    const result = await this.get('portal/profile/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit),
    });

    if (type && result.items) {
      result.items = result.items.filter((i) => i.profileType === type);
      return result;
    }

    return result;
  }
  async getProfilesById(profileIdSet) {
    return this.get('portal/profile/inSet', {
      profileIdSet,
    });
  }

  async getAllAlarms(customerId, cursor, limit) {
    return this.get('portal/alarm/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit),
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
    limit
  ) {
    return this.get('portal/serviceMetric/forCustomer', {
      customerId,
      fromTime,
      toTime,
      equipmentIds: equipmentIds || [],
      clientMacs: clientMacs || [],
      dataTypes,
      paginationContext: buildPaginationContext(cursor, limit),
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
    });
  }
  async updateFirmware(firmware) {
    return this.put('portal/firmware/version', {
      ...firmware,
      equipmentType: 'AP',
    });
  }
  async deleteFirmware(id) {
    return this.delete('portal/firmware/version', {
      id,
    });
  }
  async getAllFirmware() {
    return this.get('portal/firmware/version/byEquipmentType', {
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

  async getAllStatus(customerId, statusDataTypes, cursor, limit) {
    return this.get('portal/status/forCustomerWithFilter', {
      customerId,
      statusDataTypes,
      paginationContext: buildPaginationContext(cursor, limit),
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
    const result = await this.post(`portal/manufacturer/oui/upload?fileName=${fileName}`, file, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    return result && result.success && { fileName };
  }
}
