import { dbService } from './dbService';

export const consultationService = {
  async submitRequest(requestData) {
    return await dbService.createDocument('consultationRequests', {
      ...requestData,
      status: 'NEW',
    });
  },

  async getAllRequests() {
    return await dbService.getCollection('consultationRequests');
  }
};