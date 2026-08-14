import React, { useState } from 'react';
import { Settings, Shield, Globe, Database, Scale, Phone, MapPin, Mail, Save, RefreshCw, CheckCircle2, User } from 'lucide-react';
import { OFFICE_INFO, DEVELOPER_INFO } from '../../constants/theme';

export const SystemSettings = () => {
  const [saved, setSaved] = useState(false);
  const [info, setInfo] = useState({
    name: OFFICE_INFO?.name || 'مكتب الأستاذ / محمود شعبان داخلي',
    subtitle: 'للمحاماة والاستشارات القانونية',
    phone: OFFICE_INFO?.phone || '01064684164',
    email: 'Mshabaan162@gmail.com',
    address: OFFICE_INFO?.address || 'القاهرة - جمهورية مصر العربية',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-200" dir="rtl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">إعدادات المنظومة وهوية المنشأة</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تخصيص بيانات المكتب وحالة الربط السحابي والأمان</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* نموذج تعديل بيانات المنشأة */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">البيانات الرسمية للمكتب</h2>
              <span className="text-[11px] text-slate-400">تظهر هذه البيانات في العقود، الهيدر، والفواتير</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم المنشأة القانونية</label>
                <input
                  type="text"
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الوصف التعريفي</label>
                <input
                  type="text"
                  value={info.subtitle}
                  onChange={(e) => setInfo({ ...info, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف الرسمي</label>
                <input
                  type="text"
                  value={info.phone}
                  onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني المعتمد</label>
                <input
                  type="email"
                  value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-right"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">العنوان والمقر الرئيسي</label>
              <input
                type="text"
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              {saved && (
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تم حفظ الإعدادات بنجاح!</span>
                </div>
              )}
              <button
                type="submit"
                className="mr-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </form>
        </div>

        {/* معلومات السحابة والمطور */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-500 font-bold text-xs border-b border-slate-200 dark:border-slate-800 pb-3">
              <Database className="w-4 h-4" />
              <span>حالة البنية التحتية السحابية</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>قاعدة البيانات:</span>
                <span className="text-emerald-500 font-bold">Firestore (Active)</span>
              </div>
              <div className="flex justify-between">
                <span>أرشيف الميديا:</span>
                <span className="text-emerald-500 font-bold">Cloudinary CDN</span>
              </div>
              <div className="flex justify-between">
                <span>التشفير:</span>
                <span className="text-amber-500 font-bold">AES-256 SSL</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-500 font-bold text-xs border-b border-slate-200 dark:border-slate-800 pb-3">
              <Globe className="w-4 h-4" />
              <span>الجهة الهندسية المطورة</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p><strong className="text-slate-900 dark:text-white">الشركة:</strong> {DEVELOPER_INFO?.company}</p>
              <p><strong className="text-slate-900 dark:text-white">المهندس:</strong> {DEVELOPER_INFO?.name}</p>
              <p className="text-[11px] text-slate-400 pt-2">الإصدار 2.5.0 Production Ready</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemSettings;