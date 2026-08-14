import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../common/NotificationBell';

export const AdminHeader = () => {
  const { userProfile } = useAuth();

  const notifications = [
    { id: 1, text: 'تم تسجيل موكل جديد في المنظومة', time: 'منذ 10 دقائق', read: false },
    { id: 2, text: 'موعد جلسة غداً في محكمة ديروط', time: 'منذ ساعة', read: false },
  ];

  return (
    <header className="h-16 bg-slate-950 text-white border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md" dir="rtl">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>لوحة الإدارة والمتابعة</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell notifications={notifications} />

        <div className="flex items-center gap-3 pr-2 border-r border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-black text-white leading-tight">
              {userProfile?.name || 'مدير المنظومة'}
            </div>
            <div className="text-[10px] text-amber-500 font-bold">
              {userProfile?.role === 'ADMIN' ? 'صاحب المكتب (Admin)' : 'عضو الإدارة'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;