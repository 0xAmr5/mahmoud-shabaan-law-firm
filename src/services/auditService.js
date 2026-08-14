import { dbService } from './dbService';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export const auditService = {
  // تسجيل حدث جديد
  async logAction({ userId, userName, role, action, target, details = {} }) {
    try {
      await addDoc(collection(db, 'auditLogs'), {
        userId: userId || 'SYSTEM',
        userName: userName || 'النظام',
        role: role || 'SYSTEM',
        action, // مثال: CREATE_CASE, DELETE_DOCUMENT, CONVERT_LEAD
        target, // القضية أو العميل المعني
        details,
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Audit Log Error:', error);
      return { success: false, error: error.message };
    }
  },

  // جلب كافة سجلات الأنشطة (للأدمن فقط)
  async getAllLogs() {
    try {
      const q = query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const logs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: logs, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }
};