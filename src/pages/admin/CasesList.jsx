import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Trash2, X, RefreshCw } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export const CasesList = () => {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    caseNumber: '',
    clientName: '',
    court: '',
    circuit: '',
    type: 'مدني',
    status: 'ACTIVE',
  });

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCases(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const handleAddCase = async (e) => {
    e.preventDefault();
    if (!formData.caseNumber.trim() || !formData.clientName.trim()) {
      return alert('يرجى ملء الحقول الإجبارية');
    }

    try {
      setSaving(true);
      await addDoc(collection(db, 'cases'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setFormData({ caseNumber: '', clientName: '', court: '', circuit: '', type: 'مدني', status: 'ACTIVE' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ القضية');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الملف القضائي؟')) {
      await deleteDoc(doc(db, 'cases', id));
    }
  };

  const filteredCases = cases.filter((c) => {
    const term = search.toLowerCase();
    return (
      (c.caseNumber || '').toLowerCase().includes(term) ||
      (c.clientName || '').toLowerCase().includes(term) ||
      (c.court || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">إدارة ملفات القضايا والدعاوى</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">متابعة كافة القضايا المتداولة والأرشيف القضائي</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة ملف قضية جديدة</span>
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث برقم القضية، اسم الموكل، أو المحكمة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">جاري تحميل سجل القضايا...</div>
      ) : filteredCases.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Briefcase className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">لا توجد قضايا مسجلة حالياً. اضغط على الزر بالأعلى لإضافة قضية.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((item) => (
            <div key={item.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-amber-500/50 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    رقم: {item.caseNumber}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{item.clientName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status === 'CLOSED' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {item.status === 'CLOSED' ? 'منتهية' : 'متداولة'}
                  </span>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p><strong className="text-slate-800 dark:text-slate-200">المحكمة:</strong> {item.court || 'غير محددة'}</p>
                <p><strong className="text-slate-800 dark:text-slate-200">الدائرة:</strong> {item.circuit || 'الدائرة العامة'}</p>
                <p><strong className="text-slate-800 dark:text-slate-200">النوع:</strong> {item.type}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal إضافة قضية */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-black">إضافة ملف دعوى جديد</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddCase} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الدعوى والسنة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 1254 لسنة 2026"
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم الموكل *</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الموكل بالكامل"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المحكمة</label>
                  <input
                    type="text"
                    placeholder="مثال: محكمة شمال القاهرة"
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الدائرة</label>
                  <input
                    type="text"
                    placeholder="مثال: 5 مدني كلي"
                    value={formData.circuit}
                    onChange={(e) => setFormData({ ...formData, circuit: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوع الدعوى</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="مدني">مدني</option>
                  <option value="جنائي">جنائي</option>
                  <option value="أسرة / أحوال شخصية">أسرة / أحوال شخصية</option>
                  <option value="مجلس دولة">مجلس دولة</option>
                  <option value="تجاري وعمالي">تجاري وعمالي</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{saving ? 'جاري الحفظ...' : 'حفظ القضية في المنظومة'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesList;