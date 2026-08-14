import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Users, Briefcase, User, Search, Send } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export const AdminChat = () => {
  const { user, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterRole, setFilterRole] = useState('ALL');
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const messagesEndRef = useRef(null);

  // 1. جلب كل المستخدمين واستثناء الأدمن الحالي
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, uid: d.id, ...d.data() }))
        .filter((u) => u.id !== user?.uid && u.uid !== user?.uid && u.role !== 'ADMIN');
      
      setUsers(data);
      if (data.length > 0 && !selectedUser) {
        setSelectedUser(data[0]);
      }
      setLoadingUsers(false);
    });
    return () => unsub();
  }, [user]);

  // 2. جلب وتصفية الرسائل الخاصة بالمحادثة
  useEffect(() => {
    if (!selectedUser || !user) return;
    const targetId = selectedUser.uid || selectedUser.id;
    const myId = user.uid;

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubMessages = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      const filtered = allMsgs.filter(
        (m) =>
          (m.senderId === myId && (m.receiverId === targetId || m.receiverId === selectedUser.id)) ||
          ((m.senderId === targetId || m.senderId === selectedUser.id) && (m.receiverId === myId || m.receiverId === 'ADMIN'))
      );
      setMessages(filtered);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubMessages();
  }, [selectedUser, user]);

  // 3. إرسال الرسالة
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !selectedUser || !user) return;

    const text = inputMsg.trim();
    setInputMsg('');
    const targetId = selectedUser.uid || selectedUser.id;

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderId: user.uid,
        senderName: userProfile?.name || 'إدارة المكتب',
        receiverId: targetId,
        receiverName: selectedUser.name || 'مستخدم',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === 'ALL' || u.role === filterRole;
    const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">مركز المحادثات والتواصل الفوري</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تواصل مباشر ولحظي مع المحامين المساعدين والموكلين</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
        {/* قائمة جهات الاتصال */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col space-y-3 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 gap-1 text-[11px]">
            <button
              onClick={() => setFilterRole('ALL')}
              className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterRole === 'ALL' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setFilterRole('LAWYER')}
              className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterRole === 'LAWYER' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              المحامين
            </button>
            <button
              onClick={() => setFilterRole('CLIENT')}
              className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterRole === 'CLIENT' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
            >
              الموكلين
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {loadingUsers ? (
              <p className="text-xs text-slate-400 text-center py-6">جاري التحميل...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">لا توجد جهات اتصال مسجلة.</p>
            ) : (
              filteredUsers.map((u) => {
                const uId = u.uid || u.id;
                const isSelected = (selectedUser?.uid || selectedUser?.id) === uId;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full p-3 rounded-2xl text-right transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-slate-900 dark:text-white'
                        : 'bg-slate-50/50 dark:bg-slate-950/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.role === 'LAWYER' ? <Briefcase className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">{u.role === 'LAWYER' ? 'محامٍ بالمكتب' : 'موكل'}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* صندوق المحادثة المباشر */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col shadow-sm overflow-hidden">
          {selectedUser ? (
            <>
              {/* هيدر الشات */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    {selectedUser.role === 'LAWYER' ? <Briefcase className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">{selectedUser.name}</h3>
                    <span className="text-[10px] text-emerald-500 font-bold">● متصل الآن</span>
                  </div>
                </div>
                <div className="text-[10px] px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {selectedUser.role === 'LAWYER' ? 'محامٍ بالمكتب' : 'موكل'}
                </div>
              </div>

              {/* الرسائل */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30 dark:bg-slate-950/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs">لا توجد رسائل سابقة. ابدأ المحادثة الآن!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === user.uid;
                    return (
                      <div key={m.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                        <div
                          className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
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

              {/* كتابة وإرسال */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
                <input
                  type="text"
                  placeholder="اكتب رسالتك هنا..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال</span>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              اختر جهة اتصال لبدء المحادثة الفورية.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;