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

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkthrgzvj';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'law_firm_preset';

export const documentService = {
  async uploadFileToCloudinary(file, onProgress = null) {
    if (!file) {
      return { url: null, publicId: null, error: 'لم يتم اختيار أي ملف.' };
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress({
              percent,
              uploadedBytes: event.loaded,
              totalBytes: event.total,
              status: percent === 100 ? 'processing' : 'uploading',
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            resolve({
              url: res.secure_url || res.url,
              publicId: res.public_id,
              resourceType: res.resource_type || 'raw',
              format: res.format || file.name.split('.').pop() || '',
              bytes: res.bytes || file.size,
              originalFilename: file.name,
              error: null,
            });
          } else {
            let errorMsg = 'تعذر رفع المستند، تأكد من الاتصال.';
            try {
              const errRes = JSON.parse(xhr.responseText);
              if (errRes?.error?.message) {
                errorMsg = errRes.error.message;
              }
            } catch {}
            resolve({
              url: null,
              publicId: null,
              error: errorMsg,
            });
          }
        };

        xhr.onerror = () => {
          resolve({
            url: null,
            publicId: null,
            error: 'حدث خطأ في الشبكة أثناء الرفع.',
          });
        };

        xhr.send(formData);
      });
    } catch (error) {
      return {
        url: null,
        publicId: null,
        error: error?.message || 'حدث خطأ أثناء الرفع.',
      };
    }
  },

  async saveDocumentMetadata(docData) {
    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        title: docData.title?.trim() || 'مستند بدون اسم',
        category: docData.category || 'عام',
        caseId: docData.caseId || '',
        caseNumber: docData.caseNumber || '',
        fileUrl: docData.fileUrl || '',
        fileName: docData.fileName || '',
        fileType: docData.fileType || 'unknown',
        mimeType: docData.mimeType || '',
        fileSize: docData.fileSize || 0,
        visibility: docData.visibility || 'INTERNAL',
        uploadedBy: docData.uploadedBy || 'صاحب المكتب',
        publicId: docData.publicId || '',
        resourceType: docData.resourceType || '',
        format: docData.format || '',
        createdAt: serverTimestamp(),
      });

      return { success: true, id: docRef.id, error: null };
    } catch (error) {
      return { success: false, id: null, error: error.message };
    }
  },

  async getAllDocuments() {
    try {
      return await dbService.getCollection('documents');
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  async getDocumentsByCase(caseId, isClientView = false) {
    try {
      let constraints = [where('caseId', '==', caseId)];
      if (isClientView) {
        constraints.push(where('visibility', '==', 'CLIENT_VISIBLE'));
      }
      const q = query(collection(db, 'documents'), ...constraints);
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      return { data: items, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  },

  async deleteDocument(docId) {
    return await dbService.deleteDocument('documents', docId);
  },
};