import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Phone, Menu, X, LogIn, UserPlus, Home, Info, Briefcase, MessageSquare, HelpCircle, PhoneCall } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';
import { Button } from '../ui';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, role } = useAuth();

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'عن المكتب', path: '/about', icon: Info },
    { name: 'الخدمات القانونية', path: '/services', icon: Briefcase },
    { name: 'طلب استشارة', path: '/consultation', icon: MessageSquare },
    { name: 'الأسئلة الشائعة', path: '/faq', icon: HelpCircle },
    { name: 'تواصل معنا', path: '/contact', icon: PhoneCall },
  ];

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'LAWYER') return '/lawyer';
    return '/client-portal';
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-850 text-white" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 group-hover:border-amber-500 transition-all shadow-inner">
              <Scale className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <span className="block text-sm sm:text-base font-black tracking-tight text-white">{OFFICE_INFO.name}</span>
              <span className="block text-[10px] sm:text-[11px] text-amber-500 font-bold">{OFFICE_INFO.subtitle}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive(link.path)
                    ? 'text-amber-400 bg-slate-800 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={`tel:${OFFICE_INFO.phone}`}
              dir="ltr"
              className="hidden xl:flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-amber-400 transition-colors px-3 py-2 rounded-xl bg-slate-900 border border-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>{OFFICE_INFO.phone}</span>
            </a>

            {user ? (
              <Link to={getDashboardPath()}>
                <Button variant="primary" size="sm" className="gap-2 text-xs font-black bg-amber-600 hover:bg-amber-700 px-4 py-2.5 rounded-xl shadow-lg shadow-amber-950">
                  لوحة الحساب
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 rounded-xl px-3.5 py-2">
                    <LogIn className="w-3.5 h-3.5" />
                    دخول
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 rounded-xl px-3.5 py-2 font-bold shadow-md shadow-amber-950">
                    <UserPlus className="w-3.5 h-3.5" />
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button (3 شُرط) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            aria-label="القائمة"
          >
            {isOpen ? <X className="w-6 h-6 text-amber-500" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (القائمة الجانبية للموبايل) */}
      {isOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-800 px-5 pt-4 pb-8 space-y-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive(link.path)
                      ? 'text-amber-400 bg-slate-900 border border-amber-500/20 font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            {user ? (
              <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} className="block w-full">
                <Button variant="primary" className="w-full justify-center text-xs py-3 rounded-xl bg-amber-600 font-black">
                  الدخول للوحة التحكم
                </Button>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center gap-2 text-xs border-slate-800 text-slate-200 bg-slate-900 rounded-xl py-2.5">
                    <LogIn className="w-3.5 h-3.5" />
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center gap-2 text-xs bg-amber-600 rounded-xl py-2.5 font-bold">
                    <UserPlus className="w-3.5 h-3.5" />
                    حساب جديد
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;