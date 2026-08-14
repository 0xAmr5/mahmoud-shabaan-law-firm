import React, { useState, useEffect } from 'react';
import { FileText, Download, UploadCloud, Search, Plus, Trash2, X, RefreshCw } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export const DocumentArchive = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'توكيل رسمي',
    file: null,
  });

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'documents'), (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDocuments(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('يرجى كتابة اسم المستند');

    try {
      setUploading(true);
      let fileUrl = '';

      if (formData.file) {
        const data = new FormData();
        data.append('file', formData.file);
        data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_law_docs');
        
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: data,
        });
        const fileData = await res.json();
        fileUrl = fileData.secure_url || '';
      }

      await addDoc(collection(db, 'documents'), {
        title: formData.title,
        category: formData.category,
        fileUrl: fileUrl,
        createdAt: serverTimestamp(),
      });

      setShowModal(false);
      setFormData({ title: '', category: 'توكيل رسمي', file: null });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع المستند');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستند من الأرشيف؟')) {
      await deleteDoc(doc(db, 'documents', id));
    }
  };

  const filtered = documents.filter((d) => (d.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">الأرشيف والمستندات القضائية</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">حفظ وتخزين صور التوكيلات، العقود، والمذكرات بأمان</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>أرشفة ورفع مستند جديد</span>
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم المستند..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">جاري تحميل الأرشيف...</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">لا توجد وثائق مؤرشفة حالياً. اضغط على الزر بالأعلى لإضافة أول مستند.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-amber-500/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[150px]">{item.title}</h3>
                    <span className="text-[10px] text-amber-500 font-bold">{item.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.fileUrl && (
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal رفع مستند */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-black">أرشفة ورفع مستند جديد</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم المستند أو التوكيل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: توكيل عام قضايا - أحمد محمد"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تصنيف المستند</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="توكيل رسمي">توكيل رسمي</option>
                  <option value="مذكرة دفاع">مذكرة دفاع</option>
                  <option value="حكم قضائي">حكم قضائي</option>
                  <option value="عقد اتفاق">عقد اتفاق</option>
                  <option value="تقرير خبير">تقرير خبير</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اختيار الملف (صورة أو PDF)</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className="w-full text-xs text-slate-500 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-500 file:font-bold hover:file:bg-amber-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                <span>{uploading ? 'جاري الرفع والأرشفة...' : 'حفظ بالأرشيف'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentArchive;