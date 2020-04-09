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

  async findCustomer() {
    return this.get('portal/customer/find', {
      criteria: '',
      maxResults: 10,
    });
  }
}
