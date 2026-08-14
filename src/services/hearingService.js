import { dbService } from './dbService';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export const hearingService = {
  // إضافة جلسة جديدة
  async addHearing(hearingData) {
    try {
      const docRef = await addDoc(collection(db, 'hearings'), {
        caseId: hearingData.caseId,
        caseNumber: hearingData.caseNumber || '',
        caseTitle: hearingData.caseTitle || '',
        court: hearingData.court,
        date: hearingData.date,
        time: hearingData.time || '09:00',
        lawyerId: hearingData.lawyerId || '',
        lawyerName: hearingData.lawyerName || '',
        clientId: hearingData.clientId || '',
        clientName: hearingData.clientName || '',
        status: 'UPCOMING', // UPCOMING, COMPLETED, POSTPONED, CANCELLED
        decision: '',
        nextHearingDate: '',
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id, error: null };
    } catch (error) {
      return { success: false, id: null, error: error.message };
    }
  },

  // جلب كافة الجلسات (للأدمن)
  async getAllHearings() {
    return await dbService.getCollection('hearings');
  },

  // جلب جلسات قضية محددة
  async getHearingsByCase(caseId) {
    return await dbService.getCollection('hearings', [
      where('caseId', '==', caseId)
    ]);
  },

  // تسجيل نتيجة وقرار الجلسة وتأجيلها
  async updateHearingDecision(hearingId, decisionData) {
    const updates = {
      decision: decisionData.decision,
      status: 'COMPLETED',
      nextHearingDate: decisionData.nextHearingDate || '',
    };

    const res = await dbService.updateDocument('hearings', hearingId, updates);

    // إذا تم تحديد جلسة قادمة، يتم إنشاؤها تلقائياً في الأجندة
    if (res.success && decisionData.nextHearingDate) {
      await this.addHearing({
        caseId: decisionData.caseId,
        caseNumber: decisionData.caseNumber,
        caseTitle: decisionData.caseTitle,
        court: decisionData.court,
        date: decisionData.nextHearingDate,
        time: '09:00',
        lawyerId: decisionData.lawyerId,
        lawyerName: decisionData.lawyerName,
        clientId: decisionData.clientId,
        clientName: decisionData.clientName,
      });
    }

    return res;
  }
};