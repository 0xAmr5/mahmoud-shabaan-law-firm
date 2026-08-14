import { dbService } from './dbService';
import { db } from '../firebase/config';
import { authService } from './authService';

import {
  doc,
  updateDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export const lawyerService = {
  async createLawyer(lawyerData) {
    try {
      const result =
        await authService.createAccountByAdmin({
          email: lawyerData.email,
          password: lawyerData.password,
          name: lawyerData.name,
          phone: lawyerData.phone,
          role: 'LAWYER',

          additionalData: {
            specialization: lawyerData.specialization,
            status: 'ACTIVE',
            activeCasesCount: 0,
            pendingTasksCount: 0,
          },
        });

      if (!result.success) {
        return {
          success: false,
          id: null,
          error: result.error,
        };
      }

      return {
        success: true,
        id: result.uid,
        error: null,
      };
    } catch (error) {
      console.error(
        'CREATE LAWYER ERROR:',
        error
      );

      return {
        success: false,
        id: null,
        error: error.message,
      };
    }
  },

  async getAllLawyers() {
    return await dbService.getCollection(
      'users',
      [
        where('role', '==', 'LAWYER'),
      ]
    );
  },

  async toggleLawyerStatus(
    lawyerId,
    currentStatus
  ) {
    try {
      const newStatus =
        currentStatus === 'ACTIVE'
          ? 'INACTIVE'
          : 'ACTIVE';

      await updateDoc(
        doc(db, 'users', lawyerId),
        {
          status: newStatus,
          updatedAt: serverTimestamp(),
        }
      );

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};