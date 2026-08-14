import React from 'react';
import { MapPin, Phone, MessageSquare, ExternalLink, Mail, Clock } from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';
import { Badge } from '../../components/ui';

export const Contact = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12 bg-slate-950 text-slate-100" dir="rtl">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <Badge variant="warning" className="text-[11px] px-3 py-1 font-bold">قنوات الاتصال</Badge>
        <h1 className="text-3xl sm:text-4xl font-black text-white">تواصل مع المكتب</h1>
        <p className="text-xs sm:text-sm text-slate-400">يسعدنا استقبال استفساراتكم وتحديد مواعيد المقابلات بالمقر الرئيسي</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
          <h2 className="text-base font-black text-amber-500 border-r-4 border-amber-500 pr-3">بيانات الاتصال المباشر</h2>
          <div className="space-y-5 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-white text-sm">مقر المكتب:</span>
                <span className="text-slate-400">{OFFICE_INFO.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="font-bold block text-white text-sm">الهاتف المباشر:</span>
                <a href={`tel:${OFFICE_INFO.phone}`} dir="ltr" className="text-amber-400 hover:underline">{OFFICE_INFO.phone}</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block text-white text-sm">واتساب الإدارة:</span>
                <a href={`https://wa.me/2${OFFICE_INFO.whatsapp}`} target="_blank" rel="noreferrer" dir="ltr" className="text-emerald-400 hover:underline">{OFFICE_INFO.whatsapp}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <h2 className="text-base font-black text-amber-500 border-r-4 border-amber-500 pr-3">الموقع والخرائط</h2>
          <div className="space-y-4">
            <a
              href={OFFICE_INFO.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 hover:border-amber-500 bg-slate-950 transition-colors"
            >
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>فتح موقع المقر على Google Maps</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>

            <a
              href={OFFICE_INFO.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 hover:border-blue-500 bg-slate-950 transition-colors"
            >
              <div className="flex items-center gap-3 text-xs font-bold text-white">
                <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>صفحة فيسبوك الرسمية</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;