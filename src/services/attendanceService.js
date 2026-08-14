import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export const attendanceService = {
  async checkIn({ lawyerId, lawyerName, notes = '' }) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

      const q = query(
        collection(db, 'attendance'),
        where('lawyerId', '==', lawyerId),
        where('date', '==', today)
      );
      const existing = await getDocs(q);

      if (!existing.empty) {
        return { success: false, error: 'لقد قمت بتسجيل الحضور اليوم بالفعل.' };
      }

      const docRef = await addDoc(collection(db, 'attendance'), {
        lawyerId,
        lawyerName,
        date: today,
        checkInTime: timeStr,
        checkOutTime: null,
        status: 'PRESENT',
        notes,
        createdAt: serverTimestamp(),
      });

      return { success: true, id: docRef.id, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async checkOut(lawyerId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

      const q = query(
        collection(db, 'attendance'),
        where('lawyerId', '==', lawyerId),
        where('date', '==', today)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        return { success: false, error: 'لم يتم تسجيل الحضور اليوم لتتمكن من تسجيل الانصراف.' };
      }

      const recordDoc = snap.docs[0];
      await updateDoc(doc(db, 'attendance', recordDoc.id), {
        checkOutTime: timeStr,
      });

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getTodayStatus(lawyerId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(
        collection(db, 'attendance'),
        where('lawyerId', '==', lawyerId),
        where('date', '==', today)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        return { data: null, error: null };
      }

      const record = { id: snap.docs[0].id, ...snap.docs[0].data() };
      return { data: record, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getAllAttendance() {
    try {
      const q = query(collection(db, 'attendance'));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return { data: items, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  },
};