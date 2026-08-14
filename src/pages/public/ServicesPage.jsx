import React from 'react';
import { Briefcase, Scale, Shield, Building2, Users, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage = () => {
  const services = [
    {
      title: 'القضايا المدنية والتعويضات',
      desc: 'المنازعات العقارية، عقود البيع والإيجار، دعاوى التعويض والمسؤولية المدنية.',
      icon: Scale,
    },
    {
      title: 'القضايا الجنائية والجنح',
      desc: 'الترافع أمام محاكم الجنايات والجنح والطعن على الأحكام بالنقض.',
      icon: Shield,
    },
    {
      title: 'قضايا الأسرة والأحوال الشخصية',
      desc: 'قضايا النفقات، الحضانة، المواريث والتركات، والنزاعات الأسرية.',
      icon: Users,
    },
    {
      title: 'تأسيس الشركات والقانون التجاري',
      desc: 'صياغة العقود التجارية، دمج وتأسيس الشركات واللوائح الداخلية.',
      icon: Building2,
    },
    {
      title: 'مجلس الدولة والقضاء الإداري',
      desc: 'الطعن على القرارات الإدارية، منازعات العقود الإدارية والترقيات.',
      icon: Briefcase,
    },
    {
      title: 'صياغة ومراجعة العقود القانونية',
      desc: 'صياغة العقود بمختلف أنواعها لضمان خلوها من أي ثغرات قانونية.',
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">خدماتنا واستشاراتنا القانونية</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          نغطي كافة التخصصات القضائية بتمكن واحترافية عالية لضمان أفضل نتيجة لموكلينا.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs hover:border-amber-500/50 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{srv.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{srv.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs text-center space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white">هل تحتاج إلى استشارة قانونية مخصصة؟</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">احجز موعد استشارتك الآن وسيتواصل معك المستشار المختص فوراً.</p>
        <Link
          to="/consultation"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shadow-md cursor-pointer transition-all"
        >
          <span>حجز استشارة فورية</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;