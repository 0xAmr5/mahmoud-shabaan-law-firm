import { dbService } from './dbService';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export const noteService = {
  async addNote(noteData) {
    try {
      const docRef = await addDoc(collection(db, 'caseNotes'), {
        caseId: noteData.caseId,
        authorId: noteData.authorId,
        authorName: noteData.authorName,
        authorRole: noteData.authorRole,
        lawyerId: noteData.lawyerId || '',
        clientId: noteData.clientId || '',
        content: noteData.content,
        visibility: noteData.visibility || 'INTERNAL', 
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id, error: null };
    } catch (error) {
      return { success: false, id: null, error: error.message };
    }
  },

  async getNotesByCase(caseId, role) {
    try {
      let constraints = [where('caseId', '==', caseId)];
      
      if (role === 'CLIENT') {
        constraints.push(where('visibility', '==', 'CLIENT_VISIBLE'));
      }

      const q = query(collection(db, 'caseNotes'), ...constraints);
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      notes.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      return { data: notes, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  },

  async deleteNote(noteId) {
    return await dbService.deleteDocument('caseNotes', noteId);
  }
};