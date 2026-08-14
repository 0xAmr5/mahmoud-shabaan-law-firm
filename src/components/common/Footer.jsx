import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  MapPin,
  Phone,
  MessageSquare,
  ExternalLink,
  Code2,
  Globe,
  Sparkles,
} from 'lucide-react';
import { OFFICE_INFO, DEVELOPER_INFO } from '../../constants/theme';
import { Button } from '../ui';

export const Footer = () => {
  const [showDevModal, setShowDevModal] = useState(false);

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Scale className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-black text-white">{OFFICE_INFO.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              خدمات المحاماة والاستشارات القانونية والمتابعة المباشرة لمختلف أنواع القضايا أمام المحاكم والجهات القضائية.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-3 border-r-2 border-amber-500 pr-2">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">عن المكتب</Link></li>
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">الخدمات القانونية</Link></li>
              <li><Link to="/consultation" className="hover:text-amber-400 transition-colors">طلب استشارة</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/privacy" className="hover:text-amber-400 transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-3 border-r-2 border-amber-500 pr-2">التواصل والمقر</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{OFFICE_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${OFFICE_INFO.phone}`} dir="ltr" className="hover:text-white transition-colors">{OFFICE_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`https://wa.me/2${OFFICE_INFO.whatsapp}`} target="_blank" rel="noreferrer" dir="ltr" className="hover:text-white transition-colors">{OFFICE_INFO.whatsapp}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white mb-3 border-r-2 border-amber-500 pr-2">الموقع والخرائط</h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={OFFICE_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>موقع المقر على الخريطة</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href={OFFICE_INFO.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
              >
                <span>صفحة فيسبوك الرسمية</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p className="text-slate-500">{OFFICE_INFO.name} © {new Date().getFullYear()}</p>

          <button
            onClick={() => setShowDevModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>تطوير وبرمجة:</span>
            <span className="font-black text-amber-500">{DEVELOPER_INFO.name}</span>
          </button>
        </div>
      </div>

      {showDevModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-white relative">
            <button
              onClick={() => setShowDevModal(false)}
              className="absolute left-5 top-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-black text-xl shadow-inner">
                <Code2 className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{DEVELOPER_INFO.name}</h3>
                <p className="text-xs text-amber-500 font-semibold">{DEVELOPER_INFO.title}</p>
                <span className="text-[10px] text-slate-400 block mt-0.5">مهندس برمجيات ومطور أنظمة رقمية سحابية</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              تم بناء وتطوير منصة مكتب الأستاذ محمود شعبان داخلي بأحدث معايير الويب السحابية لإدارة القضايا، الجلسات، الأرشيف المشفر والشات اللحظي.
            </p>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">قنوات التواصل والملفات المهنية:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={DEVELOPER_INFO.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-600 hover:text-white border border-slate-700/60 transition-all font-semibold"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>معرض الأعمال</span>
                </a>

                <a
                  href={DEVELOPER_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600 hover:text-white border border-slate-700/60 transition-all font-semibold"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>واتساب</span>
                </a>

                <a
                  href={DEVELOPER_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-700/60 transition-all font-semibold"
                >
                  <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>لينكد إن</span>
                </a>

                <a
                  href={DEVELOPER_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-all font-semibold"
                >
                  <svg className="w-4 h-4 fill-current text-slate-300" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  <span>جيت هاب</span>
                </a>

                <a
                  href={DEVELOPER_INFO.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-blue-700 hover:text-white border border-slate-700/60 transition-all font-semibold"
                >
                  <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>فيسبوك</span>
                </a>

                <a
                  href={DEVELOPER_INFO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-pink-600 hover:text-white border border-slate-700/60 transition-all font-semibold"
                >
                  <svg className="w-4 h-4 fill-pink-400" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>إنستجرام</span>
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => setShowDevModal(false)}
                className="w-full text-xs border-slate-700 text-slate-300 hover:bg-slate-800 py-2.5 rounded-xl"
              >
                إغلاق النافذة
              </Button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};