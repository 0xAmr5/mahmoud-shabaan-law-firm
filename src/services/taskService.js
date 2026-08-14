import { dbService } from './dbService';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

export const taskService = {
  async createTask(taskData) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        title: taskData.title,
        description: taskData.description || '',
        caseId: taskData.caseId || '',
        caseNumber: taskData.caseNumber || '',
        assignedToLawyerId: taskData.assignedToLawyerId,
        assignedToLawyerName: taskData.assignedToLawyerName,
        assignedByAdminName: taskData.assignedByAdminName || 'صاحب المكتب',
        dueDate: taskData.dueDate,
        priority: taskData.priority || 'MEDIUM', 
        status: 'PENDING', 
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id, error: null };
    } catch (error) {
      return { success: false, id: null, error: error.message };
    }
  },

  async getAllTasks() {
    return await dbService.getCollection('tasks');
  },

  async getTasksByLawyer(lawyerId) {
    return await dbService.getCollection('tasks', [
      where('assignedToLawyerId', '==', lawyerId)
    ]);
  },

  async updateTaskStatus(taskId, status) {
    return await dbService.updateDocument('tasks', taskId, { status });
  },

  async deleteTask(taskId) {
    return await dbService.deleteDocument('tasks', taskId);
  }
};