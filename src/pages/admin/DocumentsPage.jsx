import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Briefcase,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { documentService } from '../../services/documentService';
import { caseService } from '../../services/caseService';
import { db } from '../../firebase/config';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

const schema = z.object({
  title: z.string().min(3, 'اسم المستند مطلوب'),
  category: z.string().min(1, 'يرجى اختيار تصنيف المستند'),
  caseId: z.string().optional(),
  visibility: z.enum(['INTERNAL', 'CLIENT_VISIBLE']),
});

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILE_SIZE_MB = 50;

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      visibility: 'INTERNAL',
      category: 'مستندات إثبات',
      caseId: '',
      title: '',
    },
  });

  useEffect(() => {
    let unsubscribeDocs = null;

    const init = async () => {
      try {
        setLoading(true);
        const { data: casesData } = await caseService.getAllCases();
        setCases(casesData || []);

        const docsRef = collection(db, 'documents');
        unsubscribeDocs = onSnapshot(
          docsRef,
          (snapshot) => {
            const items = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            }));

            items.sort((a, b) => {
              const timeA = a.createdAt?.seconds || a.createdAt?.toMillis?.() || 0;
              const timeB = b.createdAt?.seconds || b.createdAt?.toMillis?.() || 0;
              return timeB - timeA;
            });

            setDocuments(items);
            setLoading(false);
          },
          (err) => {
            setActionError('حدث خطأ في صلاحيات قراءة المستندات من Firestore.');
            setLoading(false);
          }
        );
      } catch {
        setActionError('حدث خطأ أثناء تحميل البيانات.');
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribeDocs) unsubscribeDocs();
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError(null);
    setActionError(null);
    setUploadProgress(0);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(`الحد الأقصى للملف الواحد هو ${MAX_FILE_SIZE_MB} ميجابايت.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (data) => {
    if (!selectedFile) {
      setFileError('يرجى اختيار ملف لرفعه.');
      return;
    }

    setActionError(null);
    setSuccessMessage(null);
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('جاري رفع المستند...');

    try {
      const selectedCase = cases.find((c) => c.id === data.caseId);

      const uploadRes = await documentService.uploadFileToCloudinary(
        selectedFile,
        (progress) => {
          if (typeof progress?.percent === 'number') {
            setUploadProgress(progress.percent);
          }
          if (progress?.status === 'uploading') {
            setUploadStatus(`جاري الرفع (${progress.percent}%)...`);
          }
          if (progress?.status === 'processing') {
            setUploadStatus('تم الرفع، جاري الحفظ بالأرشيف...');
          }
        }
      );

      if (!uploadRes || uploadRes.error || !uploadRes.url) {
        throw new Error(uploadRes?.error || 'فشل رفع الملف إلى السيرفر.');
      }

      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || 'unknown';

      const payload = {
        title: data.title.trim(),
        category: data.category,
        caseId: data.caseId || '',
        caseNumber: selectedCase ? selectedCase.caseNumber || '' : '',
        fileUrl: uploadRes.url,
        fileName: selectedFile.name,
        fileType: fileExtension,
        mimeType: selectedFile.type,
        fileSize: selectedFile.size,
        visibility: data.visibility,
        publicId: uploadRes.publicId || '',
        resourceType: uploadRes.resourceType || '',
        format: uploadRes.format || '',
        uploadedBy: 'صاحب المكتب',
      };

      const saveResult = await documentService.saveDocumentMetadata(payload);

      if (!saveResult || saveResult.error) {
        throw new Error(saveResult?.error || 'فشل حفظ بيانات المستند.');
      }

      setUploadProgress(100);
      setSuccessMessage('تم رفع وأرشفة المستند بنجاح ✓');
      reset();
      setSelectedFile(null);
      setFileError(null);

      const fileInput = document.getElementById('document-file-input');
      if (fileInput) fileInput.value = '';

      setShowModal(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (error) {
      setActionError(error?.message || 'حدث خطأ أثناء رفع المستند.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستند من الأرشيف نهائياً؟')) return;
    try {
      setActionError(null);
      await deleteDoc(doc(db, 'documents', docId));
    } catch {
      setActionError('حدث خطأ أثناء حذف المستند.');
    }
  };

  const closeModal = () => {
    if (uploading) return;
    setShowModal(false);
    setActionError(null);
    setFileError(null);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('');
    reset();

    const fileInput = document.getElementById('document-file-input');
    if (fileInput) fileInput.value = '';
  };

  const filteredDocs = documents.filter((doc) => {
    const search = searchTerm.toLowerCase().trim();
    return (
      doc.title?.toLowerCase().includes(search) ||
      doc.caseNumber?.toLowerCase().includes(search) ||
      doc.category?.toLowerCase().includes(search) ||
      doc.fileName?.toLowerCase().includes(search)
    );
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">أرشيف المستندات الإلكتروني</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            رفع وأرشفة عقود القضايا، التوكيلات، والمذكرات القانونية ومشاركتها مع الموكلين.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setActionError(null);
            setFileError(null);
            setSuccessMessage(null);
            setUploadProgress(0);
            setUploadStatus('');
            setShowModal(true);
          }}
          className="gap-2 font-bold"
        >
          <Upload className="w-4 h-4" />
          رفع مستند جديد
        </Button>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-bold shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {actionError && !showModal && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="mr-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم المستند، تصنيفه، أو رقم القضية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">جاري تحميل مستندات الأرشيف...</div>
      ) : filteredDocs.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">لا توجد مستندات مؤرشفة</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">قم برفع المستندات والعقود الخاصة بالقضايا لسهولة الوصول إليها.</p>
          <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
            رفع أول مستند
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((docItem) => (
            <Card key={docItem.id} className="space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600 border border-amber-200/60 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">{docItem.title}</h3>
                      <span className="text-[10px] text-slate-500 font-medium block">{docItem.category}</span>
                    </div>
                  </div>

                  <Badge variant={docItem.visibility === 'CLIENT_VISIBLE' ? 'success' : 'neutral'} className="text-[9px] shrink-0">
                    {docItem.visibility === 'CLIENT_VISIBLE' ? 'مرئي للعميل' : 'داخلي'}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {docItem.caseNumber && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>القضية: <strong className="text-slate-800">{docItem.caseNumber}</strong></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-400 text-[10px] shrink-0">الملف:</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate" dir="ltr">{docItem.fileName}</span>
                  </div>
                  {docItem.fileSize && (
                    <div className="text-[10px] text-slate-400">الحجم: {formatFileSize(docItem.fileSize)}</div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a href={docItem.fileUrl} target="_blank" rel="noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 font-bold">
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    معاينة / تنزيل
                  </Button>
                </a>
                <button
                  onClick={() => handleDelete(docItem.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                  title="حذف المستند"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">رفع مستند جديد للأرشيف</h3>
              <button onClick={closeModal} disabled={uploading} className="text-slate-400 hover:text-slate-600 text-sm disabled:opacity-50">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(handleUpload)} className="space-y-4">
              {actionError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{actionError}</span>
                </div>
              )}

              <Input
                label="اسم المستند *"
                placeholder="مثال: توكيل عام قضايا رقم 14"
                error={errors.title?.message}
                disabled={uploading}
                {...register('title')}
              />

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">تصنيف المستند *</label>
                <select
                  {...register('category')}
                  disabled={uploading}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100"
                >
                  <option value="مستندات إثبات">مستندات إثبات وأوراق رسمية</option>
                  <option value="عقود وصحف دعوى">عقود وصحف دعوى</option>
                  <option value="أحكام ومذكرات">أحكام قضائية ومذكرات دفاع</option>
                  <option value="توكيلات">توكيلات رسمية</option>
                  <option value="تقرير خبراء">تقارير الخبراء واللجان</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">ربط بقضية (اختياري)</label>
                <select
                  {...register('caseId')}
                  disabled={uploading}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100"
                >
                  <option value="">عام (غير مرتبط بقضية محددة)</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">إمكانية رؤية العميل للملف *</label>
                <select
                  {...register('visibility')}
                  disabled={uploading}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100"
                >
                  <option value="INTERNAL">داخلي فقط (للمكتب والمحامين)</option>
                  <option value="CLIENT_VISIBLE">مرئي للعميل (يظهر في بوابة العميل)</option>
                </select>
              </div>

              <div className="text-right">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">اختر الملف *</label>
                <input
                  id="document-file-input"
                  type="file"
                  onChange={handleFileChange}
                  disabled={uploading}
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.mp4"
                  className="w-full text-xs text-slate-500 file:mr-0 file:ml-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer disabled:opacity-50"
                />
                <p className="mt-1.5 text-[10px] text-slate-400">
                  PDF، فيديو، صور، Word — الحد الأقصى للملف: <strong>50MB</strong>
                </p>

                {fileError && <p className="mt-1 text-xs text-rose-600">{fileError}</p>}

                {selectedFile && !fileError && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs text-emerald-700 truncate">{selectedFile.name}</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-1">{formatFileSize(selectedFile.size)}</div>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 truncate">{uploadStatus}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{uploadProgress}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Button type="submit" variant="primary" isLoading={uploading} disabled={uploading} className="w-full text-xs font-bold gap-2">
                  {!uploading && <Upload className="w-3.5 h-3.5 text-white" />}
                  {uploading ? `جاري الرفع ${uploadProgress}%` : 'تأكيد الرفع للأرشيف'}
                </Button>
                <Button type="button" variant="outline" onClick={closeModal} disabled={uploading} className="w-full text-xs">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;