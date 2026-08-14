import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Shield,
  Award,
  BookOpen,
  Users,
  Clock,
  Briefcase,
  ChevronLeft,
  Sparkles,
  Code2,
  Globe,
  MessageSquare,
  Building2,
  Gavel,
  CheckCircle2,
} from 'lucide-react';
import { OFFICE_INFO, DEVELOPER_INFO } from '../../constants/theme';
import { Badge } from '../../components/ui';

export const Home = () => {
  const principles = [
    {
      icon: Shield,
      title: 'أمانة السر والمسؤولية',
      desc: 'حرمة أسرار الموكلين ميثاق شرف مهني لا مساومة عليه، نضع مصلحة الموكل فوق كل اعتبار.',
    },
    {
      icon: BookOpen,
      title: 'التأصيل الفقهي والقضائي',
      desc: 'لا نبني دفاعنا على مجرد نصوص جامدة، بل على دراسة عميقة لأحدث أحكام محكمة النقض ومبادئ المحكمة الدستورية.',
    },
    {
      icon: Gavel,
      title: 'الشفافية والوضوح التام',
      desc: 'نصارح العميل بحقيقة موقفه القانوني ونسب نجاح الدعوى دون إفراط في الوعود أو تهوين من الصعاب.',
    },
    {
      icon: Clock,
      title: 'المواكبة والرقمنة الفورية',
      desc: 'نظام إلكتروني داخلي يتيح للموكل الاطلاع على تطورات دعواه ومستنداتها بشفافية لحظة بلحظة.',
    },
  ];

  const highlights = [
    { number: '+15', label: 'عاماً من الترافع أمام مختلف المحاكم', icon: Award },
    { number: '100%', label: 'التزام كامل بميثاق الشرف والسرية', icon: Shield },
    { number: '+1200', label: 'مرافعة ودعوى قضائية ناجحة', icon: Scale },
    { number: '24/7', label: 'متابعة لحظية وتحديثات رقمية للموكلين', icon: Clock },
  ];

  return (
    <div className="space-y-28 pb-20 bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-white" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[650px] h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg backdrop-blur-md">
            <Scale className="w-4 h-4 text-amber-500" />
            <span>{OFFICE_INFO.name} للمحاماة والاستشارات القانونية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            صوت الحق.. ودفاع لا يتهاون <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              في محراب العدالة
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            المحاماة رسالة قبل أن تكون مهنة، نقف بجانبكم لرد الحقوق، صياغة الحماية القانونية، ومتابعة القضايا أمام المحاكم المصرية بنهج يجمع بين عراقة الفقه القانوني وحداثة الإدارة الرقمية.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/services"
              className="px-7 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-xl shadow-amber-950/80 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>استعراض الخدمات القانونية</span>
            </Link>
            <Link
              to="/consultation"
              className="px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-black transition-all flex items-center gap-2 transform hover:-translate-y-0.5 shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>طلب استشارة قانونية</span>
            </Link>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="max-w-6xl mx-auto px-6 w-full mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-4 text-center space-y-1">
                  <Icon className="w-5 h-5 text-amber-500 mx-auto mb-2 opacity-80" />
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{item.number}</div>
                  <div className="text-[11px] font-bold text-slate-400">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Philosophy & Principles */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-14">
          <Badge variant="warning" className="text-[11px] px-3 py-1 font-bold">ميثاقنا المهني</Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white">ركائز العمل في المكتب</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            مبادئ راسخة بني عليها المكتب لضمان أعلى مستويات الدقة والأمانة لموكلينا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800/80 hover:border-amber-500/50 p-6 rounded-3xl transition-all duration-300 group space-y-4 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-amber-950/20"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. About Brief Callout */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black text-white">هل تبحث عن توكيل قانوني أو استشارة متخصصة؟</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              فريقنا جاهز لدراسة ملف قضيتك وتقديم الحلول والإجراءات القضائية المناسبة بأسرع وقت وأعلى درجات الإحكام.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/about"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              عن المكتب ورؤيتنا
            </Link>
            <Link
              to="/consultation"
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-950/60"
            >
              حجز موعد استشارة
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Developer Spotlight (OthmanVentures) */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex items-center gap-5 text-center md:text-right flex-col md:flex-row">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-500 shadow-2xl shrink-0">
                <Code2 className="w-10 h-10 text-amber-500" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تطوير وبرمجة النظام | {DEVELOPER_INFO.company}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{DEVELOPER_INFO.name}</h3>
                <p className="text-xs text-amber-500 font-bold">{DEVELOPER_INFO.title} • {DEVELOPER_INFO.company}</p>
                <p className="text-xs text-slate-400 max-w-lg leading-relaxed pt-1">
                  تم تصميم وبناء هذه المنصة السحابية المتكاملة لرقمنة أعمال مكتب الأستاذ محمود شعبان داخلي؛ لتشمل إدارة الجلسات، القضايا، الأرشيف المشفر والشات المباشر مع الموكلين بأعلى معايير الأمان.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-black text-slate-300 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              <span>قنوات التواصل والملفات المهنية:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <a
                href={DEVELOPER_INFO.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-amber-600 hover:text-white transition-all font-bold group shadow-md"
              >
                <Globe className="w-4 h-4 text-amber-400 group-hover:text-white" />
                <span>المعرض</span>
              </a>

              <a
                href={DEVELOPER_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white transition-all font-bold group shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                <span>واتساب</span>
              </a>

              <a
                href={DEVELOPER_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 hover:text-white transition-all font-bold group shadow-md"
              >
                <svg className="w-4 h-4 fill-current text-slate-300 group-hover:text-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>جيت هاب</span>
              </a>

              <a
                href={DEVELOPER_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 hover:bg-blue-600 hover:text-white transition-all font-bold group shadow-md"
              >
                <svg className="w-4 h-4 fill-current text-blue-400 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>لينكد إن</span>
              </a>

              <a
                href={DEVELOPER_INFO.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-600 hover:bg-blue-700 hover:text-white transition-all font-bold group shadow-md"
              >
                <svg className="w-4 h-4 fill-blue-500 group-hover:fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>فيسبوك</span>
              </a>

              <a
                href={DEVELOPER_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500 hover:bg-pink-600 hover:text-white transition-all font-bold group shadow-md"
              >
                <svg className="w-4 h-4 fill-pink-400 group-hover:fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>إنستجرام</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;