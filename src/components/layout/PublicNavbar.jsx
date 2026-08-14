import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Scale, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';
import { ThemeToggle } from '../common/ThemeToggle';

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'عن المكتب', path: '/about' },
    { name: 'الخدمات القانونية', path: '/services' },
    { name: 'طلب استشارة', path: '/consultation' },
    { name: 'الأسئلة الشائعة', path: '/faq' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* الشعار واسم المكتب */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {OFFICE_INFO?.name}
              </h1>
              <span className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-500 font-bold block">
                للمحاماة والاستشارات القانونية
              </span>
            </div>
          </Link>

          {/* روابط النافبار للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* أزرار الدخول، إنشاء الحساب، والدارك مود */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
            >
              <LogIn className="w-4 h-4 text-amber-500" />
              <span>دخول</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب</span>
            </Link>
          </div>

          {/* زر القائمة للموبايل */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل المنسدلة */}
      {isOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-xs font-bold ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              دخول
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;