import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Shield, Briefcase, User, Phone, Mail, Trash2, X, RefreshCw } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'LAWYER',
    specialization: '',
  });

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsers(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return alert('يرجى ملء الاسم والبريد الإلكتروني');

    try {
      setSaving(true);
      await addDoc(collection(db, 'users'), {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        status: 'ACTIVE',
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', role: 'LAWYER', specialization: '' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة المستخدم');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      await deleteDoc(doc(db, 'users', id));
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const matchSearch = (u.name || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term) || (u.phone || '').includes(term);
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">إدارة فريق العمل والموكلين</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">متابعة حسابات المحامين والموكلين وتعيين الصلاحيات</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة عضو / موكل جديد</span>
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم، البريد، أو رقم الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 gap-1 text-xs">
            <button
              onClick={() => setFilterRole('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterRole === 'ALL' ? 'bg-amber-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterRole('LAWYER')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterRole === 'LAWYER' ? 'bg-amber-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              المحامين
            </button>
            <button
              onClick={() => setFilterRole('CLIENT')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${filterRole === 'CLIENT' ? 'bg-amber-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
            >
              الموكلين
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">جاري تحميل سجل المستخدمين...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">لا يوجد مستخدمون مطابقون لمعايير البحث.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((item) => (
            <div key={item.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-amber-500/50 transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                    {item.role === 'ADMIN' ? <Shield className="w-5 h-5" /> : item.role === 'LAWYER' ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name || 'مستخدم'}</h3>
                    <span className="text-[10px] text-slate-400">{item.specialization || (item.role === 'LAWYER' ? 'محامٍ' : 'موكل')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-500' : item.role === 'LAWYER' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {item.role === 'ADMIN' ? 'إدارة' : item.role === 'LAWYER' ? 'محامٍ' : 'موكل'}
                  </span>
                  {item.role !== 'ADMIN' && (
                    <button onClick={() => handleDelete(item.id)} className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span dir="ltr">{item.phone || 'غير مسجل'}</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span className="truncate">{item.email}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal إضافة مستخدم */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-black">إضافة حساب عضو / موكل جديد</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نوع الحساب *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="LAWYER">محامٍ بالمكتب</option>
                  <option value="CLIENT">موكل جديد</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم بالكامل *</label>
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
                  placeholder="user@example.com"
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

              {formData.role === 'LAWYER' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-500">التخصص القضائي</label>
                  <input
                    type="text"
                    placeholder="مثال: استئناف عالي - قضايا مدنية"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>{saving ? 'جاري الحفظ...' : 'تأكيد إضافة الحساب'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;