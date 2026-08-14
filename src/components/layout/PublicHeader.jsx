import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Phone, LogIn } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';
import { Button } from '../ui';

export const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white block leading-tight">
              {OFFICE_INFO?.name || 'مكتب المحاماة'}
            </span>
            <span className="text-[11px] text-amber-500 font-bold block">
              للمحاماة والاستشارات القانونية
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${OFFICE_INFO?.phone}`}
            dir="ltr"
            className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-amber-400 transition-colors px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>{OFFICE_INFO?.phone}</span>
          </a>

          <Link to="/login">
            <Button variant="primary" className="text-xs font-bold gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md shadow-amber-950/50">
              <LogIn className="w-4 h-4" />
              <span>دخول الموكلين والإدارة</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;