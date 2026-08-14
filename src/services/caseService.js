import { dbService } from './dbService';
import { db } from '../firebase/config';

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';


export const caseService = {

  // =========================
  // CREATE CASE
  // =========================

  async createCase(caseData) {

    return await dbService.createDocument(
      'cases',
      {
        ...caseData,

        status:
          caseData.status ||
          'NEW',

        priority:
          caseData.priority ||
          'MEDIUM',

        filingDate:
          caseData.filingDate ||
          new Date()
            .toISOString()
            .split('T')[0],
      }
    );
  },


  // =========================
  // GET ALL CASES
  // =========================

  async getAllCases() {

    return await dbService.getCollection(
      'cases'
    );
  },


  // =========================
  // GET CASES BY LAWYER
  // =========================

  async getCasesByLawyer(
    lawyerId
  ) {

    return await dbService.getCollection(
      'cases',
      [
        where(
          'lawyerId',
          '==',
          lawyerId
        ),
      ]
    );
  },


  // =========================
  // GET CASES BY CLIENT
  // =========================

  async getCasesByClient(
    clientId
  ) {

    return await dbService.getCollection(
      'cases',
      [
        where(
          'clientId',
          '==',
          clientId
        ),
      ]
    );
  },


  // =========================
  // UPDATE CASE STATUS
  // =========================

  async updateCaseStatus(
    caseId,
    status
  ) {

    return await dbService.updateDocument(
      'cases',
      caseId,
      {
        status,
      }
    );
  },


  // =========================
  // ADD CASE TIMELINE EVENT
  // =========================

  async addCaseEvent(
    caseId,
    eventData
  ) {

    try {

      const docRef = await addDoc(
        collection(db, 'caseEvents'),
        {

          caseId,

          title:
            eventData.title,

          description:
            eventData.description ||
            '',

          visibility:
            eventData.visibility ||
            'INTERNAL',

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      return {
        success: true,
        id: docRef.id,
        error: null,
      };

    } catch (error) {

      console.error(
        'Add Case Event Error:',
        error
      );

      return {
        success: false,
        id: null,
        error: error.message,
      };
    }
  },


  // =========================
  // GET CASE TIMELINE
  // =========================

  async getCaseTimeline(
    caseId,
    isClientView = false
  ) {

    try {

      let constraints = [
        where(
          'caseId',
          '==',
          caseId
        ),
      ];

      if (isClientView) {

        constraints.push(
          where(
            'visibility',
            '==',
            'CLIENT_VISIBLE'
          )
        );

      }

      const q = query(
        collection(db, 'caseEvents'),
        ...constraints
      );

      const querySnapshot =
        await getDocs(q);

      const events =
        querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      // Sort newest first
      events.sort(
        (a, b) => {

          const aSeconds =
            a.createdAt?.seconds ||
            0;

          const bSeconds =
            b.createdAt?.seconds ||
            0;

          return (
            bSeconds -
            aSeconds
          );
        }
      );

      return {
        data: events,
        error: null,
      };

    } catch (error) {

      console.error(
        'Get Case Timeline Error:',
        error
      );

      return {
        data: [],
        error: error.message,
      };
    }
  },
};