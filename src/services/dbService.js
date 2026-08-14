import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  serverTimestamp
} from 'firebase/firestore';

export const dbService = {
  async createDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  },

  async getDocument(collectionName, docId) {
    try {
      const docSnap = await getDoc(doc(db, collectionName, docId));
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      }
      return { data: null, error: 'المستند غير موجود' };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async updateDocument(collectionName, docId, updates) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteDocument(collectionName, docId) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getCollection(collectionName, constraints = []) {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data: items, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }
};