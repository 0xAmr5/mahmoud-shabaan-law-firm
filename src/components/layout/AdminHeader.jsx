import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../common/NotificationBell';
import { ThemeToggle } from '../common/ThemeToggle';
import { db } from '../../firebase/config';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';

export const AdminHeader = ({ onToggleSidebar }) => {
  const { user, userProfile } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 'default-1', text: 'مرحباً بك في لوحة تحكم المنظومة', time: 'الآن', read: false },
  ]);

  const userName = userProfile?.name || user?.displayName || 'المسؤول';
  const userRole = (userProfile?.role || 'ADMIN') === 'ADMIN' ? 'الإدارة العليا' : 'عضو الإدارة';

  useEffect(() => {
    let unsubs = [];
    try {
      const consultQuery = query(collection(db, 'consultations'), limit(5));
      const unConsult = onSnapshot(consultQuery, (snap) => {
        const consultNotifs = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: `consult_${d.id}`,
            text: `استشارة: ${data.name || 'عميل'} (${data.subject || data.type || 'عام'})`,
            time: data.createdAt?.seconds 
              ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) 
              : 'مؤخراً',
            read: data.status === 'COMPLETED',
          };
        });

        if (consultNotifs.length > 0) setNotifications(consultNotifs);
      });
      unsubs.push(unConsult);
    } catch (err) {
      console.error(err);
    }

    return () => unsubs.forEach((un) => un && un());
  }, []);

  return (
    <header className="h-16 sm:h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-300" dir="rtl">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-500 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold truncate">
          <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="truncate hidden sm:inline">لوحة الإدارة والمتابعة</span>
          <span className="sm:hidden text-[11px]">الإدارة</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <ThemeToggle />
        <NotificationBell notifications={notifications} />

        <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-3 border-r border-slate-200 dark:border-slate-800">
          <div className="text-left hidden md:block">
            <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight truncate max-w-[140px]">{userName}</span>
            <span className="text-[10px] text-amber-500 font-bold block">{userRole}</span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black shadow-inner">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;