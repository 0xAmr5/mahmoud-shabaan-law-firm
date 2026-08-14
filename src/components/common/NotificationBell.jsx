import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export const NotificationBell = ({ notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 transition-all border border-slate-800 shadow-sm"
        title="الإشعارات والتنبيهات"
      >
        <Bell className="w-5 h-5 text-amber-500" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          dir="rtl"
        >
          <div className="p-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
            <span className="font-bold text-white text-xs">الإشعارات والتنبيهات</span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
              {unreadCount} جديدة
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-slate-800/50 transition cursor-pointer text-right"
                >
                  <p className="text-xs text-slate-200 font-medium">{item.text}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{item.time}</span>
                </div>
              ))
            ) : (
              <p className="p-5 text-center text-xs text-slate-500">لا توجد إشعارات جديدة حالياً</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;