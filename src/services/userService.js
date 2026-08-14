import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';

export const userService = {
  // جلب كل المستخدمين
  getAllUsers: async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const users = snap.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }));
      return { data: users, error: null };
    } catch (err) {
      console.error('getAllUsers error:', err);
      return { data: [], error: err.message };
    }
  },

  // جلب مستخدم محدد بالـ UID
  getUserById: async (uid) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, uid: docSnap.id, ...docSnap.data() }, error: null };
      }
      return { data: null, error: 'المستخدم غير موجود' };
    } catch (err) {
      console.error('getUserById error:', err);
      return { data: null, error: err.message };
    }
  },

  // جلب المحامين فقط
  getLawyers: async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'LAWYER'));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }));
      return { data, error: null };
    } catch (err) {
      console.error('getLawyers error:', err);
      return { data: [], error: err.message };
    }
  },

  // جلب الموكلين فقط
  getClients: async () => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'CLIENT'));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }));
      return { data, error: null };
    } catch (err) {
      console.error('getClients error:', err);
      return { data: [], error: err.message };
    }
  },

  // تحديث بيانات المستخدم
  updateUserProfile: async (uid, updateData) => {
    try {
      await updateDoc(doc(db, 'users', uid), updateData);
      return { success: true, error: null };
    } catch (err) {
      console.error('updateUserProfile error:', err);
      return { success: false, error: err.message };
    }
  },
};

export default userService;