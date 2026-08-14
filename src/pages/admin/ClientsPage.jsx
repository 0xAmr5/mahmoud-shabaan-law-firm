import React, { useState, useEffect } from 'react';
import { User, UserPlus, Search, Phone, Mail, Trash2, X, RefreshCw, FileText } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, where } from 'firebase/firestore';

export const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    address: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'CLIENT'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setClients(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return alert('يرجى ملء الاسم والبريد');

    try {
      setSaving(true);
      await addDoc(collection(db, 'users'), {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        role: 'CLIENT',
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', nationalId: '', address: '' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة الموكل');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموكل؟')) {
      await deleteDoc(doc(db, 'users', id));
    }
  };

  const filtered = clients.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  );

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">سجل الموكلين والعملاء</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">متابعة بيانات الموكلين وأرقام التواصل وقضاياهم المتداولة</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة موكل جديد</span>
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث باسم الموكل أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">جاري تحميل سجل الموكلين...</div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <User className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">لا يوجد موكلون مسجلون حالياً. اضغط على الزر بالأعلى لإضافة موكل.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs hover:border-amber-500/50 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-black">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
                    <span className="text-[11px] text-slate-400 font-bold block">موكل مسجل</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span dir="ltr">{item.phone || 'غير مسجل'}</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span className="truncate">{item.email}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal إضافة موكل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-black">إضافة موكل جديد</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم الموكل بالكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمد علي"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف</label>
                <input
                  type="tel"
                  placeholder="010xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>{saving ? 'جاري الإضافة...' : 'تأكيد إضافة الموكل'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;