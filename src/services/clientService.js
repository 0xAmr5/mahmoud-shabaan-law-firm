import { dbService } from './dbService';
import { db } from '../firebase/config';
import { doc, setDoc, where, serverTimestamp } from 'firebase/firestore';

export const clientService = {
  async getAllClients() {
    return await dbService.getCollection('users', [
      where('role', '==', 'CLIENT')
    ]);
  },

  async createClient(clientData) {
    try {
      const clientId = 'client_' + Date.now();
      const newClientProfile = {
        uid: clientId,
        name: clientData.name,
        email: clientData.email || '',
        phone: clientData.phone,
        nationalId: clientData.nationalId || '',
        address: clientData.address || '',
        role: 'CLIENT',
        status: 'ACTIVE',
        activeCasesCount: 0,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', clientId), newClientProfile);
      return { success: true, id: clientId, error: null };
    } catch (error) {
      return { success: false, id: null, error: error.message };
    }
  },

  async updateLeadStatus(requestId, status) {
    return await dbService.updateDocument('consultationRequests', requestId, {
      status: status,
    });
  },

  async convertLeadToClient(leadData) {
    const res = await this.createClient({
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
    });

    if (res.success) {
      await this.updateLeadStatus(leadData.id, 'CONVERTED');
    }
    return res;
  }
};