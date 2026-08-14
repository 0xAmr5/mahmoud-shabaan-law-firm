import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, X, RefreshCw, Clock, UserCheck } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc, query, where } from 'firebase/firestore';

export const TaskDelegation = () => {
  const [tasks, setTasks] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToId: '',
    assignedToName: '',
    priority: 'متوسطة',
    dueDate: '',
    status: 'PENDING',
  });

  useEffect(() => {
    // جلب التكليفات
    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data);
      setLoading(false);
    });

    // جلب المحامين
    const qLawyers = query(collection(db, 'users'), where('role', '==', 'LAWYER'));
    const unsubLawyers = onSnapshot(qLawyers, (snapshot) => {
      const lawyerList = snapshot.docs.map((d) => ({ id: d.id, uid: d.id, ...d.data() }));
      setLawyers(lawyerList);
      if (lawyerList.length > 0 && !formData.assignedToId) {
        setFormData((prev) => ({
          ...prev,
          assignedToId: lawyerList[0].id,
          assignedToName: lawyerList[0].name,
        }));
      }
    });

    return () => {
      unsubTasks();
      unsubLawyers();
    };
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.assignedToId) {
      return alert('يرجى كتابة عنوان التكليف واختيار المحامي المكلف');
    }

    try {
      setSaving(true);
      await addDoc(collection(db, 'tasks'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        assignedToId: lawyers[0]?.id || '',
        assignedToName: lawyers[0]?.name || '',
        priority: 'متوسطة',
        dueDate: '',
        status: 'PENDING',
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ التكليف');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await updateDoc(doc(db, 'tasks', task.id), { status: nextStatus });
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      await deleteDoc(doc(db, 'tasks', id));
    }
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">إدارة المهام والتكليفات القضائية</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">توزيع ومتابعة إنجاز الأعمال القانونية والميدانية</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-950/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إسناد تكليف جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">جاري تحميل المهام...</div>
      ) : tasks.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <CheckSquare className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">لا توجد تكليفات مسجلة حالياً. اضغط على الزر بالأعلى لإسناد مهمة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-amber-500/50 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">{task.title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                      task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {task.status === 'COMPLETED' ? '✓ مكتملة' : 'قيد التنفيذ'}
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{task.description || 'لا توجد تفاصيل إضافية للمهمة.'}</p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{task.assignedToName || 'محامٍ بالمكتب'}</span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal إضافة تكليف */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-black">إسناد وتكليف مهمة جديدة</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">عنوان المهمة أو الإجراء القضائي *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: استخراج صورة رسمية من محضر الجلسة"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">تفاصيل وتوجيهات المهمة</label>
                <textarea
                  rows="3"
                  placeholder="اكتب تفاصيل التكليف هنا..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المحامي المسؤول *</label>
                  <select
                    value={formData.assignedToId}
                    onChange={(e) => {
                      const selected = lawyers.find((l) => l.id === e.target.value);
                      setFormData({
                        ...formData,
                        assignedToId: e.target.value,
                        assignedToName: selected?.name || '',
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- اختر المحامي المكلف --</option>
                    {lawyers.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.specialization || 'محامٍ'})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">موعد التسليم المتوقع</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{saving ? 'جاري الحفظ...' : 'تأكيد إسناد التكليف'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDelegation;