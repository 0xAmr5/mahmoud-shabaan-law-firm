import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Send, 
  Scale, 
  LogOut, 
  User, 
  Phone, 
  Clock, 
  Download,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { NotificationBell } from '../../components/common/NotificationBell';
import { db } from '../../firebase/config';
import { collection, onSnapshot, query, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

export const ClientPortal = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('cases');
  const [cases, setCases] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef(null);

  const clientName = userProfile?.name || user?.displayName || 'الموكل';

  useEffect(() => {
    if (!user) return;

    // القضايا
    const unsubCases = onSnapshot(collection(db, 'cases'), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const myCases = all.filter((c) => (userProfile?.name && c.clientName?.includes(userProfile.name)) || c.clientId === user.uid);
      setCases(myCases);
    });

    // الجلسات
    const unsubHearings = onSnapshot(collection(db, 'hearings'), (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const myHearings = all.filter((h) => (userProfile?.name && h.clientName?.includes(userProfile.name)) || h.clientId === user.uid);
      setHearings(myHearings);
    });

    // المستندات
    const unsubDocs = onSnapshot(collection(db, 'documents'), (snap) => {
      setDocuments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // الشات
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubMsgs = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const myChat = all.filter((m) => m.senderId === user.uid || m.receiverId === user.uid);
      setMessages(myChat);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => {
      unsubCases();
      unsubHearings();
      unsubDocs();
      unsubMsgs();
    };
  }, [user, userProfile]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !user) return;

    const text = inputMsg.trim();
    setInputMsg('');

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderId: user.uid,
        senderName: clientName,
        receiverId: 'ADMIN',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300" dir="rtl">
      
      {/* Header */}
      <header className="h-16 sm:h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">مكتب الأستاذ / محمود شعبان داخلي</h1>
            <span className="text-[10px] text-amber-500 font-bold block">بوابة الموكل الإلكترونية</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <NotificationBell notifications={[{ id: 'client-1', text: `مرحباً بك أستاذ ${clientName}`, time: 'الآن', read: false }]} />

          <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-3 border-r border-slate-200 dark:border-slate-800">
            <div className="text-left hidden md:block">
              <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">{clientName}</span>
              <span className="text-[10px] text-amber-500 font-bold block">حساب موكل مسجل</span>
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold">
                أهلاً بك، أستاذ {clientName}
              </span>
              <h2 className="text-xl sm:text-3xl font-black leading-tight">
                متابعة مباشرة ومحكمة لمراحل الدعاوى ومواعيد الجلسات
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                يمكنك الاطلاع على الجدول الزمني لتطورات قضيتك، توجيهات المحامي المسؤول، وتحميل صور ومستندات الدعوى مباشرة.
              </p>
            </div>

            <a
              href="https://wa.me/201064684164"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-950/30 flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>تواصل مع الإدارة (واتساب)</span>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">ملفات الدعاوى</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{cases.length}</h3>
              <span className="text-[10px] text-amber-500 font-bold block">قضاياي المسجلة</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">الرول القضائي</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{hearings.length}</h3>
              <span className="text-[10px] text-amber-500 font-bold block">الجلسات القادمة</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400">أرشيف متاح</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{documents.length}</h3>
              <span className="text-[10px] text-amber-500 font-bold block">المستندات والأوراق</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 gap-2 text-xs shadow-xs">
          <button
            onClick={() => setActiveTab('cases')}
            className={`flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cases' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>ملفات القضايا ({cases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hearings')}
            className={`flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hearings' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>مواعيد الجلسات ({hearings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'chat' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>محادثة المحامي</span>
          </button>
        </div>

        {/* Tab Cases */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            {cases.length === 0 ? (
              <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
                <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">أهلاً بك أستاذ {clientName}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">لم يتم ربط أي قضايا بحسابك حالياً. يرجى التواصل مع إدارة المكتب للإدراج وتحديث الملفات.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.map((item) => (
                  <div key={item.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        رقم: {item.caseNumber}
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-amber-500/10 text-amber-500">
                        {item.status === 'CLOSED' ? 'منتهية' : 'متداولة بالجلسات'}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <p><strong className="text-slate-900 dark:text-white">المحكمة:</strong> {item.court || 'غير محددة'}</p>
                      <p><strong className="text-slate-900 dark:text-white">الدائرة:</strong> {item.circuit || 'الدائرة العامة'}</p>
                      <p><strong className="text-slate-900 dark:text-white">النوع:</strong> {item.type || 'مدني'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Hearings */}
        {activeTab === 'hearings' && (
          <div className="space-y-4">
            {hearings.length === 0 ? (
              <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
                <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">لا توجد جلسات قادمة مسجلة لدعواك حالياً.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hearings.map((item) => (
                  <div key={item.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                        دعوى: {item.caseNumber}
                      </span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-amber-500/10 text-amber-500">
                        {item.status === 'COMPLETED' ? 'تمت' : 'جلسة قادمة'}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>تاريخ الجلسة: <strong className="text-slate-900 dark:text-white">{item.date}</strong></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-amber-500" />
                        <span>المحكمة: {item.court || 'غير محدد'}</span>
                      </p>
                      {item.decision && (
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 text-[11px] text-amber-500 font-medium border border-slate-200 dark:border-slate-800">
                          القرار: {item.decision}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Chat */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl h-[600px] flex flex-col shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">المستشار القانوني المسؤول</h3>
                <span className="text-[10px] text-emerald-500 font-bold">● متصل الآن</span>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs">لا توجد رسائل سابقة. ابدأ المحادثة المباشرة مع المستشار القانوني الآن!</p>
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
                placeholder="اكتب استفسارك للمحامي..."
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

export default ClientPortal;