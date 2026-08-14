import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Phone, MapPin, Mail, Globe, ShieldCheck } from 'lucide-react';
import { OFFICE_INFO, DEVELOPER_INFO } from '../../constants/theme';

export const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">{OFFICE_INFO?.name}</h3>
                <span className="text-xs text-amber-500 font-bold block">للمحاماة والاستشارات القانونية</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              صرح قانوني رائد في الترافع القضائي وصياغة العقود وتأسيس الشركات وتمثيل الموكلين أمام كافة الهيئات والمحاكم.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">عن المكتب</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">الخدمات القانونية</Link></li>
              <li><Link to="/consultation" className="hover:text-amber-400 transition-colors">طلب استشارة فورية</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-white">بيانات الاتصال</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span dir="ltr">{OFFICE_INFO?.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Mshabaan162@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{OFFICE_INFO?.address}</span>
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {OFFICE_INFO?.name}. جميع الحقوق محفوظة.</p>
          <p>تم التطوير بواسطة <strong>{DEVELOPER_INFO?.name} ({DEVELOPER_INFO?.company})</strong></p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;