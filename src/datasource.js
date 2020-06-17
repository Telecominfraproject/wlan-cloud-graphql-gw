import { RESTDataSource } from 'apollo-datasource-rest';

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
  async getAllProfiles(customerId, cursor, limit) {
    return this.get('portal/profile/forCustomer', {
      customerId,
      paginationContext: buildPaginationContext(cursor, limit),
    });
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
  async getAlarmCount(customerId, equipmentIds) {
    const alarmCount = await this.get('portal/alarm/counts', {
      customerId,
      equipmentIds,
    });

    let totalCount = 0;
    Object.keys(alarmCount.totalCountsPerAlarmCodeMap).forEach(
      (i) => (totalCount += alarmCount.totalCountsPerAlarmCodeMap[i])
    );

    return totalCount;
  }

  async filterServiceMetrics(customerId, fromTime, toTime, clientMacs, dataTypes, cursor, limit) {
    return this.get('portal/serviceMetric/forCustomer', {
      customerId,
      fromTime,
      toTime,
      clientMacs,
      dataTypes,
      paginationContext: buildPaginationContext(cursor, limit),
    });
  }
}
