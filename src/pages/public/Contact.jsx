import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';

export const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12" dir="rtl">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">تواصل معنا ومقر المكتب</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          يسعدنا استقبالكم في مقر المكتب أو الرد على استفساراتكم الهاتفية على مدار أيام العمل.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">الاتصال الهاتفي</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400" dir="ltr">{OFFICE_INFO?.phone}</p>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">البريد الإلكتروني</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Mshabaan162@gmail.com</p>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">المقر الرئيسي</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">{OFFICE_INFO?.address}</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;