import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  CheckSquare, 
  Clock, 
  MessageSquare, 
  Send, 
  Scale, 
  LogOut, 
  User, 
  Phone, 
  CheckCircle2, 
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { NotificationBell } from '../../components/common/NotificationBell';
import { db } from '../../firebase/config';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  orderBy, 
  updateDoc, 
  doc, 
  query 
} from 'firebase/firestore';

export const LawyerDashboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [checkedIn, setCheckedIn] = useState(false);
  const messagesEndRef = useRef(null);

  const lawyerName = userProfile?.name || user?.displayName || 'المحامي';

  // 1. جلب التكليفات المسندة للمحامي
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const allTasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const myTasks = allTasks.filter(
        (t) => t.assignedToId === user.uid || (userProfile?.name && t.assignedToName === userProfile.name)
      );
      setTasks(myTasks);
    });
    return () => unsub();
  }, [user, userProfile]);

  // 2. جلب الشات المباشر مع إدارة المكتب
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubMsgs = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const myChat = all.filter((m) => m.senderId === user.uid || m.receiverId === user.uid);
      setMessages(myChat);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubMsgs();
  }, [user]);

  // 3. إرسال رسالة
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !user) return;

    const text = inputMsg.trim();
    setInputMsg('');

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderId: user.uid,
        senderName: lawyerName,
        receiverId: 'ADMIN',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 4. تغيير حالة المهمة
  const handleToggleTask = async (task) => {
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await updateDoc(doc(db, 'tasks', task.id), { status: nextStatus });
  };

  // 5. إثبات الحضور اليومي
  const handleCheckIn = async () => {
    if (checkedIn) return;
    try {
      await addDoc(collection(db, 'attendance'), {
        userId: user.uid,
        userName: lawyerName,
        checkInTime: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
      setCheckedIn(true);
      alert('تم إثبات حضورك اليوم بنجاح في سجلات المنظومة!');
    } catch (err) {
      console.error(err);
    }
  };

  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300" dir="rtl">
      
      {/* 1. Header (نفس استايل بوابة الموكل) */}
      <header className="h-16 sm:h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">مكتب الأستاذ / محمود شعبان داخلي</h1>
            <span className="text-[10px] text-amber-500 font-bold block">بوابة السادة المحامين الإلكترونية</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <NotificationBell notifications={[{ id: 'lawyer-1', text: `مرحباً بك أستاذ ${lawyerName}`, time: 'الآن', read: false }]} />

          <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-3 border-r border-slate-200 dark:border-slate-800">
            <div className="text-left hidden md:block">
              <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">{lawyerName}</span>
              <span className="text-[10px] text-amber-500 font-bold block">محامٍ معتمد بالمنظومة</span>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black shadow-inner">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <button
              onClick={() => authService.logout()}
              className="p-2 rounded-xl text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* 2. Hero Banner الملكي */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                أهلاً بك، أستاذ {lawyerName}
              </span>
              <h2 className="text-xl sm:text-3xl font-black leading-tight">
                متابعة وإنجاز التكليفات القضائية والمهام الميدانية
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                يمكنك متابعة جدول أعمالك اليومي، تحديث حالات تنفيذ القرارات القضائية، والتواصل اللحظي مع إدارة المكتب.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleCheckIn}
                disabled={checkedIn}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                  checkedIn
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{checkedIn ? 'تم إثبات الحضور ✓' : 'إثبات الحضور اليومي'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. كروت الإحصائيات الفخمة */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">إجمالي التكليفات</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{tasks.length}</h3>
              <span className="text-[10px] text-amber-500 font-bold block">مهمة مسندة</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">قيد التنفيذ</span>
              <h3 className="text-2xl font-black text-amber-500">{pendingTasksCount}</h3>
              <span className="text-[10px] text-slate-400 font-bold block">مهمة جارية</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">المهام المنجزة</span>
              <h3 className="text-2xl font-black text-emerald-500">{completedTasksCount}</h3>
              <span className="text-[10px] text-emerald-500 font-bold block">تم إتمامها ✓</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 4. تبويبات التحكم */}
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-2 text-xs shadow-xs">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tasks' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>التكليفات والمهام المسندة ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>الشات المباشر مع إدارة المكتب</span>
          </button>
        </div>

        {/* 5. محتوى المهام */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
                <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">أهلاً بك أستاذ {lawyerName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">لا توجد تكليفات أو مهام موجهة لك حالياً من إدارة المنظومة.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs hover:border-amber-500/50 transition-all space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">{task.title}</h3>
                      <button
                        onClick={() => handleToggleTask(task)}
                        className={`text-[10px] px-3 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                          task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}
                      >
                        {task.status === 'COMPLETED' ? '✓ تم الإنجاز' : 'قيد التنفيذ'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{task.description || 'لا يوجد وصف إضافي.'}</p>

                    {task.dueDate && (
                      <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>موعد التسليم: {task.dueDate}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. محتوى الشات */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl h-[600px] flex flex-col shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">إدارة المكتب الرئيسي</h3>
                <span className="text-[10px] text-emerald-500 font-bold">● متصل الآن</span>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">لا توجد رسائل سابقة. ابدأ المحادثة المباشرة مع الإدارة الآن!</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.senderId === user.uid;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                      <div
                        className={`max-w-[75%] p-4 rounded-3xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-amber-600 text-white rounded-tr-xs shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        <p>{m.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
              <input
                type="text"
                placeholder="اكتب رسالتك أو استفسارك لإدارة المكتب..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>إرسال</span>
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default LawyerDashboard;