import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Clock, MessageSquare } from 'lucide-react';
import { Button, Badge } from '../ui';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';

export const ChatBox = ({ recipientUser, caseNumber }) => {
  const { user, userProfile, role } = useAuth();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      if (!user?.uid || !recipientUser?.uid) return;
      setLoading(true);

      const { chatId: cId } = await chatService.getOrCreateChatRoom({
        user1: { uid: user.uid, name: userProfile?.name || 'مستخدم', role },
        user2: { uid: recipientUser.uid, name: recipientUser.name || 'الطرف الآخر', role: recipientUser.role },
      });

      setChatId(cId);
      setLoading(false);
    };

    initChat();
  }, [user?.uid, recipientUser?.uid]);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = chatService.listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !chatId) return;

    const text = inputText;
    setInputText('');

    await chatService.sendMessage({
      chatId,
      senderId: user.uid,
      senderName: userProfile?.name || 'أنا',
      senderRole: role,
      text,
    });
  };

  if (!recipientUser) {
    return (
      <div className="h-96 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400">
        اختر طرف المحادثة لبدء المراسلة المباشرة.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[520px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" dir="rtl">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-600/20 border border-amber-600/40 text-amber-500 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{recipientUser.name}</h4>
            <span className="text-[10px] text-slate-400 block">
              {recipientUser.role === 'ADMIN' ? 'صاحب المكتب' : recipientUser.role === 'LAWYER' ? 'محامي مسند' : 'موكل'}
              {caseNumber && ` | قضية: ${caseNumber}`}
            </span>
          </div>
        </div>
        <Badge variant="success" className="text-[9px]">مباشر</Badge>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">جاري تحميل المحادثة...</div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400">لا توجد رسائل سابقة. ابدأ المحادثة الآن.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === user.uid;
            const time = m.createdAt?.seconds
              ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-amber-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{time}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-600 transition-colors"
        />
        <Button type="submit" variant="primary" size="sm" className="px-4 py-2.5 rounded-xl gap-1 text-xs">
          <Send className="w-3.5 h-3.5" />
          إرسال
        </Button>
      </form>
    </div>
  );
};