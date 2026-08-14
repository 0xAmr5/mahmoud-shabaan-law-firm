import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, X, RefreshCw } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export const HearingsSchedule = () => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    caseNumber: '',
    clientName: '',
    court: '',
    date: '',
    decision: '',
    status: 'UPCOMING',
  });

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'hearings'), (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setHearings(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const handleAddHearing = async (e) => {
    e.preventDefault();
    if (!formData.caseNumber.trim() || !formData.date) {
      return alert('يرجى كتابة رقم الدعوى وتاريخ الجلسة');
    }

    try {
      setSaving(true);
      await addDoc(collection(db, 'hearings'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setFormData({ caseNumber: '', clientName: '', court: '', date: '', decision: '', status: 'UPCOMING' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء جدولة الجلسة');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الجلسة من الرول؟')) {
      await deleteDoc(doc(db, 'hearings', id));
    }
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">رول وأجندة جلسات المحاكم</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">متابعة مواعيد الجلسات والقرارات الصادرة والطلبات الإجرائية</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>تحديد وجدولة جلسة جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">جاري تحميل رول الجلسات...</div>
      ) : hearings.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <CalendarIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">لا توجد جلسات مجدولة مسجلة حالياً. اضغط على الزر بالأعلى لتسجيل جلسة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hearings.map((item) => (
            <div key={item.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-amber-500/50 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    رقم الدعوى: {item.caseNumber}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{item.clientName || 'جلسة قضائية'}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {item.status === 'COMPLETED' ? 'تمت الجلسة' : 'قادمة'}
                  </span>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>تاريخ الجلسة: <strong className="text-slate-900 dark:text-white">{item.date}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>المحكمة: <strong className="text-slate-900 dark:text-white">{item.court || 'غير محددة'}</strong></span>
                </div>
                {item.decision && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-amber-500 font-medium">
                    القرار / الحكم: {item.decision}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal جدولة جلسة */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-black">تسجيل وجدولة جلسة محكمة</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddHearing} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الدعوى *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 589 لسنة 2026"
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تاريخ الجلسة *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم الموكل</label>
                  <input
                    type="text"
                    placeholder="اسم الموكل"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المحكمة والدائرة</label>
                  <input
                    type="text"
                    placeholder="مثال: محكمة استئناف القاهرة"
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">القرار أو الطلب المتوقع</label>
                <input
                  type="text"
                  placeholder="مثال: تقديم مستندات / المرافعة الختامية"
                  value={formData.decision}
                  onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{saving ? 'جاري الحفظ...' : 'تأكيد وإضافة الجلسة للرول'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HearingsSchedule;