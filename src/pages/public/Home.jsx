import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  Award, 
  Users, 
  ArrowLeft, 
  Globe, 
  Code2, 
  MessageCircle,
  Terminal
} from 'lucide-react';
import { OFFICE_INFO } from '../../constants/theme';

export const Home = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20" dir="rtl">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black">
            <Scale className="w-4 h-4" />
            <span>ريادة قانونية وخبرة قضائية عريقة</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight max-w-4xl mx-auto">
            دفاع مستميت واستشارات قانونية دقيقة لحماية <span className="text-amber-600 dark:text-amber-500">حقوقك ومصالحك</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            مكتب {OFFICE_INFO?.name} يقدم منظومة متكاملة من الخدمات القضائية وصياغة العقود والترافع أمام كافة المحاكم بدقة واحترافية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/consultation"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-lg shadow-amber-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>طلب استشارة قانونية</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-850 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>استعراض الخدمات</span>
            </Link>
          </div>
        </div>
      </section>

      {/* المميزات الرئيسية */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">السرية والأمان التام</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              حفظ مشفر لكافة مستندات الدعوى وملفات الموكلين مع التزام مطلق بأخلاقيات المهنة وسرية البيانات.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">خبرة ترافع واسعة</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              سجل حافل بالنجاحات القضائية في مختلف الدوائر المدنية، الجنائية، والشركات ومجلس الدولة.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">متابعة إلكترونية لحظية</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              بوابة إلكترونية خاصة بكل موكل لمتابعة رول الجلسات وتطورات القضية والتواصل المباشر مع محاميه.
            </p>
          </div>
        </div>
      </section>

      {/* قسم توثيق المطور وروابط التواصل */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
                <Terminal className="w-4 h-4" />
                <span>هندسة وتطوير النظم البرمجية</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black">
                تم تطوير المنظومة بواسطة <span className="text-amber-500">Amr Othman</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                منصة رقمية قانونية متكاملة مبنية بأحدث معايير الأمان السحابي، التشفير اللحظي، وإدارة سير العمل القضائي لشركة <strong>OthmanVentures</strong>.
              </p>
            </div>

            {/* أزرار التواصل المباشرة */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href="https://amr-othman-portfolio.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>الموقع الشخصي</span>
              </a>

              <a
                href="https://www.linkedin.com/in/x-amr-othman-x1/"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 0 0 0-3.38 1.69 1.69 0 0 0 0 3.38m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href="https://github.com/0xAmr5"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-amber-500" />
                <span>GitHub</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-blue-400" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>

              <a
                href="https://wa.me/201009694831"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;