import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  UserCheck,
  CheckSquare,
  FileText,
  Clock,
  Settings,
  Scale,
  LogOut,
  X,
  MessageSquare,
} from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';
import { authService } from '../../services/authService';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'الرئيسية والإحصائيات', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'إدارة القضايا', path: '/admin/cases', icon: Briefcase },
    { name: 'جلسات المحاكم', path: '/admin/hearings', icon: Calendar },
    { name: 'فريق السادة المحامين', path: '/admin/lawyers', icon: UserCheck },
    { name: 'سجل الموكلين والعملاء', path: '/admin/clients', icon: Users },
    { name: 'المحادثات والشات', path: '/admin/chat', icon: MessageSquare },
    { name: 'المهام والتكليفات', path: '/admin/tasks', icon: CheckSquare },
    { name: 'الأرشيف والمستندات', path: '/admin/documents', icon: FileText },
    { name: 'سجل الحضور والانصراف', path: '/admin/attendance', icon: Clock },
    { name: 'إعدادات المنظومة', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 z-50 w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 shadow-lg lg:shadow-none ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link to="/" onClick={onClose} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[150px]">{OFFICE_INFO?.name}</h2>
            <span className="text-[10px] text-amber-500 font-bold block">لوحة الإدارة</span>
          </div>
        </Link>

        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-950/20 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => authService.logout()}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;