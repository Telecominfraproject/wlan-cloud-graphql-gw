import { RESTDataSource } from 'apollo-datasource-rest';

export class API extends RESTDataSource {
  get baseURL() {
    if (process.env.NODE_ENV !== 'production') {
      return 'https://localhost:9091/';
    }
    return '';
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
  async getAllUsers(customerId) {
    return this.get('portal/portalUser/forCustomer', {
      customerId,
      paginationContext: JSON.stringify({
        model_type: 'PaginationContext',
        maxItemsPerPage: 20,
      }),
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
  async getAllEquipment(customerId) {
    return this.get('portal/equipment/forCustomer', {
      customerId,
      paginationContext: JSON.stringify({
        model_type: 'PaginationContext',
        maxItemsPerPage: 20,
      }),
    });
  }
  async filterEquipment(customerId, locationIds, equipmentType) {
    return this.get('portal/equipment/forCustomerWithFilter', {
      customerId,
      locationIds,
      equipmentType,
      paginationContext: JSON.stringify({
        model_type: 'PaginationContext',
        maxItemsPerPage: 20,
      }),
    });
  }
}
